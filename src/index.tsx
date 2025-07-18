import { render } from 'solid-js/web'
import App from './App.tsx'

const root = document.getElementById('root')

render(() => <App />, root!)

const qs = Object.fromEntries(new URLSearchParams(location.search).entries())

if (qs.loadModule) {
  import(/* @vite-ignore */ qs.loadModule)
}
