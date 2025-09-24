import { render } from 'solid-js/web'
// import App from './App.tsx'
import { Table } from './components/DataTable/xxx.tsx'

import 'virtual:uno.css'
import { createMutable, createStore, produce, reconcile } from 'solid-js/store'
import { range } from 'es-toolkit'

const root = document.getElementById('root')!

const state = createMutable({ bool: true })

const cols = range(30).map(e => ({ name: 'col_' + e, id: e, width: 80 }))
let data = createMutable(range(100).map((e, i) => Object.fromEntries(cols.map(e => [e.id, i + 1]))))

render(() => <input type='checkbox' checked={state.bool} onChange={(e) => state.bool = e.currentTarget.checked} />, root)
render(() => <button onClick={() => data[0][1] = 'xxx'}>xxx</button>, root)

// setData({ from: 0, to: data.length - 1 }, produce(e => e.g = e[0] % 10))
// setData({ from: 0, to: data.length - 1 }, (e, i) => ({ ...e, n: i[0] % 3 }))

// cols[2].fixed = 'left'
// cols[0].editable = true
cols[0].editor = 'select'
cols[0].enum = { 1: 1, 2: 2, 3: 3 }
// cols[0].render = 'file'
cols.forEach(e => (e.editable = true, e.editOnInput = true))

render(() => <Table
  class='w-50vw! h-80vh of-auto'
  index={state.bool}
  stickyHeader={state.bool}
  columns={cols}
  data={data}
  border
  plugins={[
    // props => ({ ...props, td: (o) => <props.td {...o}>asd{o.children}</props.td> })
  ]}
  onDataChange={v => reconcile(v)(data)}
  expand={{ render: ({ data }) => <div class='p-6'>{JSON.stringify(data)}</div> }}
  rowGroup={{ fields: ['g', 'n'] }}
/>, root)

const qs = Object.fromEntries(new URLSearchParams(location.search).entries())

if (qs.loadModule) {
  import(/* @vite-ignore */ qs.loadModule)
}
