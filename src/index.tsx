import { render } from 'solid-js/web'
// import App from './App.tsx'
// import DataTable from './components/DataTable/index.tsx'
// import DataTableExample from './components/DataTable/example.tsx'
// import DataTableDemo from './components/DataTable/demo.tsx'
// import DataTableTest from './components/DataTable/test.tsx'
import { Table } from './components/DataTable/xxx.tsx'

import 'virtual:uno.css'
import { createMutable, createStore } from 'solid-js/store'
import { range } from 'es-toolkit'
import { createSignal } from 'solid-js'

// import '@el-form-render/element-plus/wc'

const root = document.getElementById('root')!

// render(() => <App />, root!)
// render(() => <DataTableTest />, root!)
// render(() => <el-form-render prop:items={[{ lp: '111' }]} />, root!)
const state = createMutable({ bool: true })

const cols = range(30).map(e => ({ name: 'col_' + e, id: e, width: 80 }))
const [data, setData] = createStore(range(100).map((e, i) => Object.fromEntries(cols.map(e => [e.id, i + 1]))))
// const cols = range(10).map(e => ({ name: e, id: e, width: 80 }))
// const [data, setData] = createSignal(range(20).map((e, i) => Object.fromEntries(cols.map(e => [e.id, i + 1]))))

render(() => <input type='checkbox' checked={state.bool} onChange={(e) => state.bool = e.currentTarget.checked} />, root)

setData({ from: 0, to: data.length - 1 }, produce(e => e.g = e[0] % 10))
setData({ from: 0, to: data.length - 1 }, (e, i) => ({ ...e, n: i[0] % 3 }))

// cols[2].fixed = 'left'
// cols[0].editable = true
cols[0].editor = 'select'
cols[0].enum = { 1: 1, 2: 2, 3: 3 }
// cols[0].render = 'file'
cols.forEach(e => (e.editable = true, e.editOnInput = true))

render(() => <Table
  class='w-50vw! h-80vh of-auto'
  // {...window.www}
  index={state.bool}
  stickyHeader={state.bool}
  columns={cols}
  data={data}
  border
  plugins={[
    // props => ({ ...props, td: (o) => <props.td {...o}>asd{o.children}</props.td> })
  ]}
  // th={o => <th asd {...o} />}
  onDataChange={v => setData(reconcile(v))}
  expand={{ render: ({ data }) => <div class='p-6'>{JSON.stringify(data)}</div> }}
  rowGroup={{ fields: ['g', 'n'] }}
/>, root)

const qs = Object.fromEntries(new URLSearchParams(location.search).entries())

if (qs.loadModule) {
  import(/* @vite-ignore */ qs.loadModule)
}
