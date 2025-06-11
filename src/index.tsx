import { render } from 'solid-js/web'
import './index.scss'
import './tiptap.scss'
import App from './App.tsx'

import 'virtual:uno.css'

const root = document.getElementById('root')

render(() => <App />, root!)

const qs = Object.fromEntries(new URLSearchParams(location.search).entries())

if (qs.loadModule) {
  import(/* @vite-ignore */ qs.loadModule)
}


export function xxx() {
  console.log(import.meta.glob('./*.tsx'))
}