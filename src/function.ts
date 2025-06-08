export async function openDoc(options = {}) {
  return new Promise(async (resolve, reject) => {
    const events = {
      update: (e) => {},
      ok: (e) => (resolve(e.content), close()),
    }

    const content = await loadContent(options)

    const w = 794, h = 1123, x = window.innerWidth - w >> 1, y = window.innerHeight - h >> 1
    const win = window.open(`/?loadModule=/src/online`, '', `popup,width=${w},height=${h},left=${x},top=${y}`)!

    const cleans = [
      on('message', e => {
        const [origin, type, data] = (data => Array.isArray(data) ? data : [])(JSON.parse(e.data))
        if (origin != 'online-doc') return
        if (e.source == window) return
        events[type]?.(data)
      }),
      on('beforeunload', () => {
        win.close()
      })
    ]
    
    await new Promise(resolve => win.addEventListener('initialized', resolve, { once: true }))
    win.postMessage(JSON.stringify(['content', { content }]))
    win.addEventListener('unload', () => (reject(), close()))

    function close() {
      win.close()
      cleans.forEach(cb => cb())
    }
  })

}

function on<K extends keyof WindowEventMap>(k: K, cb: (e: WindowEventMap[K]) => any, win = window) {
  win.addEventListener(k, cb)
  return () => win.removeEventListener(k, cb)
}


function loadContent(data) {
  return data.content || (data.src ? fetch(data.src, { method: 'GET' }).then(e => e.text()) : '')
}