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
    input.click()
  })
}

export function chooseImage() {
  return chooseFile()
}