import { render } from 'solid-js/web'
// import App from './App.tsx'
// import DataTable from './components/DataTable/index.tsx'
// import DataTableExample from './components/DataTable/example.tsx'
// import DataTableDemo from './components/DataTable/demo.tsx'
// import DataTableTest from './components/DataTable/test.tsx'
import { Table } from './components/DataTable/xxx.tsx'

import 'virtual:uno.css'
import { createMutable } from 'solid-js/store'
import { range } from 'es-toolkit'
import { createSignal } from 'solid-js'

// import '@el-form-render/element-plus/wc'

const root = document.getElementById('root')!

// render(() => <App />, root!)
// render(() => <DataTableTest />, root!)
// render(() => <el-form-render prop:items={[{ lp: '111' }]} />, root!)
const state = createMutable({ bool: true })

const cols = range(100).map(e => ({ name: e, id: e, width: 80 }))
// cols[0].fixed = 'left'
// cols.at(-1).fixed = 'right'
const [data, setData] = createSignal(range(300).map((e, i) => Object.fromEntries(cols.map(e => [e.id, i + 1]))))

render(() => <input type='checkbox' checked={state.bool} onChange={(e) => state.bool = e.currentTarget.checked} />, root)

render(() => <Table
  // {...window.www}
  index={state.bool}
  stickyHeader={state.bool}
  columns={cols}
  data={data()}
  border
  plugins={[
    // props => ({ ...props, td: (o) => <props.td {...o}>asd{o.children}</props.td> })
  ]}
  onDataChange={setData}
/>, root)

const qs = Object.fromEntries(new URLSearchParams(location.search).entries())

if (qs.loadModule) {
  import(/* @vite-ignore */ qs.loadModule)
}
