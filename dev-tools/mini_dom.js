// 一个极简但"真实"的DOM模拟：支持基本的树结构、innerHTML解析（简化版HTML parser）、
// querySelector(All)、closest、classList、事件监听+dispatch、cloneNode、previousElementSibling
// 目标：真实复现浏览器DOM行为，足够让我们的实际bug在这里暴露出来，而不是被stub"假装成功"掩盖

class FakeClassList {
  constructor(el) { this.el = el; }
  _list() { return (this.el._className || '').split(/\s+/).filter(Boolean); }
  add(c) { const l = this._list(); if (!l.includes(c)) { l.push(c); this.el._className = l.join(' '); } }
  remove(c) { this.el._className = this._list().filter(x => x !== c).join(' '); }
  contains(c) { return this._list().includes(c); }
  toggle(c, force) {
    const has = this.contains(c);
    if (force === true || (force === undefined && !has)) this.add(c);
    else this.remove(c);
  }
}

class FakeElement {
  constructor(tag) {
    this.tagName = (tag || 'div').toUpperCase();
    this._attrs = {};
    this._children = [];
    this.parentNode = null;
    this._eventListeners = {};
    this._style = {};
    this._className = '';
    this._textContent = '';
    this._value = '';
  }
  get id() { return this._attrs.id || ''; }
  set id(v) { this._attrs.id = v; }
  get className() { return this._className; }
  set className(v) { this._className = v; }
  get classList() { return new FakeClassList(this); }
  get style() {
    if (!this.__styleProxy) {
      const self = this;
      this.__styleProxy = new Proxy(this._style, {
        set(target, prop, value) { target[prop] = value; return true; },
        get(target, prop) { return target[prop]; }
      });
    }
    return this.__styleProxy;
  }
  setAttribute(k, v) { this._attrs[k] = String(v); }
  getAttribute(k) { return Object.prototype.hasOwnProperty.call(this._attrs, k) ? this._attrs[k] : null; }
  hasAttribute(k) { return Object.prototype.hasOwnProperty.call(this._attrs, k); }
  removeAttribute(k) { delete this._attrs[k]; }

  get textContent() {
    if (this._children.length === 0) return this._textContent;
    return this._children.map(c => c.textContent || '').join('');
  }
  set textContent(v) {
    this._textContent = v;
    this._children = [];
  }
  get value() { return this._value; }
  set value(v) { this._value = v; }

  get innerHTML() { return this._innerHTMLCache || ''; }
  set innerHTML(html) {
    this._innerHTMLCache = html;
    this._children = parseHTML(html, this);
  }
  get outerHTML() { return this.innerHTML; }

  appendChild(child) {
    child.parentNode = this;
    this._children.push(child);
    return child;
  }
  removeChild(child) {
    this._children = this._children.filter(c => c !== child);
    return child;
  }
  get children() { return this._children; }
  get firstElementChild() { return this._children[0] || null; }
  get previousElementSibling() {
    if (!this.parentNode) return null;
    const idx = this.parentNode._children.indexOf(this);
    return idx > 0 ? this.parentNode._children[idx - 1] : null;
  }
  get nextElementSibling() {
    if (!this.parentNode) return null;
    const idx = this.parentNode._children.indexOf(this);
    return idx >= 0 && idx < this.parentNode._children.length - 1 ? this.parentNode._children[idx + 1] : null;
  }

  cloneNode(deep) {
    const clone = new FakeElement(this.tagName);
    clone._attrs = Object.assign({}, this._attrs);
    clone._className = this._className;
    clone._style = Object.assign({}, this._style);
    clone._textContent = this._textContent;
    if (deep) {
      clone._children = this._children.map(c => {
        const cc = c.cloneNode(true);
        cc.parentNode = clone;
        return cc;
      });
    }
    return clone;
  }
  replaceChild(newChild, oldChild) {
    const idx = this._children.indexOf(oldChild);
    if (idx >= 0) {
      this._children[idx] = newChild;
      newChild.parentNode = this;
    }
    return oldChild;
  }

  addEventListener(type, fn) {
    if (!this._eventListeners[type]) this._eventListeners[type] = [];
    this._eventListeners[type].push(fn);
  }
  removeEventListener(type, fn) {
    if (this._eventListeners[type]) {
      this._eventListeners[type] = this._eventListeners[type].filter(f => f !== fn);
    }
  }

  // 模拟真实点击：从target开始往上冒泡，依次触发每层的click监听器（模拟事件冒泡）
  // 同时，document上挂的监听器也会在冒泡最后被触发（模拟document.addEventListener('click',...)）
  click(docRef) {
    let el = this;
    const path = [];
    while (el) { path.push(el); el = el.parentNode; }
    // closest() 的实现需要 path 信息，这里直接挂一个引用方便 closest 使用
    this.__clickPath = path;
    for (const node of path) {
      if (node._eventListeners.click) {
        node._eventListeners.click.forEach(fn => fn({ target: this, currentTarget: node }));
      }
    }
    if (docRef && docRef._eventListeners.click) {
      docRef._eventListeners.click.forEach(fn => fn({ target: this }));
    }
  }

  closest(selector) {
    let el = this;
    while (el) {
      if (matchesSelector(el, selector)) return el;
      el = el.parentNode;
    }
    return null;
  }

  querySelectorAll(selector) {
    const results = [];
    function walk(node) {
      for (const c of node._children || []) {
        if (matchesSelector(c, selector)) results.push(c);
        walk(c);
      }
    }
    walk(this);
    return results;
  }
  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }
}

// 极简选择器匹配：支持 #id, .class, [data-attr], tagname
function matchesSelector(el, selector) {
  selector = selector.trim();
  if (selector.startsWith('#')) return el.id === selector.slice(1);
  if (selector.startsWith('.')) return el.classList.contains(selector.slice(1));
  if (selector.startsWith('[') && selector.endsWith(']')) {
    const attr = selector.slice(1, -1);
    return el.hasAttribute(attr);
  }
  return el.tagName === selector.toUpperCase();
}

// 极简HTML字符串 -> FakeElement树 解析器
// 只需要支持我们项目里实际生成的简单标签结构：div/span/img/button等，
// 带 class= id= style= data-*= src= alt= 等属性，自闭合或正常闭合标签均可
function parseHTML(html, parentEl) {
  const children = [];
  let i = 0;
  const stack = [{ el: { _children: children }, }];

  function readTag() {
    const start = i;
    while (i < html.length && html[i] !== '>') i++;
    const tagContent = html.slice(start, i);
    i++; // 跳过 '>'
    return tagContent;
  }

  while (i < html.length) {
    if (html[i] === '<') {
      if (html[i + 1] === '/') {
        // 闭合标签
        i += 2;
        while (i < html.length && html[i] !== '>') i++;
        i++;
        if (stack.length > 1) stack.pop();
        continue;
      }
      i++;
      const tagContent = readTag();
      const selfClosing = tagContent.trim().endsWith('/');
      const cleanTag = tagContent.replace(/\/$/, '').trim();
      const tagNameMatch = cleanTag.match(/^([a-zA-Z][a-zA-Z0-9-]*)/);
      if (!tagNameMatch) continue;
      const tagName = tagNameMatch[1];
      const el = new FakeElement(tagName);

      // 解析属性（粗糙但够用：支持 key="value" 和 key='value'）
      const attrRe = /([a-zA-Z_-][a-zA-Z0-9_-]*)=("([^"]*)"|'([^']*)')/g;
      let m;
      while ((m = attrRe.exec(cleanTag))) {
        const key = m[1];
        const val = m[3] !== undefined ? m[3] : m[4];
        if (key === 'class') el._className = val;
        else if (key === 'style') {
          val.split(';').forEach(decl => {
            const [k, v] = decl.split(':');
            if (k && v) el._style[k.trim()] = v.trim();
          });
        } else {
          el._attrs[key] = val;
        }
      }

      const top = stack[stack.length - 1];
      el.parentNode = top.el === parentEl ? parentEl : top.el;
      top.el._children = top.el._children || [];
      top.el._children.push(el);

      const voidTags = ['img', 'br', 'input', 'hr'];
      if (!selfClosing && !voidTags.includes(tagName.toLowerCase())) {
        stack.push({ el });
      }
    } else {
      // 文本节点：简单跳过/拼到当前元素 textContent（这里简化处理，不单独建文本节点对象）
      const start = i;
      while (i < html.length && html[i] !== '<') i++;
      const text = html.slice(start, i).trim();
      if (text && stack.length > 0) {
        const top = stack[stack.length - 1].el;
        top._textContent = (top._textContent || '') + text;
      }
    }
  }
  children.forEach(c => { c.parentNode = parentEl; });
  return children;
}

class FakeDocument {
  constructor() {
    this._byId = {};
    this._eventListeners = {};
    this.body = new FakeElement('body');
  }
  registerStaticElement(id, el) {
    this._byId[id] = el;
    el.setAttribute('id', id);
  }
  getElementById(id) {
    return this._byId[id] || null;
  }
  createElement(tag) { return new FakeElement(tag); }
  addEventListener(type, fn) {
    if (!this._eventListeners[type]) this._eventListeners[type] = [];
    this._eventListeners[type].push(fn);
  }
  querySelectorAll(selector) {
    const results = [];
    const self = this;
    function walk(node) {
      for (const id in self._byId) {
        // 简化：全局静态元素也纳入扫描（实际场景中故事页内容在动态子树里，这里靠elementsRoot遍历更准确）
      }
    }
    // 用 elementsRoot 树做真实遍历
    return this.elementsRoot ? this.elementsRoot.querySelectorAll(selector) : [];
  }
  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }
}

module.exports = { FakeElement, FakeDocument, parseHTML };
