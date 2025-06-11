async function v(e = {}) {
  return new Promise(async (t, i) => {
    const r = {
      update: (n) => {
      },
      ok: (n) => (t(n.content), d())
    }, l = await $(e), c = 794, a = 1123, h = window.innerWidth - c >> 1, f = window.innerHeight - a >> 1, s = new URL(import.meta.url).pathname.split("/"), m = (s.pop(), s.push("online.js"), s.join("/")), o = window.open(`/?loadModule=${m}`, "", `popup,width=${c},height=${a},left=${h},top=${f}`), y = [w("message", (n) => {
      var p;
      const [g, E, L] = ((u) => Array.isArray(u) ? u : [])(JSON.parse(n.data));
      g == "online-doc" && n.source != window && ((p = r[E]) == null || p.call(r, L));
    }), w("beforeunload", () => {
      o.close();
    })];
    await new Promise((n) => o.addEventListener("initialized", n, {
      once: !0
    })), o.postMessage(JSON.stringify(["content", {
      content: l
    }])), o.addEventListener("unload", () => (i(), d()));
    function d() {
      o.close(), y.forEach((n) => n());
    }
  });
}
function w(e, t, i = window) {
  return i.addEventListener(e, t), () => i.removeEventListener(e, t);
}
function $(e) {
  return e.content || (e.src ? fetch(e.src, {
    method: "GET"
  }).then((t) => t.text()) : "");
}
export {
  v as openDoc
};
