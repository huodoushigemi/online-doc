import { delay } from "es-toolkit"

export function file2base64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
  })
}

export function chooseFile() {
  return new Promise<File>((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = () => {
      if (input.files && input.files.length > 0) {
        resolve(input.files[0])
      } else {}
    }
    input.oncancel = reject
    input.click()
  })
}

export function chooseImage() {
  return chooseFile()
}

export async function html2docx(content: string) {
  const { inline, initWasm } = await import('@css-inline/css-inline-wasm')
  const wasm = fetch(await import('@css-inline/css-inline-wasm/index_bg.wasm?url').then((e) => e.default))
  await initWasm(wasm).catch(() => {})

  content = inline(content + getStyles())
  console.log(content)
  const blob = await import('html-docx-js-typescript').then((e) => e.asBlob(content))
  return blob as Blob
}

export async function print(html: string) {
  const iframe = document.createElement('iframe')
  const styles = [...document.querySelectorAll('style'), ...document.querySelectorAll('link[rel="stylesheet"]')] as HTMLElement[]
  iframe.srcdoc = `${styles.map(e => e.outerHTML).join('\n')}\n\n${html}`
  Object.assign(iframe.style, { position: 'fixed', display: 'none' })
  document.body.append(iframe)
  await new Promise(resolve => iframe.contentWindow.addEventListener('load', resolve, { once: true }))
  await delay(300)
  iframe.contentWindow.print()
  iframe.remove()
}

export function getStyles(el = document as ParentNode) {
  return [...el.querySelectorAll('style'), ...el.querySelectorAll('link[rel="stylesheet"]')].map(e => e.outerHTML).join('\n')
}