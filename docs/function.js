async function v(e = {}) {
  return new Promise(async (t, i) => {
    const r = {
      update: (n) => {
      },
      ok: (n) => (t(n.content), d())
    }, l = await m(e), s = 794, c = 1123, f = window.innerWidth - s >> 1, p = window.innerHeight - c >> 1, o = window.open("/?loadModule=/src/online", "", `popup,width=${s},height=${c},left=${f},top=${p}`), h = [w("message", (n) => {
      var a;
      const [y, g, E] = ((u) => Array.isArray(u) ? u : [])(JSON.parse(n.data));
      y == "online-doc" && n.source != window && ((a = r[g]) == null || a.call(r, E));
    }), w("beforeunload", () => {
      o.close();
    })];
    await new Promise((n) => o.addEventListener("initialized", n, {
      once: !0
    })), o.postMessage(JSON.stringify(["content", {
      content: l
    }])), o.addEventListener("unload", () => (i(), d()));
    function d() {
      o.close(), h.forEach((n) => n());
    }
  });
}
function w(e, t, i = window) {
  return i.addEventListener(e, t), () => i.removeEventListener(e, t);
}
function m(e) {
  return e.content || (e.src ? fetch(e.src, {
    method: "GET"
  }).then((t) => t.text()) : "");
}
export {
  v as openDoc
};
