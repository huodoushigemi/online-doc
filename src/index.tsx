import { render } from 'solid-js/web'
import App from './App.tsx'
import DataTable from './components/DataTable/index.tsx'
import DataTableExample from './components/DataTable/example.tsx'
import DataTableDemo from './components/DataTable/demo.tsx'
import DataTableTest from './components/DataTable/test.tsx'

const root = document.getElementById('root')

render(() => <App />, root!)
// render(() => <DataTableTest />, root!)

const qs = Object.fromEntries(new URLSearchParams(location.search).entries())

if (qs.loadModule) {
  import(/* @vite-ignore */ qs.loadModule)
}
