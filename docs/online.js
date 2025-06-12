let G = P;
const y = 1, A = 2, B = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var c = null;
let m = null, H = null, p = null, h = null, g = null, x = 0;
function R(t, e) {
  const n = p, s = c, o = t.length === 0, i = e === void 0 ? s : e, f = o ? B : {
    owned: null,
    cleanups: null,
    context: i ? i.context : null,
    owner: i
  }, l = o ? t : () => t(() => D(() => E(f)));
  c = f, p = null;
  try {
    return C(l, !0);
  } finally {
    p = n, c = s;
  }
}
function N(t, e, n) {
  const s = J(t, e, !1, y);
  U(s);
}
function D(t) {
  if (p === null) return t();
  const e = p;
  p = null;
  try {
    return t();
  } finally {
    p = e;
  }
}
function q(t, e, n) {
  let s = t.value;
  return (!t.comparator || !t.comparator(s, e)) && (t.value = e, t.observers && t.observers.length && C(() => {
    for (let o = 0; o < t.observers.length; o += 1) {
      const i = t.observers[o], f = m && m.running;
      f && m.disposed.has(i), (f ? !i.tState : !i.state) && (i.pure ? h.push(i) : g.push(i), i.observers && I(i)), f || (i.state = y);
    }
    if (h.length > 1e6)
      throw h = [], new Error();
  }, !1)), e;
}
function U(t) {
  if (!t.fn) return;
  E(t);
  const e = x;
  F(t, t.value, e);
}
function F(t, e, n) {
  let s;
  const o = c, i = p;
  p = c = t;
  try {
    s = t.fn(e);
  } catch (f) {
    return t.pure && (t.state = y, t.owned && t.owned.forEach(E), t.owned = null), t.updatedAt = n + 1, V(f);
  } finally {
    p = i, c = o;
  }
  (!t.updatedAt || t.updatedAt <= n) && (t.updatedAt != null && "observers" in t ? q(t, s) : t.value = s, t.updatedAt = n);
}
function J(t, e, n, s = y, o) {
  const i = {
    fn: t,
    state: s,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: e,
    owner: c,
    context: c ? c.context : null,
    pure: n
  };
  return c === null || c !== B && (c.owned ? c.owned.push(i) : c.owned = [i]), i;
}
function M(t) {
  if (t.state === 0) return;
  if (t.state === A) return $(t);
  if (t.suspense && D(t.suspense.inFallback)) return t.suspense.effects.push(t);
  const e = [t];
  for (; (t = t.owner) && (!t.updatedAt || t.updatedAt < x); )
    t.state && e.push(t);
  for (let n = e.length - 1; n >= 0; n--)
    if (t = e[n], t.state === y)
      U(t);
    else if (t.state === A) {
      const s = h;
      h = null, C(() => $(t, e[0]), !1), h = s;
    }
}
function C(t, e) {
  if (h) return t();
  let n = !1;
  e || (h = []), g ? n = !0 : g = [], x++;
  try {
    const s = t();
    return Q(n), s;
  } catch (s) {
    n || (g = null), h = null, V(s);
  }
}
function Q(t) {
  if (h && (P(h), h = null), t) return;
  const e = g;
  g = null, e.length && C(() => G(e), !1);
}
function P(t) {
  for (let e = 0; e < t.length; e++) M(t[e]);
}
function $(t, e) {
  t.state = 0;
  for (let n = 0; n < t.sources.length; n += 1) {
    const s = t.sources[n];
    if (s.sources) {
      const o = s.state;
      o === y ? s !== e && (!s.updatedAt || s.updatedAt < x) && M(s) : o === A && $(s, e);
    }
  }
}
function I(t) {
  for (let e = 0; e < t.observers.length; e += 1) {
    const n = t.observers[e];
    n.state || (n.state = A, n.pure ? h.push(n) : g.push(n), n.observers && I(n));
  }
}
function E(t) {
  let e;
  if (t.sources)
    for (; t.sources.length; ) {
      const n = t.sources.pop(), s = t.sourceSlots.pop(), o = n.observers;
      if (o && o.length) {
        const i = o.pop(), f = n.observerSlots.pop();
        s < o.length && (i.sourceSlots[f] = s, o[s] = i, n.observerSlots[s] = f);
      }
    }
  if (t.tOwned) {
    for (e = t.tOwned.length - 1; e >= 0; e--) E(t.tOwned[e]);
    delete t.tOwned;
  }
  if (t.owned) {
    for (e = t.owned.length - 1; e >= 0; e--) E(t.owned[e]);
    t.owned = null;
  }
  if (t.cleanups) {
    for (e = t.cleanups.length - 1; e >= 0; e--) t.cleanups[e]();
    t.cleanups = null;
  }
  t.state = 0;
}
function W(t) {
  return t instanceof Error ? t : new Error(typeof t == "string" ? t : "Unknown error", {
    cause: t
  });
}
function V(t, e = c) {
  throw W(t);
}
function X(t, e, n) {
  let s = n.length, o = e.length, i = s, f = 0, l = 0, r = e[o - 1].nextSibling, u = null;
  for (; f < o || l < i; ) {
    if (e[f] === n[l]) {
      f++, l++;
      continue;
    }
    for (; e[o - 1] === n[i - 1]; )
      o--, i--;
    if (o === f) {
      const a = i < s ? l ? n[l - 1].nextSibling : n[i - l] : r;
      for (; l < i; ) t.insertBefore(n[l++], a);
    } else if (i === l)
      for (; f < o; )
        (!u || !u.has(e[f])) && e[f].remove(), f++;
    else if (e[f] === n[i - 1] && n[l] === e[o - 1]) {
      const a = e[--o].nextSibling;
      t.insertBefore(n[l++], e[f++].nextSibling), t.insertBefore(n[--i], a), e[o] = n[i];
    } else {
      if (!u) {
        u = /* @__PURE__ */ new Map();
        let d = l;
        for (; d < i; ) u.set(n[d], d++);
      }
      const a = u.get(e[f]);
      if (a != null)
        if (l < a && a < i) {
          let d = f, T = 1, O;
          for (; ++d < o && d < i && !((O = u.get(e[d])) == null || O !== a + T); )
            T++;
          if (T > a - l) {
            const k = e[f];
            for (; l < a; ) t.insertBefore(n[l++], k);
          } else t.replaceChild(n[l++], e[f++]);
        } else f++;
      else e[f++].remove();
    }
  }
}
const _ = "_$DX_DELEGATE";
function K(t, e, n, s = {}) {
  let o;
  return R((i) => {
    o = i, e === document ? t() : z(e, t(), e.firstChild ? null : void 0, n);
  }, s.owner), () => {
    o(), e.textContent = "";
  };
}
function Y(t, e, n, s) {
  let o;
  const i = () => {
    const l = document.createElement("template");
    return l.innerHTML = t, l.content.firstChild;
  }, f = () => (o || (o = i())).cloneNode(!0);
  return f.cloneNode = f, f;
}
function Z(t, e = window.document) {
  const n = e[_] || (e[_] = /* @__PURE__ */ new Set());
  for (let s = 0, o = t.length; s < o; s++) {
    const i = t[s];
    n.has(i) || (n.add(i), e.addEventListener(i, tt));
  }
}
function z(t, e, n, s) {
  if (n !== void 0 && !s && (s = []), typeof e != "function") return S(t, e, s, n);
  N((o) => S(t, e(), o, n), s);
}
function tt(t) {
  let e = t.target;
  const n = `$$${t.type}`, s = t.target, o = t.currentTarget, i = (r) => Object.defineProperty(t, "target", {
    configurable: !0,
    value: r
  }), f = () => {
    const r = e[n];
    if (r && !e.disabled) {
      const u = e[`${n}Data`];
      if (u !== void 0 ? r.call(e, u, t) : r.call(e, t), t.cancelBubble) return;
    }
    return e.host && typeof e.host != "string" && !e.host._$host && e.contains(t.target) && i(e.host), !0;
  }, l = () => {
    for (; f() && (e = e._$host || e.parentNode || e.host); ) ;
  };
  if (Object.defineProperty(t, "currentTarget", {
    configurable: !0,
    get() {
      return e || document;
    }
  }), t.composedPath) {
    const r = t.composedPath();
    i(r[0]);
    for (let u = 0; u < r.length - 2 && (e = r[u], !!f()); u++) {
      if (e._$host) {
        e = e._$host, l();
        break;
      }
      if (e.parentNode === o)
        break;
    }
  } else l();
  i(s);
}
function S(t, e, n, s, o) {
  for (; typeof n == "function"; ) n = n();
  if (e === n) return n;
  const i = typeof e, f = s !== void 0;
  if (t = f && n[0] && n[0].parentNode || t, i === "string" || i === "number") {
    if (i === "number" && (e = e.toString(), e === n))
      return n;
    if (f) {
      let l = n[0];
      l && l.nodeType === 3 ? l.data !== e && (l.data = e) : l = document.createTextNode(e), n = w(t, n, s, l);
    } else
      n !== "" && typeof n == "string" ? n = t.firstChild.data = e : n = t.textContent = e;
  } else if (e == null || i === "boolean")
    n = w(t, n, s);
  else {
    if (i === "function")
      return N(() => {
        let l = e();
        for (; typeof l == "function"; ) l = l();
        n = S(t, l, n, s);
      }), () => n;
    if (Array.isArray(e)) {
      const l = [], r = n && Array.isArray(n);
      if (L(l, e, n, o))
        return N(() => n = S(t, l, n, s, !0)), () => n;
      if (l.length === 0) {
        if (n = w(t, n, s), f) return n;
      } else r ? n.length === 0 ? v(t, l, s) : X(t, n, l) : (n && w(t), v(t, l));
      n = l;
    } else if (e.nodeType) {
      if (Array.isArray(n)) {
        if (f) return n = w(t, n, s, e);
        w(t, n, null, e);
      } else n == null || n === "" || !t.firstChild ? t.appendChild(e) : t.replaceChild(e, t.firstChild);
      n = e;
    }
  }
  return n;
}
function L(t, e, n, s) {
  let o = !1;
  for (let i = 0, f = e.length; i < f; i++) {
    let l = e[i], r = n && n[t.length], u;
    if (!(l == null || l === !0 || l === !1)) if ((u = typeof l) == "object" && l.nodeType)
      t.push(l);
    else if (Array.isArray(l))
      o = L(t, l, r) || o;
    else if (u === "function")
      if (s) {
        for (; typeof l == "function"; ) l = l();
        o = L(t, Array.isArray(l) ? l : [l], Array.isArray(r) ? r : [r]) || o;
      } else
        t.push(l), o = !0;
    else {
      const a = String(l);
      r && r.nodeType === 3 && r.data === a ? t.push(r) : t.push(document.createTextNode(a));
    }
  }
  return o;
}
function v(t, e, n = null) {
  for (let s = 0, o = e.length; s < o; s++) t.insertBefore(e[s], n);
}
function w(t, e, n, s) {
  if (n === void 0) return t.textContent = "";
  const o = s || document.createTextNode("");
  if (e.length) {
    let i = !1;
    for (let f = e.length - 1; f >= 0; f--) {
      const l = e[f];
      if (o !== l) {
        const r = l.parentNode === t;
        !i && !f ? r ? t.replaceChild(o, l) : t.insertBefore(o, n) : r && l.remove();
      } else i = !0;
    }
  } else t.insertBefore(o, n);
  return [o];
}
var et = /* @__PURE__ */ Y('<button class="ml-4 bg-blue"bg-blue style=width:120px>保 存');
window.dispatchEvent(new Event("initialized"));
const b = {
  content: (t) => editor.commands.setContent(t.content)
};
function j(t, e, n = opener) {
  n == null || n.postMessage(JSON.stringify(["online-doc", t, e]));
}
window == null || window.addEventListener("message", (t) => {
  var s;
  if (t.source == window) return;
  const [e, n] = JSON.parse(t.data);
  (s = b[e]) == null || s.call(b, n);
});
editor.on("update", () => {
  const t = editor.getHTML();
  j("update", {
    content: t
  });
});
function nt() {
  const t = editor.getHTML();
  j("ok", {
    content: t
  });
}
(async () => {
  const t = Object.fromEntries(new URLSearchParams(location.search).entries()), e = await st(t);
  e && b.content({
    content: e
  });
})();
function st(t) {
  return t.content || (t.src ? fetch(t.src, {
    method: "GET"
  }).then((e) => e.text()) : "");
}
K(() => (() => {
  var t = et();
  return t.$$click = nt, t;
})(), document.querySelector("#actions"));
Z(["click"]);
