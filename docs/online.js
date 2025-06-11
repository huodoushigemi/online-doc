let R = P;
const y = 1, A = 2, B = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var u = null;
let T = null, F = null, p = null, h = null, g = null, x = 0;
function J(e, t) {
  const n = p, s = u, o = e.length === 0, i = t === void 0 ? s : t, r = o ? B : {
    owned: null,
    cleanups: null,
    context: i ? i.context : null,
    owner: i
  }, l = o ? e : () => e(() => D(() => b(r)));
  u = r, p = null;
  try {
    return S(l, !0);
  } finally {
    p = n, u = s;
  }
}
function $(e, t, n) {
  const s = W(e, t, !1, y);
  U(s);
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
function q(e, t, n) {
  let s = e.value;
  return (!e.comparator || !e.comparator(s, t)) && (e.value = t, e.observers && e.observers.length && S(() => {
    for (let o = 0; o < e.observers.length; o += 1) {
      const i = e.observers[o], r = T && T.running;
      r && T.disposed.has(i), (r ? !i.tState : !i.state) && (i.pure ? h.push(i) : g.push(i), i.observers && k(i)), r || (i.state = y);
    }
    if (h.length > 1e6)
      throw h = [], new Error();
  }, !1)), t;
}
function U(e) {
  if (!e.fn) return;
  b(e);
  const t = x;
  Q(e, e.value, t);
}
function Q(e, t, n) {
  let s;
  const o = u, i = p;
  p = u = e;
  try {
    s = e.fn(t);
  } catch (r) {
    return e.pure && (e.state = y, e.owned && e.owned.forEach(b), e.owned = null), e.updatedAt = n + 1, I(r);
  } finally {
    p = i, u = o;
  }
  (!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? q(e, s) : e.value = s, e.updatedAt = n);
}
function W(e, t, n, s = y, o) {
  const i = {
    fn: e,
    state: s,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: u,
    context: u ? u.context : null,
    pure: n
  };
  return u === null || u !== B && (u.owned ? u.owned.push(i) : u.owned = [i]), i;
}
function M(e) {
  if (e.state === 0) return;
  if (e.state === A) return v(e);
  if (e.suspense && D(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const t = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < x); )
    e.state && t.push(e);
  for (let n = t.length - 1; n >= 0; n--)
    if (e = t[n], e.state === y)
      U(e);
    else if (e.state === A) {
      const s = h;
      h = null, S(() => v(e, t[0]), !1), h = s;
    }
}
function S(e, t) {
  if (h) return e();
  let n = !1;
  t || (h = []), g ? n = !0 : g = [], x++;
  try {
    const s = e();
    return X(n), s;
  } catch (s) {
    n || (g = null), h = null, I(s);
  }
}
function X(e) {
  if (h && (P(h), h = null), e) return;
  const t = g;
  g = null, t.length && S(() => R(t), !1);
}
function P(e) {
  for (let t = 0; t < e.length; t++) M(e[t]);
}
function v(e, t) {
  e.state = 0;
  for (let n = 0; n < e.sources.length; n += 1) {
    const s = e.sources[n];
    if (s.sources) {
      const o = s.state;
      o === y ? s !== t && (!s.updatedAt || s.updatedAt < x) && M(s) : o === A && v(s, t);
    }
  }
}
function k(e) {
  for (let t = 0; t < e.observers.length; t += 1) {
    const n = e.observers[t];
    n.state || (n.state = A, n.pure ? h.push(n) : g.push(n), n.observers && k(n));
  }
}
function b(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      const n = e.sources.pop(), s = e.sourceSlots.pop(), o = n.observers;
      if (o && o.length) {
        const i = o.pop(), r = n.observerSlots.pop();
        s < o.length && (i.sourceSlots[r] = s, o[s] = i, n.observerSlots[s] = r);
      }
    }
  if (e.tOwned) {
    for (t = e.tOwned.length - 1; t >= 0; t--) b(e.tOwned[t]);
    delete e.tOwned;
  }
  if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) b(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  e.state = 0;
}
function K(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function I(e, t = u) {
  throw K(e);
}
function Y(e, t, n) {
  let s = n.length, o = t.length, i = s, r = 0, l = 0, f = t[o - 1].nextSibling, c = null;
  for (; r < o || l < i; ) {
    if (t[r] === n[l]) {
      r++, l++;
      continue;
    }
    for (; t[o - 1] === n[i - 1]; )
      o--, i--;
    if (o === r) {
      const a = i < s ? l ? n[l - 1].nextSibling : n[i - l] : f;
      for (; l < i; ) e.insertBefore(n[l++], a);
    } else if (i === l)
      for (; r < o; )
        (!c || !c.has(t[r])) && t[r].remove(), r++;
    else if (t[r] === n[i - 1] && n[l] === t[o - 1]) {
      const a = t[--o].nextSibling;
      e.insertBefore(n[l++], t[r++].nextSibling), e.insertBefore(n[--i], a), t[o] = n[i];
    } else {
      if (!c) {
        c = /* @__PURE__ */ new Map();
        let d = l;
        for (; d < i; ) c.set(n[d], d++);
      }
      const a = c.get(t[r]);
      if (a != null)
        if (l < a && a < i) {
          let d = r, C = 1, _;
          for (; ++d < o && d < i && !((_ = c.get(t[d])) == null || _ !== a + C); )
            C++;
          if (C > a - l) {
            const H = t[r];
            for (; l < a; ) e.insertBefore(n[l++], H);
          } else e.replaceChild(n[l++], t[r++]);
        } else r++;
      else t[r++].remove();
    }
  }
}
const L = "_$DX_DELEGATE";
function Z(e, t, n, s = {}) {
  let o;
  return J((i) => {
    o = i, t === document ? e() : ee(t, e(), t.firstChild ? null : void 0, n);
  }, s.owner), () => {
    o(), t.textContent = "";
  };
}
function V(e, t, n, s) {
  let o;
  const i = () => {
    const l = document.createElement("template");
    return l.innerHTML = e, l.content.firstChild;
  }, r = () => (o || (o = i())).cloneNode(!0);
  return r.cloneNode = r, r;
}
function z(e, t = window.document) {
  const n = t[L] || (t[L] = /* @__PURE__ */ new Set());
  for (let s = 0, o = e.length; s < o; s++) {
    const i = e[s];
    n.has(i) || (n.add(i), t.addEventListener(i, te));
  }
}
function ee(e, t, n, s) {
  if (n !== void 0 && !s && (s = []), typeof t != "function") return m(e, t, s, n);
  $((o) => m(e, t(), o, n), s);
}
function te(e) {
  let t = e.target;
  const n = `$$${e.type}`, s = e.target, o = e.currentTarget, i = (f) => Object.defineProperty(e, "target", {
    configurable: !0,
    value: f
  }), r = () => {
    const f = t[n];
    if (f && !t.disabled) {
      const c = t[`${n}Data`];
      if (c !== void 0 ? f.call(t, c, e) : f.call(t, e), e.cancelBubble) return;
    }
    return t.host && typeof t.host != "string" && !t.host._$host && t.contains(e.target) && i(t.host), !0;
  }, l = () => {
    for (; r() && (t = t._$host || t.parentNode || t.host); ) ;
  };
  if (Object.defineProperty(e, "currentTarget", {
    configurable: !0,
    get() {
      return t || document;
    }
  }), e.composedPath) {
    const f = e.composedPath();
    i(f[0]);
    for (let c = 0; c < f.length - 2 && (t = f[c], !!r()); c++) {
      if (t._$host) {
        t = t._$host, l();
        break;
      }
      if (t.parentNode === o)
        break;
    }
  } else l();
  i(s);
}
function m(e, t, n, s, o) {
  for (; typeof n == "function"; ) n = n();
  if (t === n) return n;
  const i = typeof t, r = s !== void 0;
  if (e = r && n[0] && n[0].parentNode || e, i === "string" || i === "number") {
    if (i === "number" && (t = t.toString(), t === n))
      return n;
    if (r) {
      let l = n[0];
      l && l.nodeType === 3 ? l.data !== t && (l.data = t) : l = document.createTextNode(t), n = w(e, n, s, l);
    } else
      n !== "" && typeof n == "string" ? n = e.firstChild.data = t : n = e.textContent = t;
  } else if (t == null || i === "boolean")
    n = w(e, n, s);
  else {
    if (i === "function")
      return $(() => {
        let l = t();
        for (; typeof l == "function"; ) l = l();
        n = m(e, l, n, s);
      }), () => n;
    if (Array.isArray(t)) {
      const l = [], f = n && Array.isArray(n);
      if (N(l, t, n, o))
        return $(() => n = m(e, l, n, s, !0)), () => n;
      if (l.length === 0) {
        if (n = w(e, n, s), r) return n;
      } else f ? n.length === 0 ? O(e, l, s) : Y(e, n, l) : (n && w(e), O(e, l));
      n = l;
    } else if (t.nodeType) {
      if (Array.isArray(n)) {
        if (r) return n = w(e, n, s, t);
        w(e, n, null, t);
      } else n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
      n = t;
    }
  }
  return n;
}
function N(e, t, n, s) {
  let o = !1;
  for (let i = 0, r = t.length; i < r; i++) {
    let l = t[i], f = n && n[e.length], c;
    if (!(l == null || l === !0 || l === !1)) if ((c = typeof l) == "object" && l.nodeType)
      e.push(l);
    else if (Array.isArray(l))
      o = N(e, l, f) || o;
    else if (c === "function")
      if (s) {
        for (; typeof l == "function"; ) l = l();
        o = N(e, Array.isArray(l) ? l : [l], Array.isArray(f) ? f : [f]) || o;
      } else
        e.push(l), o = !0;
    else {
      const a = String(l);
      f && f.nodeType === 3 && f.data === a ? e.push(f) : e.push(document.createTextNode(a));
    }
  }
  return o;
}
function O(e, t, n = null) {
  for (let s = 0, o = t.length; s < o; s++) e.insertBefore(t[s], n);
}
function w(e, t, n, s) {
  if (n === void 0) return e.textContent = "";
  const o = s || document.createTextNode("");
  if (t.length) {
    let i = !1;
    for (let r = t.length - 1; r >= 0; r--) {
      const l = t[r];
      if (o !== l) {
        const f = l.parentNode === e;
        !i && !r ? f ? e.replaceChild(o, l) : e.insertBefore(o, n) : f && l.remove();
      } else i = !0;
    }
  } else e.insertBefore(o, n);
  return [o];
}
var ne = /* @__PURE__ */ V('<header class="sticky top-0 z-1 bg-[--header-bg]">'), se = /* @__PURE__ */ V('<div class="flex h-12"><div ml-2 class="flex items-center"><img src=./vite.svg><span ml-2 self-center>在线文档服务</span></div><div class="ml-a self-center mr-2"self-center><button class=bg-blue bg-blue style=width:120px;line-height:1.5>确 认');
window.dispatchEvent(new Event("initialized"));
const E = {
  content: (e) => editor.commands.setContent(e.content)
};
function j(e, t, n = opener) {
  n == null || n.postMessage(JSON.stringify(["online-doc", e, t]));
}
window == null || window.addEventListener("message", (e) => {
  var s;
  if (e.source == window) return;
  const [t, n] = JSON.parse(e.data);
  (s = E[t]) == null || s.call(E, n);
});
editor.on("update", () => {
  const e = editor.getHTML();
  j("update", {
    content: e
  });
});
function le() {
  const e = editor.getHTML();
  j("ok", {
    content: e
  });
}
(async () => {
  const e = Object.fromEntries(new URLSearchParams(location.search).entries()), t = await ie(e);
  t && E.content({
    content: t
  });
})();
function ie(e) {
  return e.content || (e.src ? fetch(e.src, {
    method: "GET"
  }).then((t) => t.text()) : "");
}
const G = ne();
document.body.prepend(G);
Z(() => (() => {
  var e = se(), t = e.firstChild, n = t.nextSibling, s = n.firstChild;
  return s.$$click = le, e;
})(), G);
z(["click"]);
