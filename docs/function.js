async function x(e = {}) {
  return new Promise(async (t, i) => {
    const r = {
      update: (n) => {
      },
      ok: (n) => (t(n.content), p())
    }, h = await v(e), s = 794, c = 1123, f = window.innerWidth - s >> 1, m = window.innerHeight - c >> 1, a = import.meta.url.split("/"), d = (a.pop(), a.join("/")), y = new URL(d + "/online.js").pathname, o = window.open(`${d}/?loadModule=${y}`, "", `popup,width=${s},height=${c},left=${f},top=${m}`), g = [l("message", (n) => {
      var u;
      const [E, $, L] = ((w) => Array.isArray(w) ? w : [])(JSON.parse(n.data));
      E == "online-doc" && n.source != window && ((u = r[$]) == null || u.call(r, L));
    }), l("beforeunload", () => {
      o.close();
    })];
    await new Promise((n) => o.addEventListener("initialized", n, {
      once: !0
    })), o.postMessage(JSON.stringify(["content", {
      content: h
    }])), o.addEventListener("unload", () => (i(), p()));
    function p() {
      o.close(), g.forEach((n) => n());
    }
  });
}
function l(e, t, i = window) {
  return i.addEventListener(e, t), () => i.removeEventListener(e, t);
}
function v(e) {
  return e.content || (e.src ? fetch(e.src, {
    method: "GET"
  }).then((t) => t.text()) : "");
}
export {
  x as openDoc
};
