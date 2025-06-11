async function v(e = {}) {
  return new Promise(async (o, i) => {
    const r = {
      update: (n) => {
      },
      ok: (n) => (o(n.content), d())
    }, l = await m(e), s = 794, c = 1123, f = window.innerWidth - s >> 1, p = window.innerHeight - c >> 1, t = window.open("/?loadModule=./online.js", "", `popup,width=${s},height=${c},left=${f},top=${p}`), h = [w("message", (n) => {
      var a;
      const [y, g, E] = ((u) => Array.isArray(u) ? u : [])(JSON.parse(n.data));
      y == "online-doc" && n.source != window && ((a = r[g]) == null || a.call(r, E));
    }), w("beforeunload", () => {
      t.close();
    })];
    await new Promise((n) => t.addEventListener("initialized", n, {
      once: !0
    })), t.postMessage(JSON.stringify(["content", {
      content: l
    }])), t.addEventListener("unload", () => (i(), d()));
    function d() {
      t.close(), h.forEach((n) => n());
    }
  });
}
function w(e, o, i = window) {
  return i.addEventListener(e, o), () => i.removeEventListener(e, o);
}
function m(e) {
  return e.content || (e.src ? fetch(e.src, {
    method: "GET"
  }).then((o) => o.text()) : "");
}
export {
  v as openDoc
};
