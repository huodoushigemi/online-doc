let G = P;
const y = 1, A = 2, B = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var c = null;
let T = null, H = null, p = null, h = null, g = null, x = 0;
function R(t, e) {
  const n = p, s = c, o = t.length === 0, l = e === void 0 ? s : e, r = o ? B : {
    owned: null,
    cleanups: null,
    context: l ? l.context : null,
    owner: l
  }, i = o ? t : () => t(() => D(() => E(r)));
  c = r, p = null;
  try {
    return m(i, !0);
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
  return (!t.comparator || !t.comparator(s, e)) && (t.value = e, t.observers && t.observers.length && m(() => {
    for (let o = 0; o < t.observers.length; o += 1) {
      const l = t.observers[o], r = T && T.running;
      r && T.disposed.has(l), (r ? !l.tState : !l.state) && (l.pure ? h.push(l) : g.push(l), l.observers && I(l)), r || (l.state = y);
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
  const o = c, l = p;
  p = c = t;
  try {
    s = t.fn(e);
  } catch (r) {
    return t.pure && (t.state = y, t.owned && t.owned.forEach(E), t.owned = null), t.updatedAt = n + 1, V(r);
  } finally {
    p = l, c = o;
  }
  (!t.updatedAt || t.updatedAt <= n) && (t.updatedAt != null && "observers" in t ? q(t, s) : t.value = s, t.updatedAt = n);
}
function J(t, e, n, s = y, o) {
  const l = {
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
  return c === null || c !== B && (c.owned ? c.owned.push(l) : c.owned = [l]), l;
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
      h = null, m(() => $(t, e[0]), !1), h = s;
    }
}
function m(t, e) {
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
  g = null, e.length && m(() => G(e), !1);
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
        const l = o.pop(), r = n.observerSlots.pop();
        s < o.length && (l.sourceSlots[r] = s, o[s] = l, n.observerSlots[s] = r);
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
  let s = n.length, o = e.length, l = s, r = 0, i = 0, f = e[o - 1].nextSibling, u = null;
  for (; r < o || i < l; ) {
    if (e[r] === n[i]) {
      r++, i++;
      continue;
    }
    for (; e[o - 1] === n[l - 1]; )
      o--, l--;
    if (o === r) {
      const a = l < s ? i ? n[i - 1].nextSibling : n[l - i] : f;
      for (; i < l; ) t.insertBefore(n[i++], a);
    } else if (l === i)
      for (; r < o; )
        (!u || !u.has(e[r])) && e[r].remove(), r++;
    else if (e[r] === n[l - 1] && n[i] === e[o - 1]) {
      const a = e[--o].nextSibling;
      t.insertBefore(n[i++], e[r++].nextSibling), t.insertBefore(n[--l], a), e[o] = n[l];
    } else {
      if (!u) {
        u = /* @__PURE__ */ new Map();
        let d = i;
        for (; d < l; ) u.set(n[d], d++);
      }
      const a = u.get(e[r]);
      if (a != null)
        if (i < a && a < l) {
          let d = r, C = 1, O;
          for (; ++d < o && d < l && !((O = u.get(e[d])) == null || O !== a + C); )
            C++;
          if (C > a - i) {
            const k = e[r];
            for (; i < a; ) t.insertBefore(n[i++], k);
          } else t.replaceChild(n[i++], e[r++]);
        } else r++;
      else e[r++].remove();
    }
  }
}
const _ = "_$DX_DELEGATE";
function K(t, e, n, s = {}) {
  let o;
  return R((l) => {
    o = l, e === document ? t() : z(e, t(), e.firstChild ? null : void 0, n);
  }, s.owner), () => {
    o(), e.textContent = "";
  };
}
function Y(t, e, n, s) {
  let o;
  const l = () => {
    const i = document.createElement("template");
    return i.innerHTML = t, i.content.firstChild;
  }, r = () => (o || (o = l())).cloneNode(!0);
  return r.cloneNode = r, r;
}
function Z(t, e = window.document) {
  const n = e[_] || (e[_] = /* @__PURE__ */ new Set());
  for (let s = 0, o = t.length; s < o; s++) {
    const l = t[s];
    n.has(l) || (n.add(l), e.addEventListener(l, tt));
  }
}
function z(t, e, n, s) {
  if (n !== void 0 && !s && (s = []), typeof e != "function") return S(t, e, s, n);
  N((o) => S(t, e(), o, n), s);
}
function tt(t) {
  let e = t.target;
  const n = `$$${t.type}`, s = t.target, o = t.currentTarget, l = (f) => Object.defineProperty(t, "target", {
    configurable: !0,
    value: f
  }), r = () => {
    const f = e[n];
    if (f && !e.disabled) {
      const u = e[`${n}Data`];
      if (u !== void 0 ? f.call(e, u, t) : f.call(e, t), t.cancelBubble) return;
    }
    return e.host && typeof e.host != "string" && !e.host._$host && e.contains(t.target) && l(e.host), !0;
  }, i = () => {
    for (; r() && (e = e._$host || e.parentNode || e.host); ) ;
  };
  if (Object.defineProperty(t, "currentTarget", {
    configurable: !0,
    get() {
      return e || document;
    }
  }), t.composedPath) {
    const f = t.composedPath();
    l(f[0]);
    for (let u = 0; u < f.length - 2 && (e = f[u], !!r()); u++) {
      if (e._$host) {
        e = e._$host, i();
        break;
      }
      if (e.parentNode === o)
        break;
    }
  } else i();
  l(s);
}
function S(t, e, n, s, o) {
  for (; typeof n == "function"; ) n = n();
  if (e === n) return n;
  const l = typeof e, r = s !== void 0;
  if (t = r && n[0] && n[0].parentNode || t, l === "string" || l === "number") {
    if (l === "number" && (e = e.toString(), e === n))
      return n;
    if (r) {
      let i = n[0];
      i && i.nodeType === 3 ? i.data !== e && (i.data = e) : i = document.createTextNode(e), n = w(t, n, s, i);
    } else
      n !== "" && typeof n == "string" ? n = t.firstChild.data = e : n = t.textContent = e;
  } else if (e == null || l === "boolean")
    n = w(t, n, s);
  else {
    if (l === "function")
      return N(() => {
        let i = e();
        for (; typeof i == "function"; ) i = i();
        n = S(t, i, n, s);
      }), () => n;
    if (Array.isArray(e)) {
      const i = [], f = n && Array.isArray(n);
      if (L(i, e, n, o))
        return N(() => n = S(t, i, n, s, !0)), () => n;
      if (i.length === 0) {
        if (n = w(t, n, s), r) return n;
      } else f ? n.length === 0 ? v(t, i, s) : X(t, n, i) : (n && w(t), v(t, i));
      n = i;
    } else if (e.nodeType) {
      if (Array.isArray(n)) {
        if (r) return n = w(t, n, s, e);
        w(t, n, null, e);
      } else n == null || n === "" || !t.firstChild ? t.appendChild(e) : t.replaceChild(e, t.firstChild);
      n = e;
    }
  }
  return n;
}
function L(t, e, n, s) {
  let o = !1;
  for (let l = 0, r = e.length; l < r; l++) {
    let i = e[l], f = n && n[t.length], u;
    if (!(i == null || i === !0 || i === !1)) if ((u = typeof i) == "object" && i.nodeType)
      t.push(i);
    else if (Array.isArray(i))
      o = L(t, i, f) || o;
    else if (u === "function")
      if (s) {
        for (; typeof i == "function"; ) i = i();
        o = L(t, Array.isArray(i) ? i : [i], Array.isArray(f) ? f : [f]) || o;
      } else
        t.push(i), o = !0;
    else {
      const a = String(i);
      f && f.nodeType === 3 && f.data === a ? t.push(f) : t.push(document.createTextNode(a));
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
    let l = !1;
    for (let r = e.length - 1; r >= 0; r--) {
      const i = e[r];
      if (o !== i) {
        const f = i.parentNode === t;
        !l && !r ? f ? t.replaceChild(o, i) : t.insertBefore(o, n) : f && i.remove();
      } else l = !0;
    }
  } else t.insertBefore(o, n);
  return [o];
}
var et = /* @__PURE__ */ Y('<button class="ml-4 px-8 btn btn-primary btn-sm">保 存');
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
