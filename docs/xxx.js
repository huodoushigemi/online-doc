const Ot = (e, t) => e === t, S = Symbol("solid-proxy"), St = typeof Proxy == "function", ie = Symbol("solid-track"), ge = {
  equals: Ot
};
let nt = lt;
const N = 1, me = 2, st = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var m = null;
let Oe = null, At = null, p = null, A = null, M = null, be = 0;
function Se(e, t) {
  const n = p, s = m, r = e.length === 0, i = s, l = r ? st : {
    owned: null,
    cleanups: null,
    context: i ? i.context : null,
    owner: i
  }, o = r ? e : () => e(() => D(() => le(l)));
  m = l, p = null;
  try {
    return K(o, !0);
  } finally {
    p = n, m = s;
  }
}
function _(e, t) {
  t = t ? Object.assign({}, ge, t) : ge;
  const n = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  }, s = (r) => (typeof r == "function" && (r = r(n.value)), ot(n, r));
  return [it.bind(n), s];
}
function oe(e, t, n) {
  const s = we(e, t, !0, N);
  ee(s);
}
function z(e, t, n) {
  const s = we(e, t, !1, N);
  ee(s);
}
function B(e, t, n) {
  nt = zt;
  const s = we(e, t, !1, N);
  s.user = !0, M ? M.push(s) : ee(s);
}
function b(e, t, n) {
  n = n ? Object.assign({}, ge, n) : ge;
  const s = we(e, t, !0, 0);
  return s.observers = null, s.observerSlots = null, s.comparator = n.equals || void 0, ee(s), it.bind(s);
}
function Q(e) {
  return K(e, !1);
}
function D(e) {
  if (p === null) return e();
  const t = p;
  p = null;
  try {
    return e();
  } finally {
    p = t;
  }
}
function rt(e) {
  B(() => D(e));
}
function F(e) {
  return m === null || (m.cleanups === null ? m.cleanups = [e] : m.cleanups.push(e)), e;
}
function U() {
  return p;
}
function Et() {
  return m;
}
function xt(e, t) {
  const n = m, s = p;
  m = e, p = null;
  try {
    return K(t, !0);
  } catch (r) {
    _e(r);
  } finally {
    m = n, p = s;
  }
}
const [Es, xs] = /* @__PURE__ */ _(!1);
function vt(e, t) {
  const n = Symbol("context");
  return {
    id: n,
    Provider: It(n),
    defaultValue: e
  };
}
function Z(e) {
  let t;
  return m && m.context && (t = m.context[e.id]) !== void 0 ? t : e.defaultValue;
}
function Tt(e) {
  const t = b(e), n = b(() => Te(t()));
  return n.toArray = () => {
    const s = n();
    return Array.isArray(s) ? s : s != null ? [s] : [];
  }, n;
}
function it() {
  if (this.sources && this.state)
    if (this.state === N) ee(this);
    else {
      const e = A;
      A = null, K(() => pe(this), !1), A = e;
    }
  if (p) {
    const e = this.observers ? this.observers.length : 0;
    p.sources ? (p.sources.push(this), p.sourceSlots.push(e)) : (p.sources = [this], p.sourceSlots = [e]), this.observers ? (this.observers.push(p), this.observerSlots.push(p.sources.length - 1)) : (this.observers = [p], this.observerSlots = [p.sources.length - 1]);
  }
  return this.value;
}
function ot(e, t, n) {
  let s = e.value;
  return (!e.comparator || !e.comparator(s, t)) && (e.value = t, e.observers && e.observers.length && K(() => {
    for (let r = 0; r < e.observers.length; r += 1) {
      const i = e.observers[r], l = Oe && Oe.running;
      l && Oe.disposed.has(i), (l ? !i.tState : !i.state) && (i.pure ? A.push(i) : M.push(i), i.observers && ct(i)), l || (i.state = N);
    }
    if (A.length > 1e6)
      throw A = [], new Error();
  }, !1)), t;
}
function ee(e) {
  if (!e.fn) return;
  le(e);
  const t = be;
  Pt(e, e.value, t);
}
function Pt(e, t, n) {
  let s;
  const r = m, i = p;
  p = m = e;
  try {
    s = e.fn(t);
  } catch (l) {
    return e.pure && (e.state = N, e.owned && e.owned.forEach(le), e.owned = null), e.updatedAt = n + 1, _e(l);
  } finally {
    p = i, m = r;
  }
  (!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? ot(e, s) : e.value = s, e.updatedAt = n);
}
function we(e, t, n, s = N, r) {
  const i = {
    fn: e,
    state: s,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: m,
    context: m ? m.context : null,
    pure: n
  };
  return m === null || m !== st && (m.owned ? m.owned.push(i) : m.owned = [i]), i;
}
function ye(e) {
  if (e.state === 0) return;
  if (e.state === me) return pe(e);
  if (e.suspense && D(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const t = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < be); )
    e.state && t.push(e);
  for (let n = t.length - 1; n >= 0; n--)
    if (e = t[n], e.state === N)
      ee(e);
    else if (e.state === me) {
      const s = A;
      A = null, K(() => pe(e, t[0]), !1), A = s;
    }
}
function K(e, t) {
  if (A) return e();
  let n = !1;
  t || (A = []), M ? n = !0 : M = [], be++;
  try {
    const s = e();
    return jt(n), s;
  } catch (s) {
    n || (M = null), A = null, _e(s);
  }
}
function jt(e) {
  if (A && (lt(A), A = null), e) return;
  const t = M;
  M = null, t.length && K(() => nt(t), !1);
}
function lt(e) {
  for (let t = 0; t < e.length; t++) ye(e[t]);
}
function zt(e) {
  let t, n = 0;
  for (t = 0; t < e.length; t++) {
    const s = e[t];
    s.user ? e[n++] = s : ye(s);
  }
  for (t = 0; t < n; t++) ye(e[t]);
}
function pe(e, t) {
  e.state = 0;
  for (let n = 0; n < e.sources.length; n += 1) {
    const s = e.sources[n];
    if (s.sources) {
      const r = s.state;
      r === N ? s !== t && (!s.updatedAt || s.updatedAt < be) && ye(s) : r === me && pe(s, t);
    }
  }
}
function ct(e) {
  for (let t = 0; t < e.observers.length; t += 1) {
    const n = e.observers[t];
    n.state || (n.state = me, n.pure ? A.push(n) : M.push(n), n.observers && ct(n));
  }
}
function le(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      const n = e.sources.pop(), s = e.sourceSlots.pop(), r = n.observers;
      if (r && r.length) {
        const i = r.pop(), l = n.observerSlots.pop();
        s < r.length && (i.sourceSlots[l] = s, r[s] = i, n.observerSlots[s] = l);
      }
    }
  if (e.tOwned) {
    for (t = e.tOwned.length - 1; t >= 0; t--) le(e.tOwned[t]);
    delete e.tOwned;
  }
  if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) le(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  e.state = 0;
}
function Ct(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function _e(e, t = m) {
  throw Ct(e);
}
function Te(e) {
  if (typeof e == "function" && !e.length) return Te(e());
  if (Array.isArray(e)) {
    const t = [];
    for (let n = 0; n < e.length; n++) {
      const s = Te(e[n]);
      Array.isArray(s) ? t.push.apply(t, s) : t.push(s);
    }
    return t;
  }
  return e;
}
function It(e, t) {
  return function(s) {
    let r;
    return z(() => r = D(() => (m.context = {
      ...m.context,
      [e]: s.value
    }, Tt(() => s.children))), void 0), r;
  };
}
const $t = Symbol("fallback");
function Le(e) {
  for (let t = 0; t < e.length; t++) e[t]();
}
function Pe(e, t, n = {}) {
  let s = [], r = [], i = [], l = 0, o = t.length > 1 ? [] : null;
  return F(() => Le(i)), () => {
    let c = e() || [], u = c.length, f, a;
    return c[ie], D(() => {
      let d, g, w, E, x, O, P, I, q;
      if (u === 0)
        l !== 0 && (Le(i), i = [], s = [], r = [], l = 0, o && (o = [])), n.fallback && (s = [$t], r[0] = Se((wt) => (i[0] = wt, n.fallback())), l = 1);
      else if (l === 0) {
        for (r = new Array(u), a = 0; a < u; a++)
          s[a] = c[a], r[a] = Se(h);
        l = u;
      } else {
        for (w = new Array(u), E = new Array(u), o && (x = new Array(u)), O = 0, P = Math.min(l, u); O < P && s[O] === c[O]; O++) ;
        for (P = l - 1, I = u - 1; P >= O && I >= O && s[P] === c[I]; P--, I--)
          w[I] = r[P], E[I] = i[P], o && (x[I] = o[P]);
        for (d = /* @__PURE__ */ new Map(), g = new Array(I + 1), a = I; a >= O; a--)
          q = c[a], f = d.get(q), g[a] = f === void 0 ? -1 : f, d.set(q, a);
        for (f = O; f <= P; f++)
          q = s[f], a = d.get(q), a !== void 0 && a !== -1 ? (w[a] = r[f], E[a] = i[f], o && (x[a] = o[f]), a = g[a], d.set(q, a)) : i[f]();
        for (a = O; a < u; a++)
          a in w ? (r[a] = w[a], i[a] = E[a], o && (o[a] = x[a], o[a](a))) : r[a] = Se(h);
        r = r.slice(0, l = u), s = c.slice(0);
      }
      return r;
    });
    function h(d) {
      if (i[a] = d, o) {
        const [g, w] = _(a);
        return o[a] = w, t(c[a], g);
      }
      return t(c[a]);
    }
  };
}
function y(e, t) {
  return D(() => e(t || {}));
}
function ae() {
  return !0;
}
const Mt = {
  get(e, t, n) {
    return t === S ? n : e.get(t);
  },
  has(e, t) {
    return t === S ? !0 : e.has(t);
  },
  set: ae,
  deleteProperty: ae,
  getOwnPropertyDescriptor(e, t) {
    return {
      configurable: !0,
      enumerable: !0,
      get() {
        return e.get(t);
      },
      set: ae,
      deleteProperty: ae
    };
  },
  ownKeys(e) {
    return e.keys();
  }
};
function Ae(e) {
  return (e = typeof e == "function" ? e() : e) ? e : {};
}
function _t() {
  for (let e = 0, t = this.length; e < t; ++e) {
    const n = this[e]();
    if (n !== void 0) return n;
  }
}
function T(...e) {
  let t = !1;
  for (let l = 0; l < e.length; l++) {
    const o = e[l];
    t = t || !!o && S in o, e[l] = typeof o == "function" ? (t = !0, b(o)) : o;
  }
  if (St && t)
    return new Proxy({
      get(l) {
        for (let o = e.length - 1; o >= 0; o--) {
          const c = Ae(e[o])[l];
          if (c !== void 0) return c;
        }
      },
      has(l) {
        for (let o = e.length - 1; o >= 0; o--)
          if (l in Ae(e[o])) return !0;
        return !1;
      },
      keys() {
        const l = [];
        for (let o = 0; o < e.length; o++) l.push(...Object.keys(Ae(e[o])));
        return [...new Set(l)];
      }
    }, Mt);
  const n = {}, s = /* @__PURE__ */ Object.create(null);
  for (let l = e.length - 1; l >= 0; l--) {
    const o = e[l];
    if (!o) continue;
    const c = Object.getOwnPropertyNames(o);
    for (let u = c.length - 1; u >= 0; u--) {
      const f = c[u];
      if (f === "__proto__" || f === "constructor") continue;
      const a = Object.getOwnPropertyDescriptor(o, f);
      if (!s[f])
        s[f] = a.get ? {
          enumerable: !0,
          configurable: !0,
          get: _t.bind(n[f] = [a.get.bind(o)])
        } : a.value !== void 0 ? a : void 0;
      else {
        const h = n[f];
        h && (a.get ? h.push(a.get.bind(o)) : a.value !== void 0 && h.push(() => a.value));
      }
    }
  }
  const r = {}, i = Object.keys(s);
  for (let l = i.length - 1; l >= 0; l--) {
    const o = i[l], c = s[o];
    c && c.get ? Object.defineProperty(r, o, c) : r[o] = c ? c.value : void 0;
  }
  return r;
}
function je(e) {
  const t = "fallback" in e && {
    fallback: () => e.fallback
  };
  return b(Pe(() => e.each, e.children, t || void 0));
}
const Rt = [
  "allowfullscreen",
  "async",
  "alpha",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "disabled",
  "formnovalidate",
  "hidden",
  "indeterminate",
  "inert",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "seamless",
  "selected",
  "adauctionheaders",
  "browsingtopics",
  "credentialless",
  "defaultchecked",
  "defaultmuted",
  "defaultselected",
  "defer",
  "disablepictureinpicture",
  "disableremoteplayback",
  "preservespitch",
  "shadowrootclonable",
  "shadowrootcustomelementregistry",
  "shadowrootdelegatesfocus",
  "shadowrootserializable",
  "sharedstoragewritable"
], Nt = /* @__PURE__ */ new Set([
  "className",
  "value",
  "readOnly",
  "noValidate",
  "formNoValidate",
  "isMap",
  "noModule",
  "playsInline",
  "adAuctionHeaders",
  "allowFullscreen",
  "browsingTopics",
  "defaultChecked",
  "defaultMuted",
  "defaultSelected",
  "disablePictureInPicture",
  "disableRemotePlayback",
  "preservesPitch",
  "shadowRootClonable",
  "shadowRootCustomElementRegistry",
  "shadowRootDelegatesFocus",
  "shadowRootSerializable",
  "sharedStorageWritable",
  ...Rt
]), Dt = /* @__PURE__ */ new Set(["innerHTML", "textContent", "innerText", "children"]), Lt = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  className: "class",
  htmlFor: "for"
}), Ft = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  class: "className",
  novalidate: {
    $: "noValidate",
    FORM: 1
  },
  formnovalidate: {
    $: "formNoValidate",
    BUTTON: 1,
    INPUT: 1
  },
  ismap: {
    $: "isMap",
    IMG: 1
  },
  nomodule: {
    $: "noModule",
    SCRIPT: 1
  },
  playsinline: {
    $: "playsInline",
    VIDEO: 1
  },
  readonly: {
    $: "readOnly",
    INPUT: 1,
    TEXTAREA: 1
  },
  adauctionheaders: {
    $: "adAuctionHeaders",
    IFRAME: 1
  },
  allowfullscreen: {
    $: "allowFullscreen",
    IFRAME: 1
  },
  browsingtopics: {
    $: "browsingTopics",
    IMG: 1
  },
  defaultchecked: {
    $: "defaultChecked",
    INPUT: 1
  },
  defaultmuted: {
    $: "defaultMuted",
    AUDIO: 1,
    VIDEO: 1
  },
  defaultselected: {
    $: "defaultSelected",
    OPTION: 1
  },
  disablepictureinpicture: {
    $: "disablePictureInPicture",
    VIDEO: 1
  },
  disableremoteplayback: {
    $: "disableRemotePlayback",
    AUDIO: 1,
    VIDEO: 1
  },
  preservespitch: {
    $: "preservesPitch",
    AUDIO: 1,
    VIDEO: 1
  },
  shadowrootclonable: {
    $: "shadowRootClonable",
    TEMPLATE: 1
  },
  shadowrootdelegatesfocus: {
    $: "shadowRootDelegatesFocus",
    TEMPLATE: 1
  },
  shadowrootserializable: {
    $: "shadowRootSerializable",
    TEMPLATE: 1
  },
  sharedstoragewritable: {
    $: "sharedStorageWritable",
    IFRAME: 1,
    IMG: 1
  }
});
function Vt(e, t) {
  const n = Ft[e];
  return typeof n == "object" ? n[t] ? n.$ : void 0 : n;
}
const kt = /* @__PURE__ */ new Set(["beforeinput", "click", "dblclick", "contextmenu", "focusin", "focusout", "input", "keydown", "keyup", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "pointerdown", "pointermove", "pointerout", "pointerover", "pointerup", "touchend", "touchmove", "touchstart"]), Bt = (e) => b(() => e());
function Ut(e, t, n) {
  let s = n.length, r = t.length, i = s, l = 0, o = 0, c = t[r - 1].nextSibling, u = null;
  for (; l < r || o < i; ) {
    if (t[l] === n[o]) {
      l++, o++;
      continue;
    }
    for (; t[r - 1] === n[i - 1]; )
      r--, i--;
    if (r === l) {
      const f = i < s ? o ? n[o - 1].nextSibling : n[i - o] : c;
      for (; o < i; ) e.insertBefore(n[o++], f);
    } else if (i === o)
      for (; l < r; )
        (!u || !u.has(t[l])) && t[l].remove(), l++;
    else if (t[l] === n[i - 1] && n[o] === t[r - 1]) {
      const f = t[--r].nextSibling;
      e.insertBefore(n[o++], t[l++].nextSibling), e.insertBefore(n[--i], f), t[r] = n[i];
    } else {
      if (!u) {
        u = /* @__PURE__ */ new Map();
        let a = o;
        for (; a < i; ) u.set(n[a], a++);
      }
      const f = u.get(t[l]);
      if (f != null)
        if (o < f && f < i) {
          let a = l, h = 1, d;
          for (; ++a < r && a < i && !((d = u.get(t[a])) == null || d !== f + h); )
            h++;
          if (h > f - o) {
            const g = t[l];
            for (; o < f; ) e.insertBefore(n[o++], g);
          } else e.replaceChild(n[o++], t[l++]);
        } else l++;
      else t[l++].remove();
    }
  }
}
const Fe = "_$DX_DELEGATE";
function L(e, t, n, s) {
  let r;
  const i = () => {
    const o = document.createElement("template");
    return o.innerHTML = e, o.content.firstChild;
  }, l = () => (r || (r = i())).cloneNode(!0);
  return l.cloneNode = l, l;
}
function Re(e, t = window.document) {
  const n = t[Fe] || (t[Fe] = /* @__PURE__ */ new Set());
  for (let s = 0, r = e.length; s < r; s++) {
    const i = e[s];
    n.has(i) || (n.add(i), t.addEventListener(i, Zt));
  }
}
function ze(e, t, n) {
  n == null ? e.removeAttribute(t) : e.setAttribute(t, n);
}
function Wt(e, t, n) {
  n ? e.setAttribute(t, "") : e.removeAttribute(t);
}
function Kt(e, t) {
  t == null ? e.removeAttribute("class") : e.className = t;
}
function qt(e, t, n, s) {
  if (s)
    Array.isArray(n) ? (e[`$$${t}`] = n[0], e[`$$${t}Data`] = n[1]) : e[`$$${t}`] = n;
  else if (Array.isArray(n)) {
    const r = n[0];
    e.addEventListener(t, n[0] = (i) => r.call(e, n[1], i));
  } else e.addEventListener(t, n, typeof n != "function" && n);
}
function Xt(e, t, n = {}) {
  const s = Object.keys(t || {}), r = Object.keys(n);
  let i, l;
  for (i = 0, l = r.length; i < l; i++) {
    const o = r[i];
    !o || o === "undefined" || t[o] || (Ve(e, o, !1), delete n[o]);
  }
  for (i = 0, l = s.length; i < l; i++) {
    const o = s[i], c = !!t[o];
    !o || o === "undefined" || n[o] === c || !c || (Ve(e, o, !0), n[o] = c);
  }
  return n;
}
function Ne(e, t, n) {
  if (!t) return n ? ze(e, "style") : t;
  const s = e.style;
  if (typeof t == "string") return s.cssText = t;
  typeof n == "string" && (s.cssText = n = void 0), n || (n = {}), t || (t = {});
  let r, i;
  for (i in n)
    t[i] == null && s.removeProperty(i), delete n[i];
  for (i in t)
    r = t[i], r !== n[i] && (s.setProperty(i, r), n[i] = r);
  return n;
}
function X(e, t = {}, n, s) {
  const r = {};
  return z(() => r.children = ce(e, t.children, r.children)), z(() => typeof t.ref == "function" && Ht(t.ref, e)), z(() => Gt(e, t, n, !0, r, !0)), r;
}
function Ht(e, t, n) {
  return D(() => e(t, n));
}
function Yt(e, t, n, s) {
  if (typeof t != "function") return ce(e, t, s, n);
  z((r) => ce(e, t(), r, n), s);
}
function Gt(e, t, n, s, r = {}, i = !1) {
  t || (t = {});
  for (const l in r)
    if (!(l in t)) {
      if (l === "children") continue;
      r[l] = ke(e, l, null, r[l], n, i, t);
    }
  for (const l in t) {
    if (l === "children")
      continue;
    const o = t[l];
    r[l] = ke(e, l, o, r[l], n, i, t);
  }
}
function Qt(e) {
  return e.toLowerCase().replace(/-([a-z])/g, (t, n) => n.toUpperCase());
}
function Ve(e, t, n) {
  const s = t.trim().split(/\s+/);
  for (let r = 0, i = s.length; r < i; r++) e.classList.toggle(s[r], n);
}
function ke(e, t, n, s, r, i, l) {
  let o, c, u, f, a;
  if (t === "style") return Ne(e, n, s);
  if (t === "classList") return Xt(e, n, s);
  if (n === s) return s;
  if (t === "ref")
    i || n(e);
  else if (t.slice(0, 3) === "on:") {
    const h = t.slice(3);
    s && e.removeEventListener(h, s, typeof s != "function" && s), n && e.addEventListener(h, n, typeof n != "function" && n);
  } else if (t.slice(0, 10) === "oncapture:") {
    const h = t.slice(10);
    s && e.removeEventListener(h, s, !0), n && e.addEventListener(h, n, !0);
  } else if (t.slice(0, 2) === "on") {
    const h = t.slice(2).toLowerCase(), d = kt.has(h);
    if (!d && s) {
      const g = Array.isArray(s) ? s[0] : s;
      e.removeEventListener(h, g);
    }
    (d || n) && (qt(e, h, n, d), d && Re([h]));
  } else t.slice(0, 5) === "attr:" ? ze(e, t.slice(5), n) : t.slice(0, 5) === "bool:" ? Wt(e, t.slice(5), n) : (a = t.slice(0, 5) === "prop:") || (u = Dt.has(t)) || (f = Vt(t, e.tagName)) || (c = Nt.has(t)) || (o = e.nodeName.includes("-") || "is" in l) ? (a && (t = t.slice(5), c = !0), t === "class" || t === "className" ? Kt(e, n) : o && !c && !u ? e[Qt(t)] = n : e[f || t] = n) : ze(e, Lt[t] || t, n);
  return n;
}
function Zt(e) {
  let t = e.target;
  const n = `$$${e.type}`, s = e.target, r = e.currentTarget, i = (c) => Object.defineProperty(e, "target", {
    configurable: !0,
    value: c
  }), l = () => {
    const c = t[n];
    if (c && !t.disabled) {
      const u = t[`${n}Data`];
      if (u !== void 0 ? c.call(t, u, e) : c.call(t, e), e.cancelBubble) return;
    }
    return t.host && typeof t.host != "string" && !t.host._$host && t.contains(e.target) && i(t.host), !0;
  }, o = () => {
    for (; l() && (t = t._$host || t.parentNode || t.host); ) ;
  };
  if (Object.defineProperty(e, "currentTarget", {
    configurable: !0,
    get() {
      return t || document;
    }
  }), e.composedPath) {
    const c = e.composedPath();
    i(c[0]);
    for (let u = 0; u < c.length - 2 && (t = c[u], !!l()); u++) {
      if (t._$host) {
        t = t._$host, o();
        break;
      }
      if (t.parentNode === r)
        break;
    }
  } else o();
  i(s);
}
function ce(e, t, n, s, r) {
  for (; typeof n == "function"; ) n = n();
  if (t === n) return n;
  const i = typeof t;
  if (e = e, i === "string" || i === "number") {
    if (i === "number" && (t = t.toString(), t === n))
      return n;
    n !== "" && typeof n == "string" ? n = e.firstChild.data = t : n = e.textContent = t;
  } else if (t == null || i === "boolean")
    n = he(e, n, s);
  else {
    if (i === "function")
      return z(() => {
        let l = t();
        for (; typeof l == "function"; ) l = l();
        n = ce(e, l, n, s);
      }), () => n;
    if (Array.isArray(t)) {
      const l = [], o = n && Array.isArray(n);
      if (Ce(l, t, n, r))
        return z(() => n = ce(e, l, n, s, !0)), () => n;
      l.length === 0 ? n = he(e, n, s) : o ? n.length === 0 ? Be(e, l, s) : Ut(e, n, l) : (n && he(e), Be(e, l)), n = l;
    } else t.nodeType && (Array.isArray(n) ? he(e, n, null, t) : n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild), n = t);
  }
  return n;
}
function Ce(e, t, n, s) {
  let r = !1;
  for (let i = 0, l = t.length; i < l; i++) {
    let o = t[i], c = n && n[e.length], u;
    if (!(o == null || o === !0 || o === !1)) if ((u = typeof o) == "object" && o.nodeType)
      e.push(o);
    else if (Array.isArray(o))
      r = Ce(e, o, c) || r;
    else if (u === "function")
      if (s) {
        for (; typeof o == "function"; ) o = o();
        r = Ce(e, Array.isArray(o) ? o : [o], Array.isArray(c) ? c : [c]) || r;
      } else
        e.push(o), r = !0;
    else {
      const f = String(o);
      c && c.nodeType === 3 && c.data === f ? e.push(c) : e.push(document.createTextNode(f));
    }
  }
  return r;
}
function Be(e, t, n = null) {
  for (let s = 0, r = t.length; s < r; s++) e.insertBefore(t[s], n);
}
function he(e, t, n, s) {
  if (n === void 0) return e.textContent = "";
  const r = s || document.createTextNode("");
  if (t.length) {
    let i = !1;
    for (let l = t.length - 1; l >= 0; l--) {
      const o = t[l];
      if (r !== o) {
        const c = o.parentNode === e;
        !i && !l ? c ? e.replaceChild(r, o) : e.insertBefore(r, n) : c && o.remove();
      } else i = !0;
    }
  } else e.insertBefore(r, n);
  return [r];
}
function Jt(e, t) {
  const n = new Set(t);
  return e.filter((s) => !n.has(s));
}
function en() {
}
function tn(e) {
  let t = 0;
  for (let n = 0; n < e.length; n++)
    t += e[n];
  return t;
}
function Ue(e) {
  return Object.getOwnPropertySymbols(e).filter((t) => Object.prototype.propertyIsEnumerable.call(e, t));
}
function We(e) {
  return e == null ? e === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(e);
}
const nn = "[object RegExp]", sn = "[object String]", rn = "[object Number]", on = "[object Boolean]", Ke = "[object Arguments]", ln = "[object Symbol]", cn = "[object Date]", un = "[object Map]", fn = "[object Set]", an = "[object Array]", hn = "[object Function]", dn = "[object ArrayBuffer]", Ee = "[object Object]", gn = "[object Error]", mn = "[object DataView]", yn = "[object Uint8Array]", pn = "[object Uint8ClampedArray]", bn = "[object Uint16Array]", wn = "[object Uint32Array]", On = "[object BigUint64Array]", Sn = "[object Int8Array]", An = "[object Int16Array]", En = "[object Int32Array]", xn = "[object BigInt64Array]", vn = "[object Float32Array]", Tn = "[object Float64Array]";
function qe(e) {
  if (!e || typeof e != "object")
    return !1;
  const t = Object.getPrototypeOf(e);
  return t === null || t === Object.prototype || Object.getPrototypeOf(t) === null ? Object.prototype.toString.call(e) === "[object Object]" : !1;
}
function Pn(e, t) {
  const n = {}, s = Object.keys(e);
  for (let r = 0; r < s.length; r++) {
    const i = s[r], l = e[i];
    n[i] = t(l, i, e);
  }
  return n;
}
function jn(e, t) {
  return e === t || Number.isNaN(e) && Number.isNaN(t);
}
function zn(e, t, n) {
  return ne(e, t, void 0, void 0, void 0, void 0, n);
}
function ne(e, t, n, s, r, i, l) {
  const o = l(e, t, n, s, r, i);
  if (o !== void 0)
    return o;
  if (typeof e == typeof t)
    switch (typeof e) {
      case "bigint":
      case "string":
      case "boolean":
      case "symbol":
      case "undefined":
        return e === t;
      case "number":
        return e === t || Object.is(e, t);
      case "function":
        return e === t;
      case "object":
        return re(e, t, i, l);
    }
  return re(e, t, i, l);
}
function re(e, t, n, s) {
  if (Object.is(e, t))
    return !0;
  let r = We(e), i = We(t);
  if (r === Ke && (r = Ee), i === Ke && (i = Ee), r !== i)
    return !1;
  switch (r) {
    case sn:
      return e.toString() === t.toString();
    case rn: {
      const c = e.valueOf(), u = t.valueOf();
      return jn(c, u);
    }
    case on:
    case cn:
    case ln:
      return Object.is(e.valueOf(), t.valueOf());
    case nn:
      return e.source === t.source && e.flags === t.flags;
    case hn:
      return e === t;
  }
  n = n ?? /* @__PURE__ */ new Map();
  const l = n.get(e), o = n.get(t);
  if (l != null && o != null)
    return l === t;
  n.set(e, t), n.set(t, e);
  try {
    switch (r) {
      case un: {
        if (e.size !== t.size)
          return !1;
        for (const [c, u] of e.entries())
          if (!t.has(c) || !ne(u, t.get(c), c, e, t, n, s))
            return !1;
        return !0;
      }
      case fn: {
        if (e.size !== t.size)
          return !1;
        const c = Array.from(e.values()), u = Array.from(t.values());
        for (let f = 0; f < c.length; f++) {
          const a = c[f], h = u.findIndex((d) => ne(a, d, void 0, e, t, n, s));
          if (h === -1)
            return !1;
          u.splice(h, 1);
        }
        return !0;
      }
      case an:
      case yn:
      case pn:
      case bn:
      case wn:
      case On:
      case Sn:
      case An:
      case En:
      case xn:
      case vn:
      case Tn: {
        if (typeof Buffer < "u" && Buffer.isBuffer(e) !== Buffer.isBuffer(t) || e.length !== t.length)
          return !1;
        for (let c = 0; c < e.length; c++)
          if (!ne(e[c], t[c], c, e, t, n, s))
            return !1;
        return !0;
      }
      case dn:
        return e.byteLength !== t.byteLength ? !1 : re(new Uint8Array(e), new Uint8Array(t), n, s);
      case mn:
        return e.byteLength !== t.byteLength || e.byteOffset !== t.byteOffset ? !1 : re(new Uint8Array(e), new Uint8Array(t), n, s);
      case gn:
        return e.name === t.name && e.message === t.message;
      case Ee: {
        if (!(re(e.constructor, t.constructor, n, s) || qe(e) && qe(t)))
          return !1;
        const u = [...Object.keys(e), ...Ue(e)], f = [...Object.keys(t), ...Ue(t)];
        if (u.length !== f.length)
          return !1;
        for (let a = 0; a < u.length; a++) {
          const h = u[a], d = e[h];
          if (!Object.hasOwn(t, h))
            return !1;
          const g = t[h];
          if (!ne(d, g, h, e, t, n, s))
            return !1;
        }
        return !0;
      }
      default:
        return !1;
    }
  } finally {
    n.delete(e), n.delete(t);
  }
}
function H(e, t) {
  return zn(e, t, en);
}
const ue = Symbol("store-raw"), C = Symbol("store-node"), j = Symbol("store-has"), ut = Symbol("store-self");
function ft(e) {
  let t = e[S];
  if (!t && (Object.defineProperty(e, S, {
    value: t = new Proxy(e, In)
  }), !Array.isArray(e))) {
    const n = Object.keys(e), s = Object.getOwnPropertyDescriptors(e);
    for (let r = 0, i = n.length; r < i; r++) {
      const l = n[r];
      s[l].get && Object.defineProperty(e, l, {
        enumerable: s[l].enumerable,
        get: s[l].get.bind(t)
      });
    }
  }
  return t;
}
function R(e) {
  let t;
  return e != null && typeof e == "object" && (e[S] || !(t = Object.getPrototypeOf(e)) || t === Object.prototype || Array.isArray(e));
}
function V(e, t = /* @__PURE__ */ new Set()) {
  let n, s, r, i;
  if (n = e != null && e[ue]) return n;
  if (!R(e) || t.has(e)) return e;
  if (Array.isArray(e)) {
    Object.isFrozen(e) ? e = e.slice(0) : t.add(e);
    for (let l = 0, o = e.length; l < o; l++)
      r = e[l], (s = V(r, t)) !== r && (e[l] = s);
  } else {
    Object.isFrozen(e) ? e = Object.assign({}, e) : t.add(e);
    const l = Object.keys(e), o = Object.getOwnPropertyDescriptors(e);
    for (let c = 0, u = l.length; c < u; c++)
      i = l[c], !o[i].get && (r = e[i], (s = V(r, t)) !== r && (e[i] = s));
  }
  return e;
}
function J(e, t) {
  let n = e[t];
  return n || Object.defineProperty(e, t, {
    value: n = /* @__PURE__ */ Object.create(null)
  }), n;
}
function W(e, t, n) {
  if (e[t]) return e[t];
  const [s, r] = _(n, {
    equals: !1,
    internal: !0
  });
  return s.$ = r, e[t] = s;
}
function Cn(e, t) {
  const n = Reflect.getOwnPropertyDescriptor(e, t);
  return !n || n.get || !n.configurable || t === S || t === C || (delete n.value, delete n.writable, n.get = () => e[S][t]), n;
}
function De(e) {
  U() && W(J(e, C), ut)();
}
function at(e) {
  return De(e), Reflect.ownKeys(e);
}
const In = {
  get(e, t, n) {
    if (t === ue) return e;
    if (t === S) return n;
    if (t === ie)
      return De(e), n;
    const s = J(e, C), r = s[t];
    let i = r ? r() : e[t];
    if (t === C || t === j || t === "__proto__") return i;
    if (!r) {
      const l = Object.getOwnPropertyDescriptor(e, t);
      U() && (typeof i != "function" || e.hasOwnProperty(t)) && !(l && l.get) && (i = W(s, t, i)());
    }
    return R(i) ? ft(i) : i;
  },
  has(e, t) {
    return t === ue || t === S || t === ie || t === C || t === j || t === "__proto__" ? !0 : (U() && W(J(e, j), t)(), t in e);
  },
  set() {
    return !0;
  },
  deleteProperty() {
    return !0;
  },
  ownKeys: at,
  getOwnPropertyDescriptor: Cn
};
function v(e, t, n, s = !1) {
  if (!s && e[t] === n) return;
  const r = e[t], i = e.length;
  n === void 0 ? (delete e[t], e[j] && e[j][t] && r !== void 0 && e[j][t].$()) : (e[t] = n, e[j] && e[j][t] && r === void 0 && e[j][t].$());
  let l = J(e, C), o;
  if ((o = W(l, t, r)) && o.$(() => n), Array.isArray(e) && e.length !== i) {
    for (let c = e.length; c < i; c++) (o = l[c]) && o.$();
    (o = W(l, "length", i)) && o.$(e.length);
  }
  (o = l[ut]) && o.$();
}
function ht(e, t) {
  const n = Object.keys(t);
  for (let s = 0; s < n.length; s += 1) {
    const r = n[s];
    v(e, r, t[r]);
  }
}
function $n(e, t) {
  if (typeof t == "function" && (t = t(e)), t = V(t), Array.isArray(t)) {
    if (e === t) return;
    let n = 0, s = t.length;
    for (; n < s; n++) {
      const r = t[n];
      e[n] !== r && v(e, n, r);
    }
    v(e, "length", s);
  } else ht(e, t);
}
function se(e, t, n = []) {
  let s, r = e;
  if (t.length > 1) {
    s = t.shift();
    const l = typeof s, o = Array.isArray(e);
    if (Array.isArray(s)) {
      for (let c = 0; c < s.length; c++)
        se(e, [s[c]].concat(t), n);
      return;
    } else if (o && l === "function") {
      for (let c = 0; c < e.length; c++)
        s(e[c], c) && se(e, [c].concat(t), n);
      return;
    } else if (o && l === "object") {
      const {
        from: c = 0,
        to: u = e.length - 1,
        by: f = 1
      } = s;
      for (let a = c; a <= u; a += f)
        se(e, [a].concat(t), n);
      return;
    } else if (t.length > 1) {
      se(e[s], t, [s].concat(n));
      return;
    }
    r = e[s], n = [s].concat(n);
  }
  let i = t[0];
  typeof i == "function" && (i = i(r, n), i === r) || s === void 0 && i == null || (i = V(i), s === void 0 || R(r) && R(i) && !Array.isArray(i) ? ht(r, i) : v(e, s, i));
}
function dt(...[e, t]) {
  const n = V(e || {}), s = Array.isArray(n), r = ft(n);
  function i(...l) {
    Q(() => {
      s && l.length === 1 ? $n(n, l[0]) : se(n, l);
    });
  }
  return [r, i];
}
function Mn(e, t) {
  const n = Reflect.getOwnPropertyDescriptor(e, t);
  return !n || n.get || n.set || !n.configurable || t === S || t === C || (delete n.value, delete n.writable, n.get = () => e[S][t], n.set = (s) => e[S][t] = s), n;
}
const _n = {
  get(e, t, n) {
    if (t === ue) return e;
    if (t === S) return n;
    if (t === ie)
      return De(e), n;
    const s = J(e, C), r = s[t];
    let i = r ? r() : e[t];
    if (t === C || t === j || t === "__proto__") return i;
    if (!r) {
      const l = Object.getOwnPropertyDescriptor(e, t), o = typeof i == "function";
      if (U() && (!o || e.hasOwnProperty(t)) && !(l && l.get)) i = W(s, t, i)();
      else if (i != null && o && i === Array.prototype[t])
        return (...c) => Q(() => Array.prototype[t].apply(n, c));
    }
    return R(i) ? gt(i) : i;
  },
  has(e, t) {
    return t === ue || t === S || t === ie || t === C || t === j || t === "__proto__" ? !0 : (U() && W(J(e, j), t)(), t in e);
  },
  set(e, t, n) {
    return Q(() => v(e, t, V(n))), !0;
  },
  deleteProperty(e, t) {
    return Q(() => v(e, t, void 0, !0)), !0;
  },
  ownKeys: at,
  getOwnPropertyDescriptor: Mn
};
function gt(e) {
  let t = e[S];
  if (!t) {
    Object.defineProperty(e, S, {
      value: t = new Proxy(e, _n)
    });
    const n = Object.keys(e), s = Object.getOwnPropertyDescriptors(e), r = Object.getPrototypeOf(e), i = r !== null && e !== null && typeof e == "object" && !Array.isArray(e) && r !== Object.prototype;
    if (i) {
      let l = r;
      for (; l != null; ) {
        const o = Object.getOwnPropertyDescriptors(l);
        n.push(...Object.keys(o)), Object.assign(s, o), l = Object.getPrototypeOf(l);
      }
    }
    for (let l = 0, o = n.length; l < o; l++) {
      const c = n[l];
      if (!(i && c === "constructor")) {
        if (s[c].get) {
          const u = s[c].get.bind(t);
          Object.defineProperty(e, c, {
            get: u,
            configurable: !0
          });
        }
        if (s[c].set) {
          const u = s[c].set;
          Object.defineProperty(e, c, {
            set: (a) => Q(() => u.call(t, a)),
            configurable: !0
          });
        }
      }
    }
  }
  return t;
}
function Ie(e, t) {
  const n = V(e || {});
  return gt(n);
}
const $e = Symbol("store-root");
function G(e, t, n, s, r) {
  const i = t[n];
  if (e === i) return;
  const l = Array.isArray(e);
  if (n !== $e && (!R(e) || !R(i) || l !== Array.isArray(i) || r && e[r] !== i[r])) {
    v(t, n, e);
    return;
  }
  if (l) {
    if (e.length && i.length && (!s || r && e[0] && e[0][r] != null)) {
      let u, f, a, h, d, g, w, E;
      for (a = 0, h = Math.min(i.length, e.length); a < h && (i[a] === e[a] || r && i[a] && e[a] && i[a][r] && i[a][r] === e[a][r]); a++)
        G(e[a], i, a, s, r);
      const x = new Array(e.length), O = /* @__PURE__ */ new Map();
      for (h = i.length - 1, d = e.length - 1; h >= a && d >= a && (i[h] === e[d] || r && i[h] && e[d] && i[h][r] && i[h][r] === e[d][r]); h--, d--)
        x[d] = i[h];
      if (a > d || a > h) {
        for (f = a; f <= d; f++) v(i, f, e[f]);
        for (; f < e.length; f++)
          v(i, f, x[f]), G(e[f], i, f, s, r);
        i.length > e.length && v(i, "length", e.length);
        return;
      }
      for (w = new Array(d + 1), f = d; f >= a; f--)
        g = e[f], E = r && g ? g[r] : g, u = O.get(E), w[f] = u === void 0 ? -1 : u, O.set(E, f);
      for (u = a; u <= h; u++)
        g = i[u], E = r && g ? g[r] : g, f = O.get(E), f !== void 0 && f !== -1 && (x[f] = i[u], f = w[f], O.set(E, f));
      for (f = a; f < e.length; f++)
        f in x ? (v(i, f, x[f]), G(e[f], i, f, s, r)) : v(i, f, e[f]);
    } else
      for (let u = 0, f = e.length; u < f; u++)
        G(e[u], i, u, s, r);
    i.length > e.length && v(i, "length", e.length);
    return;
  }
  const o = Object.keys(e);
  for (let u = 0, f = o.length; u < f; u++)
    G(e[o[u]], i, o[u], s, r);
  const c = Object.keys(i);
  for (let u = 0, f = c.length; u < f; u++)
    e[c[u]] === void 0 && v(i, c[u], void 0);
}
function mt(e, t = {}) {
  const {
    merge: n,
    key: s = "id"
  } = t, r = V(e);
  return (i) => {
    if (!R(i) || !R(r)) return r;
    const l = G(r, {
      [$e]: i
    }, $e, n, s);
    return l === void 0 ? i : l;
  };
}
function de() {
  return !0;
}
const Rn = {
  get(e, t, n) {
    return t === S ? n : e.get(t);
  },
  has(e, t) {
    return e.has(t);
  },
  set: de,
  deleteProperty: de,
  getOwnPropertyDescriptor(e, t) {
    return {
      configurable: !0,
      enumerable: !0,
      get() {
        return e.get(t);
      },
      set: de,
      deleteProperty: de
    };
  },
  ownKeys(e) {
    return e.keys();
  }
};
function Nn(e) {
  return e !== null && (typeof e == "object" || typeof e == "function");
}
function Dn(e) {
  return (...t) => {
    for (const n of e)
      n && n(...t);
  };
}
function Ln(e) {
  return (...t) => {
    for (let n = e.length - 1; n >= 0; n--) {
      const s = e[n];
      s && s(...t);
    }
  };
}
const fe = (e) => typeof e == "function" && !e.length ? e() : e, Xe = (e) => Array.isArray(e) ? e : e ? [e] : [];
function He(e, ...t) {
  return typeof e == "function" ? e(...t) : e;
}
const Fn = F, Vn = /((?:--)?(?:\w+-?)+)\s*:\s*([^;]*)/g;
function Ye(e) {
  const t = {};
  let n;
  for (; n = Vn.exec(e); )
    t[n[1]] = n[2];
  return t;
}
function kn(e, t) {
  if (typeof e == "string") {
    if (typeof t == "string")
      return `${e};${t}`;
    e = Ye(e);
  } else typeof t == "string" && (t = Ye(t));
  return { ...e, ...t };
}
const xe = (e, t, n) => {
  let s;
  for (const r of e) {
    const i = fe(r)[t];
    s ? i && (s = n(s, i)) : s = i;
  }
  return s;
};
function $(...e) {
  var l;
  const t = Array.isArray(e[0]), n = t ? e[0] : e;
  if (n.length === 1)
    return n[0];
  const s = t && ((l = e[1]) != null && l.reverseEventHandlers) ? Ln : Dn, r = {};
  for (const o of n) {
    const c = fe(o);
    for (const u in c)
      if (u[0] === "o" && u[1] === "n" && u[2]) {
        const f = c[u], a = u.toLowerCase(), h = typeof f == "function" ? f : (
          // jsx event handlers can be tuples of [callback, arg]
          Array.isArray(f) ? f.length === 1 ? f[0] : f[0].bind(void 0, f[1]) : void 0
        );
        h ? r[a] ? r[a].push(h) : r[a] = [h] : delete r[a];
      }
  }
  const i = T(...n);
  return new Proxy({
    get(o) {
      if (typeof o != "string")
        return Reflect.get(i, o);
      if (o === "style")
        return xe(n, "style", kn);
      if (o === "ref") {
        const c = [];
        for (const u of n) {
          const f = fe(u)[o];
          typeof f == "function" && c.push(f);
        }
        return s(c);
      }
      if (o[0] === "o" && o[1] === "n" && o[2]) {
        const c = r[o.toLowerCase()];
        return c ? s(c) : Reflect.get(i, o);
      }
      return o === "class" || o === "className" ? xe(n, o, (c, u) => `${c} ${u}`) : o === "classList" ? xe(n, o, (c, u) => ({ ...c, ...u })) : Reflect.get(i, o);
    },
    has(o) {
      return Reflect.has(i, o);
    },
    keys() {
      return Object.keys(i);
    }
  }, Rn);
}
function Bn(e, t, n, s) {
  return e.addEventListener(t, n, s), Fn(e.removeEventListener.bind(e, t, n, s));
}
function Un(e, t, n, s) {
  const r = () => {
    Xe(fe(e)).forEach((i) => {
      i && Xe(fe(t)).forEach((l) => Bn(i, l, n, s));
    });
  };
  typeof e == "function" ? B(r) : z(r);
}
const Wn = (e, ...t) => typeof e == "function" ? e(...t) : e, yt = Symbol();
function Ge(e) {
  const t = () => Wn(e);
  return new Proxy(/* @__PURE__ */ Object.create(null), {
    get: (n, s, r) => s == S ? r : ((i) => typeof i == "function" && yt in i ? i() : i)(t()[s]),
    // get: (o, k, r) => k == $PROXY ? r : unFn(v()[k]),
    defineProperty: (n, s, r) => Reflect.defineProperty(t(), s, r),
    getPrototypeOf: () => Reflect.getPrototypeOf(t()),
    has: (n, s) => s == S || s in t(),
    ownKeys: (n) => Object.keys(t()),
    getOwnPropertyDescriptor: () => ({
      enumerable: !0,
      configurable: !0
    })
  });
}
function Kn(e) {
  const t = b(e);
  return t[yt] = 1, t;
}
function qn(e) {
  const t = { ...e }, n = { ...e }, s = {}, r = (l) => {
    let o = s[l];
    if (!o) {
      if (!U())
        return t[l];
      s[l] = o = _(t[l], { internal: !0 }), delete t[l];
    }
    return o[0]();
  };
  for (const l in e)
    Object.defineProperty(n, l, { get: () => r(l), enumerable: !0 });
  const i = (l, o) => {
    const c = s[l];
    if (c)
      return c[1](o);
    l in t && (t[l] = He(o, t[l]));
  };
  return [
    n,
    (l, o) => {
      if (Nn(l)) {
        const c = D(() => Object.entries(He(l, n)));
        Q(() => {
          for (const [u, f] of c)
            i(u, () => f);
        });
      } else
        i(l, o);
      return n;
    }
  ];
}
function Xn(e, t, n) {
  const s = Et(), r = b(e, t, n), i = { ...D(r) }, l = {};
  for (const o in i)
    Object.defineProperty(i, o, {
      get() {
        let c = l[o];
        if (!c) {
          if (!U())
            return r()[o];
          xt(s, () => l[o] = c = b(() => r()[o]));
        }
        return c();
      },
      enumerable: !0
    });
  return i;
}
const pt = { width: null, height: null };
function ve(e) {
  if (!e)
    return { ...pt };
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function Me(e) {
  const t = typeof e == "function", [n, s] = qn(t ? pt : ve(e)), r = new ResizeObserver(([i]) => s(ve(i.target)));
  return F(() => r.disconnect()), t ? B(() => {
    const i = e();
    i && (s(ve(i)), r.observe(i), F(() => r.unobserve(i)));
  }) : (r.observe(e), F(() => r.unobserve(e))), n;
}
const Hn = { x: 0, y: 0 };
function Qe(e) {
  return e ? e instanceof Window ? {
    x: e.scrollX,
    y: e.scrollY
  } : {
    x: e.scrollLeft,
    y: e.scrollTop
  } : { ...Hn };
}
function Yn(e) {
  e = e || window;
  const t = typeof e == "function", n = t ? () => Qe(e()) : () => Qe(e), [s, r] = _(n, {
    equals: !1
  }), i = () => r(() => n), l = Xn(() => s()());
  return t && rt(i), Un(e, "scroll", i, { passive: !0 }), l;
}
function Y(e, t, n) {
  let s = n.initialDeps ?? [], r;
  function i() {
    var l, o, c, u;
    let f;
    n.key && ((l = n.debug) != null && l.call(n)) && (f = Date.now());
    const a = e();
    if (!(a.length !== s.length || a.some((g, w) => s[w] !== g)))
      return r;
    s = a;
    let d;
    if (n.key && ((o = n.debug) != null && o.call(n)) && (d = Date.now()), r = t(...a), n.key && ((c = n.debug) != null && c.call(n))) {
      const g = Math.round((Date.now() - f) * 100) / 100, w = Math.round((Date.now() - d) * 100) / 100, E = w / 16, x = (O, P) => {
        for (O = String(O); O.length < P; )
          O = " " + O;
        return O;
      };
      console.info(
        `%c⏱ ${x(w, 5)} /${x(g, 5)} ms`,
        `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(
          0,
          Math.min(120 - 120 * E, 120)
        )}deg 100% 31%);`,
        n == null ? void 0 : n.key
      );
    }
    return (u = n == null ? void 0 : n.onChange) == null || u.call(n, r), r;
  }
  return i.updateDeps = (l) => {
    s = l;
  }, i;
}
function Ze(e, t) {
  if (e === void 0)
    throw new Error("Unexpected undefined");
  return e;
}
const Gn = (e, t) => Math.abs(e - t) < 1.01, Qn = (e, t, n) => {
  let s;
  return function(...r) {
    e.clearTimeout(s), s = e.setTimeout(() => t.apply(this, r), n);
  };
}, Je = (e) => {
  const { offsetWidth: t, offsetHeight: n } = e;
  return { width: t, height: n };
}, Zn = (e) => e, Jn = (e) => {
  const t = Math.max(e.startIndex - e.overscan, 0), n = Math.min(e.endIndex + e.overscan, e.count - 1), s = [];
  for (let r = t; r <= n; r++)
    s.push(r);
  return s;
}, es = (e, t) => {
  const n = e.scrollElement;
  if (!n)
    return;
  const s = e.targetWindow;
  if (!s)
    return;
  const r = (l) => {
    const { width: o, height: c } = l;
    t({ width: Math.round(o), height: Math.round(c) });
  };
  if (r(Je(n)), !s.ResizeObserver)
    return () => {
    };
  const i = new s.ResizeObserver((l) => {
    const o = () => {
      const c = l[0];
      if (c != null && c.borderBoxSize) {
        const u = c.borderBoxSize[0];
        if (u) {
          r({ width: u.inlineSize, height: u.blockSize });
          return;
        }
      }
      r(Je(n));
    };
    e.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(o) : o();
  });
  return i.observe(n, { box: "border-box" }), () => {
    i.unobserve(n);
  };
}, et = {
  passive: !0
}, tt = typeof window > "u" ? !0 : "onscrollend" in window, ts = (e, t) => {
  const n = e.scrollElement;
  if (!n)
    return;
  const s = e.targetWindow;
  if (!s)
    return;
  let r = 0;
  const i = e.options.useScrollendEvent && tt ? () => {
  } : Qn(
    s,
    () => {
      t(r, !1);
    },
    e.options.isScrollingResetDelay
  ), l = (f) => () => {
    const { horizontal: a, isRtl: h } = e.options;
    r = a ? n.scrollLeft * (h && -1 || 1) : n.scrollTop, i(), t(r, f);
  }, o = l(!0), c = l(!1);
  c(), n.addEventListener("scroll", o, et);
  const u = e.options.useScrollendEvent && tt;
  return u && n.addEventListener("scrollend", c, et), () => {
    n.removeEventListener("scroll", o), u && n.removeEventListener("scrollend", c);
  };
}, ns = (e, t, n) => {
  if (t != null && t.borderBoxSize) {
    const s = t.borderBoxSize[0];
    if (s)
      return Math.round(
        s[n.options.horizontal ? "inlineSize" : "blockSize"]
      );
  }
  return e[n.options.horizontal ? "offsetWidth" : "offsetHeight"];
}, ss = (e, {
  adjustments: t = 0,
  behavior: n
}, s) => {
  var r, i;
  const l = e + t;
  (i = (r = s.scrollElement) == null ? void 0 : r.scrollTo) == null || i.call(r, {
    [s.options.horizontal ? "left" : "top"]: l,
    behavior: n
  });
};
class rs {
  constructor(t) {
    this.unsubs = [], this.scrollElement = null, this.targetWindow = null, this.isScrolling = !1, this.measurementsCache = [], this.itemSizeCache = /* @__PURE__ */ new Map(), this.pendingMeasuredCacheIndexes = [], this.scrollRect = null, this.scrollOffset = null, this.scrollDirection = null, this.scrollAdjustments = 0, this.elementsCache = /* @__PURE__ */ new Map(), this.observer = /* @__PURE__ */ (() => {
      let n = null;
      const s = () => n || (!this.targetWindow || !this.targetWindow.ResizeObserver ? null : n = new this.targetWindow.ResizeObserver((r) => {
        r.forEach((i) => {
          const l = () => {
            this._measureElement(i.target, i);
          };
          this.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(l) : l();
        });
      }));
      return {
        disconnect: () => {
          var r;
          (r = s()) == null || r.disconnect(), n = null;
        },
        observe: (r) => {
          var i;
          return (i = s()) == null ? void 0 : i.observe(r, { box: "border-box" });
        },
        unobserve: (r) => {
          var i;
          return (i = s()) == null ? void 0 : i.unobserve(r);
        }
      };
    })(), this.range = null, this.setOptions = (n) => {
      Object.entries(n).forEach(([s, r]) => {
        typeof r > "u" && delete n[s];
      }), this.options = {
        debug: !1,
        initialOffset: 0,
        overscan: 1,
        paddingStart: 0,
        paddingEnd: 0,
        scrollPaddingStart: 0,
        scrollPaddingEnd: 0,
        horizontal: !1,
        getItemKey: Zn,
        rangeExtractor: Jn,
        onChange: () => {
        },
        measureElement: ns,
        initialRect: { width: 0, height: 0 },
        scrollMargin: 0,
        gap: 0,
        indexAttribute: "data-index",
        initialMeasurementsCache: [],
        lanes: 1,
        isScrollingResetDelay: 150,
        enabled: !0,
        isRtl: !1,
        useScrollendEvent: !1,
        useAnimationFrameWithResizeObserver: !1,
        ...n
      };
    }, this.notify = (n) => {
      var s, r;
      (r = (s = this.options).onChange) == null || r.call(s, this, n);
    }, this.maybeNotify = Y(
      () => (this.calculateRange(), [
        this.isScrolling,
        this.range ? this.range.startIndex : null,
        this.range ? this.range.endIndex : null
      ]),
      (n) => {
        this.notify(n);
      },
      {
        key: process.env.NODE_ENV !== "production" && "maybeNotify",
        debug: () => this.options.debug,
        initialDeps: [
          this.isScrolling,
          this.range ? this.range.startIndex : null,
          this.range ? this.range.endIndex : null
        ]
      }
    ), this.cleanup = () => {
      this.unsubs.filter(Boolean).forEach((n) => n()), this.unsubs = [], this.observer.disconnect(), this.scrollElement = null, this.targetWindow = null;
    }, this._didMount = () => () => {
      this.cleanup();
    }, this._willUpdate = () => {
      var n;
      const s = this.options.enabled ? this.options.getScrollElement() : null;
      if (this.scrollElement !== s) {
        if (this.cleanup(), !s) {
          this.maybeNotify();
          return;
        }
        this.scrollElement = s, this.scrollElement && "ownerDocument" in this.scrollElement ? this.targetWindow = this.scrollElement.ownerDocument.defaultView : this.targetWindow = ((n = this.scrollElement) == null ? void 0 : n.window) ?? null, this.elementsCache.forEach((r) => {
          this.observer.observe(r);
        }), this._scrollToOffset(this.getScrollOffset(), {
          adjustments: void 0,
          behavior: void 0
        }), this.unsubs.push(
          this.options.observeElementRect(this, (r) => {
            this.scrollRect = r, this.maybeNotify();
          })
        ), this.unsubs.push(
          this.options.observeElementOffset(this, (r, i) => {
            this.scrollAdjustments = 0, this.scrollDirection = i ? this.getScrollOffset() < r ? "forward" : "backward" : null, this.scrollOffset = r, this.isScrolling = i, this.maybeNotify();
          })
        );
      }
    }, this.getSize = () => this.options.enabled ? (this.scrollRect = this.scrollRect ?? this.options.initialRect, this.scrollRect[this.options.horizontal ? "width" : "height"]) : (this.scrollRect = null, 0), this.getScrollOffset = () => this.options.enabled ? (this.scrollOffset = this.scrollOffset ?? (typeof this.options.initialOffset == "function" ? this.options.initialOffset() : this.options.initialOffset), this.scrollOffset) : (this.scrollOffset = null, 0), this.getFurthestMeasurement = (n, s) => {
      const r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
      for (let l = s - 1; l >= 0; l--) {
        const o = n[l];
        if (r.has(o.lane))
          continue;
        const c = i.get(
          o.lane
        );
        if (c == null || o.end > c.end ? i.set(o.lane, o) : o.end < c.end && r.set(o.lane, !0), r.size === this.options.lanes)
          break;
      }
      return i.size === this.options.lanes ? Array.from(i.values()).sort((l, o) => l.end === o.end ? l.index - o.index : l.end - o.end)[0] : void 0;
    }, this.getMeasurementOptions = Y(
      () => [
        this.options.count,
        this.options.paddingStart,
        this.options.scrollMargin,
        this.options.getItemKey,
        this.options.enabled
      ],
      (n, s, r, i, l) => (this.pendingMeasuredCacheIndexes = [], {
        count: n,
        paddingStart: s,
        scrollMargin: r,
        getItemKey: i,
        enabled: l
      }),
      {
        key: !1
      }
    ), this.getMeasurements = Y(
      () => [this.getMeasurementOptions(), this.itemSizeCache],
      ({ count: n, paddingStart: s, scrollMargin: r, getItemKey: i, enabled: l }, o) => {
        if (!l)
          return this.measurementsCache = [], this.itemSizeCache.clear(), [];
        this.measurementsCache.length === 0 && (this.measurementsCache = this.options.initialMeasurementsCache, this.measurementsCache.forEach((f) => {
          this.itemSizeCache.set(f.key, f.size);
        }));
        const c = this.pendingMeasuredCacheIndexes.length > 0 ? Math.min(...this.pendingMeasuredCacheIndexes) : 0;
        this.pendingMeasuredCacheIndexes = [];
        const u = this.measurementsCache.slice(0, c);
        for (let f = c; f < n; f++) {
          const a = i(f), h = this.options.lanes === 1 ? u[f - 1] : this.getFurthestMeasurement(u, f), d = h ? h.end + this.options.gap : s + r, g = o.get(a), w = typeof g == "number" ? g : this.options.estimateSize(f), E = d + w, x = h ? h.lane : f % this.options.lanes;
          u[f] = {
            index: f,
            start: d,
            size: w,
            end: E,
            key: a,
            lane: x
          };
        }
        return this.measurementsCache = u, u;
      },
      {
        key: process.env.NODE_ENV !== "production" && "getMeasurements",
        debug: () => this.options.debug
      }
    ), this.calculateRange = Y(
      () => [
        this.getMeasurements(),
        this.getSize(),
        this.getScrollOffset(),
        this.options.lanes
      ],
      (n, s, r, i) => this.range = n.length > 0 && s > 0 ? is({
        measurements: n,
        outerSize: s,
        scrollOffset: r,
        lanes: i
      }) : null,
      {
        key: process.env.NODE_ENV !== "production" && "calculateRange",
        debug: () => this.options.debug
      }
    ), this.getVirtualIndexes = Y(
      () => {
        let n = null, s = null;
        const r = this.calculateRange();
        return r && (n = r.startIndex, s = r.endIndex), this.maybeNotify.updateDeps([this.isScrolling, n, s]), [
          this.options.rangeExtractor,
          this.options.overscan,
          this.options.count,
          n,
          s
        ];
      },
      (n, s, r, i, l) => i === null || l === null ? [] : n({
        startIndex: i,
        endIndex: l,
        overscan: s,
        count: r
      }),
      {
        key: process.env.NODE_ENV !== "production" && "getVirtualIndexes",
        debug: () => this.options.debug
      }
    ), this.indexFromElement = (n) => {
      const s = this.options.indexAttribute, r = n.getAttribute(s);
      return r ? parseInt(r, 10) : (console.warn(
        `Missing attribute name '${s}={index}' on measured element.`
      ), -1);
    }, this._measureElement = (n, s) => {
      const r = this.indexFromElement(n), i = this.measurementsCache[r];
      if (!i)
        return;
      const l = i.key, o = this.elementsCache.get(l);
      o !== n && (o && this.observer.unobserve(o), this.observer.observe(n), this.elementsCache.set(l, n)), n.isConnected && this.resizeItem(r, this.options.measureElement(n, s, this));
    }, this.resizeItem = (n, s) => {
      const r = this.measurementsCache[n];
      if (!r)
        return;
      const i = this.itemSizeCache.get(r.key) ?? r.size, l = s - i;
      l !== 0 && ((this.shouldAdjustScrollPositionOnItemSizeChange !== void 0 ? this.shouldAdjustScrollPositionOnItemSizeChange(r, l, this) : r.start < this.getScrollOffset() + this.scrollAdjustments) && (process.env.NODE_ENV !== "production" && this.options.debug && console.info("correction", l), this._scrollToOffset(this.getScrollOffset(), {
        adjustments: this.scrollAdjustments += l,
        behavior: void 0
      })), this.pendingMeasuredCacheIndexes.push(r.index), this.itemSizeCache = new Map(this.itemSizeCache.set(r.key, s)), this.notify(!1));
    }, this.measureElement = (n) => {
      if (!n) {
        this.elementsCache.forEach((s, r) => {
          s.isConnected || (this.observer.unobserve(s), this.elementsCache.delete(r));
        });
        return;
      }
      this._measureElement(n, void 0);
    }, this.getVirtualItems = Y(
      () => [this.getVirtualIndexes(), this.getMeasurements()],
      (n, s) => {
        const r = [];
        for (let i = 0, l = n.length; i < l; i++) {
          const o = n[i], c = s[o];
          r.push(c);
        }
        return r;
      },
      {
        key: process.env.NODE_ENV !== "production" && "getVirtualItems",
        debug: () => this.options.debug
      }
    ), this.getVirtualItemForOffset = (n) => {
      const s = this.getMeasurements();
      if (s.length !== 0)
        return Ze(
          s[bt(
            0,
            s.length - 1,
            (r) => Ze(s[r]).start,
            n
          )]
        );
    }, this.getOffsetForAlignment = (n, s, r = 0) => {
      const i = this.getSize(), l = this.getScrollOffset();
      s === "auto" && (s = n >= l + i ? "end" : "start"), s === "center" ? n += (r - i) / 2 : s === "end" && (n -= i);
      const o = this.getTotalSize() + this.options.scrollMargin - i;
      return Math.max(Math.min(o, n), 0);
    }, this.getOffsetForIndex = (n, s = "auto") => {
      n = Math.max(0, Math.min(n, this.options.count - 1));
      const r = this.measurementsCache[n];
      if (!r)
        return;
      const i = this.getSize(), l = this.getScrollOffset();
      if (s === "auto")
        if (r.end >= l + i - this.options.scrollPaddingEnd)
          s = "end";
        else if (r.start <= l + this.options.scrollPaddingStart)
          s = "start";
        else
          return [l, s];
      const o = s === "end" ? r.end + this.options.scrollPaddingEnd : r.start - this.options.scrollPaddingStart;
      return [
        this.getOffsetForAlignment(o, s, r.size),
        s
      ];
    }, this.isDynamicMode = () => this.elementsCache.size > 0, this.scrollToOffset = (n, { align: s = "start", behavior: r } = {}) => {
      r === "smooth" && this.isDynamicMode() && console.warn(
        "The `smooth` scroll behavior is not fully supported with dynamic size."
      ), this._scrollToOffset(this.getOffsetForAlignment(n, s), {
        adjustments: void 0,
        behavior: r
      });
    }, this.scrollToIndex = (n, { align: s = "auto", behavior: r } = {}) => {
      r === "smooth" && this.isDynamicMode() && console.warn(
        "The `smooth` scroll behavior is not fully supported with dynamic size."
      ), n = Math.max(0, Math.min(n, this.options.count - 1));
      let i = 0;
      const l = 10, o = (u) => {
        if (!this.targetWindow) return;
        const f = this.getOffsetForIndex(n, u);
        if (!f) {
          console.warn("Failed to get offset for index:", n);
          return;
        }
        const [a, h] = f;
        this._scrollToOffset(a, { adjustments: void 0, behavior: r }), this.targetWindow.requestAnimationFrame(() => {
          const d = this.getScrollOffset(), g = this.getOffsetForIndex(n, h);
          if (!g) {
            console.warn("Failed to get offset for index:", n);
            return;
          }
          Gn(g[0], d) || c(h);
        });
      }, c = (u) => {
        this.targetWindow && (i++, i < l ? (process.env.NODE_ENV !== "production" && this.options.debug && console.info("Schedule retry", i, l), this.targetWindow.requestAnimationFrame(() => o(u))) : console.warn(
          `Failed to scroll to index ${n} after ${l} attempts.`
        ));
      };
      o(s);
    }, this.scrollBy = (n, { behavior: s } = {}) => {
      s === "smooth" && this.isDynamicMode() && console.warn(
        "The `smooth` scroll behavior is not fully supported with dynamic size."
      ), this._scrollToOffset(this.getScrollOffset() + n, {
        adjustments: void 0,
        behavior: s
      });
    }, this.getTotalSize = () => {
      var n;
      const s = this.getMeasurements();
      let r;
      if (s.length === 0)
        r = this.options.paddingStart;
      else if (this.options.lanes === 1)
        r = ((n = s[s.length - 1]) == null ? void 0 : n.end) ?? 0;
      else {
        const i = Array(this.options.lanes).fill(null);
        let l = s.length - 1;
        for (; l >= 0 && i.some((o) => o === null); ) {
          const o = s[l];
          i[o.lane] === null && (i[o.lane] = o.end), l--;
        }
        r = Math.max(...i.filter((o) => o !== null));
      }
      return Math.max(
        r - this.options.scrollMargin + this.options.paddingEnd,
        0
      );
    }, this._scrollToOffset = (n, {
      adjustments: s,
      behavior: r
    }) => {
      this.options.scrollToFn(n, { behavior: r, adjustments: s }, this);
    }, this.measure = () => {
      this.itemSizeCache = /* @__PURE__ */ new Map(), this.notify(!1);
    }, this.setOptions(t);
  }
}
const bt = (e, t, n, s) => {
  for (; e <= t; ) {
    const r = (e + t) / 2 | 0, i = n(r);
    if (i < s)
      e = r + 1;
    else if (i > s)
      t = r - 1;
    else
      return r;
  }
  return e > 0 ? e - 1 : 0;
};
function is({
  measurements: e,
  outerSize: t,
  scrollOffset: n,
  lanes: s
}) {
  const r = e.length - 1, i = (c) => e[c].start;
  if (e.length <= s)
    return {
      startIndex: 0,
      endIndex: r
    };
  let l = bt(
    0,
    r,
    i,
    n
  ), o = l;
  if (s === 1)
    for (; o < r && e[o].end < n + t; )
      o++;
  else if (s > 1) {
    const c = Array(s).fill(0);
    for (; o < r && c.some((f) => f < n + t); ) {
      const f = e[o];
      c[f.lane] = f.end, o++;
    }
    const u = Array(s).fill(n + t);
    for (; l >= 0 && u.some((f) => f >= n); ) {
      const f = e[l];
      u[f.lane] = f.start, l--;
    }
    l = Math.max(0, l - l % s), o = Math.min(r, o + (s - 1 - o % s));
  }
  return { startIndex: l, endIndex: o };
}
function os(e) {
  const t = T(e), n = new rs(t), [s, r] = dt(n.getVirtualItems()), [i, l] = _(n.getTotalSize()), o = {
    get(u, f) {
      switch (f) {
        case "getVirtualItems":
          return () => s;
        case "getTotalSize":
          return () => i();
        default:
          return Reflect.get(u, f);
      }
    }
  }, c = new Proxy(n, o);
  return c.setOptions(t), rt(() => {
    const u = c._didMount();
    c._willUpdate(), F(u);
  }), oe(() => {
    c.setOptions(T(t, e, {
      onChange: (u, f) => {
        var a;
        u._willUpdate(), r(mt(u.getVirtualItems(), {
          key: "index"
        })), l(u.getTotalSize()), (a = e.onChange) == null || a.call(e, u, f);
      }
    })), c.measure();
  }), c;
}
function ls(e) {
  return os(T({
    observeElementRect: es,
    observeElementOffset: ts,
    scrollToFn: ss
  }, e));
}
var cs = /* @__PURE__ */ L("<div>");
const te = Symbol();
function us(e) {
  const t = Ie(Array(e.count)), n = Me(e.getScrollElement), s = Yn(e.getScrollElement);
  oe(() => {
    for (let l = 0, o = e.count; l < o; l++)
      t[l] = e.estimateSize(l);
  });
  const [r, i] = dt([]);
  return oe(() => {
    const l = e.horizontal ? s.x : s.y, o = e.horizontal ? n.width : n.height;
    let c = 0;
    const u = [];
    for (let f = 0, a = e.count; f < a && !(!((c += t[f]) < l) && (u.push({
      start: c - t[f],
      index: f
    }), c >= l + o)); f++)
      ;
    i(mt(u, {
      key: "index"
    }));
  }), {
    getTotalSize: b(() => tn(t)),
    resizeItem: (l, o) => t[l] = o,
    getVirtualItems: () => r
  };
}
const fs = {
  processProps: {
    Table: ({
      Table: e
    }, {
      store: t
    }) => (n) => {
      let s;
      const {
        props: r
      } = Z(k), i = ls({
        getScrollElement: () => s,
        get count() {
          var o;
          return ((o = r.data) == null ? void 0 : o.length) || 0;
        },
        estimateSize: () => 30,
        overscan: 10,
        indexAttribute: "y"
      }), l = us({
        horizontal: !0,
        getScrollElement: () => s,
        get count() {
          var o;
          return ((o = r.columns) == null ? void 0 : o.length) || 0;
        },
        estimateSize: (o) => {
          var c;
          return ((c = r.columns) == null ? void 0 : c[o].width) ?? 40;
        },
        overscan: 5,
        indexAttribute: "x",
        rangeExtractor(o) {
          var c;
          return [.../* @__PURE__ */ new Set([
            ...((c = r.columns) == null ? void 0 : c.map((u, f) => u.fixed ? f : void 0).filter((u) => u != null)) || []
            // ...defaultRangeExtractor(range)
          ])];
        }
      });
      return t.virtualizerY = i, t.virtualizerX = l, t[te] ?? (t[te] = b(() => {
        const o = t.virtualizerX.getVirtualItems(), c = {};
        for (let u = 1; u < o.length; u++) {
          const f = o[u], a = o[u - 1];
          f.index - a.index > 1 && (c[f.index] = {
            item: f,
            offset: f.start - a.end
          });
        }
        return c;
      })), n = $({
        ref: (o) => s = o,
        class: "virtual"
      }, n), y(e, T(n, {
        get children() {
          return [Bt(() => n.children), (() => {
            var o = cs();
            return z((c) => Ne(o, `position: absolute; top: 0; width: ${t.virtualizerX.getTotalSize()}px; height: ${t.virtualizerY.getTotalSize()}px; z-index: -1`, c)), o;
          })()];
        }
      }));
    },
    Td: ({
      Td: e
    }, {
      store: t
    }) => (n) => {
      const s = b(() => t[te]()[n.x]), r = $({
        get style() {
          var i;
          return `width: ${n.col.width || 80}px; margin-left: ${(i = s()) == null ? void 0 : i.offset}px`;
        }
      }, n);
      return y(e, r);
    },
    Th: ({
      Th: e
    }, {
      store: t
    }) => (n) => {
      const s = b(() => {
        var r;
        return (r = t[te]) == null ? void 0 : r.call(t)[n.x];
      });
      return n = $(() => {
        var r;
        return {
          style: `width: ${n.col.width || 80}px; margin-left: ${(r = s()) == null ? void 0 : r.offset}px`
        };
      }, n), B(() => t.thSizes[n.x] && t.virtualizerX.resizeItem(n.y, t.thSizes[n.x].width)), y(e, n);
    },
    Tr: ({
      Tr: e
    }, {
      store: t
    }) => (n) => (B(() => t.trSizes[0]), y(e, n)),
    Thead: ({
      Thead: e
    }, {
      store: t
    }) => (n) => (n = $(() => {
      var s;
      return {
        style: `transform: translate(${(s = t.virtualizerX.getVirtualItems()[0]) == null ? void 0 : s.start}px, 0px);`
      };
    }, n), y(e, n)),
    Tbody: ({
      Tbody: e
    }, {
      store: t
    }) => (n) => (n = $(() => {
      var s, r;
      return {
        style: `transform: translate(${(s = t.virtualizerX.getVirtualItems()[0]) == null ? void 0 : s.start}px, ${(r = t.virtualizerY.getVirtualItems()[0]) == null ? void 0 : r.start}px);`
      };
    }, n), y(e, n)),
    // tr: ({ tr }, { store }) => (o) => {
    //   let el
    //   o = combineProps({ ref: e => el = e }, o)
    //   o = combineProps(() => ({ style: `transform: translate(0, ${store.virtualizerY.getOffsetForIndex(o.y, 'start')?.[0]}px); position: absolute` }), o)
    //   onMount(() => store.virtualizerY.measureElement(el))
    //   return <Dynamic component={tr} {...o} />
    // },
    // tbody: ({ tbody }, { store }) => o => {
    //   o = combineProps(() => ({
    //     style: `width: ${store.virtualizerX.getTotalSize()}px; height: ${store.virtualizerY.getTotalSize()}px`
    //   }), o)
    //   return <Dynamic component={tbody} {...o} />
    // },
    EachRows: ({
      EachRows: e
    }, {
      store: t
    }) => (n) => {
      const s = b(() => t.virtualizerY.getVirtualItems().map((r) => n.each[r.index]));
      return y(e, T(n, {
        get each() {
          return s();
        },
        children: (r, i) => n.children(r, b(() => {
          var l;
          return (l = t.virtualizerY.getVirtualItems()[i()]) == null ? void 0 : l.index;
        }))
      }));
    },
    EachCells: ({
      EachCells: e
    }, {
      store: t
    }) => (n) => {
      const s = b(() => t.virtualizerX.getVirtualItems().map((r) => n.each[r.index]));
      return y(e, T(n, {
        get each() {
          return s();
        },
        children: (r, i) => n.children(r, b(() => {
          var l;
          return (l = t.virtualizerX.getVirtualItems()[i()]) == null ? void 0 : l.index;
        }))
      }));
    }
  }
};
Re(["dblclick"]);
Re(["input", "pointerdown"]);
var as = /* @__PURE__ */ L("<colgroup>"), hs = /* @__PURE__ */ L("<col>"), ds = /* @__PURE__ */ L("<table>"), gs = /* @__PURE__ */ L("<thead>"), ms = /* @__PURE__ */ L("<tbody>"), ys = /* @__PURE__ */ L("<tr>"), ps = /* @__PURE__ */ L("<th>"), bs = /* @__PURE__ */ L("<td>");
const k = vt({
  props: {}
}), vs = (e) => {
  const t = b(() => [...As, ...e.plugins || []].sort((l, o) => (o.priority || 0) - (l.priority || 0))), n = Pe(t, () => _({})), s = Ie({});
  oe((l) => (Jt(t(), l).forEach((c) => {
    var u;
    return Object.assign(s, (u = c.store) == null ? void 0 : u.call(c, s));
  }), t()), []), oe(Pe(t, (l, o) => {
    const c = b(() => {
      var f;
      return ((f = n()[o() - 1]) == null ? void 0 : f[0]()) || e;
    }), u = Ge(T(c(), Pn(l.processProps || {}, (f) => Kn(() => f(c(), {
      store: s
    })))));
    n()[o()][1](u);
  }));
  const r = Ge(() => n()[n().length - 1][0]());
  s.props = r;
  const i = Ie({
    x: 0,
    props: r
  });
  return window.store = s, window.ctx = i, y(k.Provider, {
    value: i,
    get children() {
      return y(i.props.Table, {
        get children() {
          return [(() => {
            var l = as();
            return Yt(l, y(je, {
              get each() {
                return i.props.columns;
              },
              children: (o) => (() => {
                var c = hs();
                return z((u) => Ne(c, `width: ${o.width}px`, u)), c;
              })()
            })), l;
          })(), y(ws, {}), y(Os, {})];
        }
      });
    }
  });
}, ws = () => {
  const {
    props: e
  } = Z(k);
  return y(e.Thead, {
    get children() {
      return y(e.Tr, {
        get children() {
          return y(e.EachCells, {
            get each() {
              return e.columns || [];
            },
            children: (t, n) => y(e.Th, {
              col: t,
              get x() {
                return n();
              },
              get children() {
                return t.name;
              }
            })
          });
        }
      });
    }
  });
}, Os = () => {
  const {
    props: e
  } = Z(k);
  return y(e.Tbody, {
    get children() {
      return y(e.EachRows, {
        get each() {
          return e.data;
        },
        children: (t, n) => y(e.Tr, {
          get y() {
            return n();
          },
          data: t,
          get children() {
            return y(e.EachCells, {
              get each() {
                return e.columns;
              },
              children: (s, r) => y(e.Td, {
                col: s,
                get x() {
                  return r();
                },
                get y() {
                  return n();
                },
                data: t,
                get children() {
                  return t[s.id];
                }
              })
            });
          }
        })
      });
    }
  });
};
function Ss() {
  const e = {
    col: null,
    data: null
  }, t = (o) => (() => {
    var c = ds();
    return X(c, o, !1), c;
  })(), n = (o) => (() => {
    var c = gs();
    return X(c, o, !1), c;
  })(), s = (o) => (() => {
    var c = ms();
    return X(c, o, !1), c;
  })(), r = (o) => (() => {
    var c = ys();
    return X(c, T(o, e), !1), c;
  })(), i = (o) => (() => {
    var c = ps();
    return X(c, T(o, e), !1), c;
  })(), l = (o) => (() => {
    var c = bs();
    return X(c, T(o, e), !1), c;
  })();
  return {
    store: (o) => ({
      ths: [],
      // thSizes: toReactive(mapArray(() => store.ths, el => el && createElementSize(el))),
      thSizes: [],
      trs: [],
      // trSizes: toReactive(mapArray(() => store.trs, el => el && createElementSize(el))),
      trSizes: [],
      internal: Symbol("internal")
    }),
    processProps: {
      Tbody: ({
        Tbody: o = s
      }) => o,
      Thead: ({
        Thead: o = n
      }) => o,
      Table: ({
        Table: o = t
      }) => (c) => {
        const {
          props: u
        } = Z(k);
        return c = $(() => ({
          class: `data-table ${u.class} ${u.border && "data-table--border"}`,
          style: u.style
        }), c), y(o, c);
      },
      Tr: ({
        Tr: o = r
      }, {
        store: c
      }) => (u) => {
        const [f, a] = _();
        return u = $({
          ref: a
        }, u), B(() => {
          const {
            y: h
          } = u;
          c.trs[h] = f(), c.trSizes[h] = Me(f()), F(() => c.trSizes[h] = c.trs[h] = void 0);
        }), y(o, u);
      },
      Th: ({
        Th: o = i
      }, {
        store: c
      }) => (u) => {
        const [f, a] = _(), {
          props: h
        } = Z(k), d = $(u, () => ({
          ref: a,
          class: u.col.class,
          style: u.col.style
        }), b(() => {
          var g;
          return ((g = h.cellProps) == null ? void 0 : g.call(h, u)) || {};
        }, null, {
          equals: H
        }), b(() => {
          var g;
          return ((g = h.thProps) == null ? void 0 : g.call(h, u)) || {};
        }, null, {
          equals: H
        }), b(() => {
          var g, w;
          return ((w = (g = u.col).props) == null ? void 0 : w.call(g, u)) || {};
        }, null, {
          equals: H
        }));
        return B(() => {
          const {
            x: g
          } = u;
          c.ths[g] = f(), c.thSizes[g] = Me(f()), F(() => c.thSizes[g] = c.ths[g] = void 0);
        }), y(o, T(d, {
          get children() {
            return u.children;
          }
        }));
      },
      Td: ({
        Td: o = l
      }, {
        store: c
      }) => (u) => {
        const {
          props: f
        } = Z(k), a = $(u, () => ({
          class: u.col.class,
          style: u.col.style
        }), b(() => {
          var h;
          return ((h = f.cellProps) == null ? void 0 : h.call(f, u)) || {};
        }, null, {
          equals: H
        }), b(() => {
          var h;
          return ((h = f.tdProps) == null ? void 0 : h.call(f, u)) || {};
        }, null, {
          equals: H
        }), b(() => {
          var h, d;
          return ((d = (h = u.col).props) == null ? void 0 : d.call(h, u)) || {};
        }, null, {
          equals: H
        }));
        return y(o, T(a, {
          get children() {
            return u.children;
          }
        }));
      },
      EachRows: ({
        EachRows: o
      }) => o || je,
      EachCells: ({
        EachCells: o
      }) => o || je
    }
  };
}
const As = [
  Ss(),
  // RenderPlugin,
  // IndexPlugin,
  // StickyHeaderPlugin,
  // FixedColumnPlugin,
  // ResizePlugin,
  // CellSelectionPlugin,
  // CopyPlugin,
  // PastePlugin,
  fs
  // ExpandPlugin,
  // RowGroupPlugin,
  // EditablePlugin
];
export {
  k as Ctx,
  vs as Table,
  As as defaultsPlugins
};
