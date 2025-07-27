# 数据表格组件 (DataTable)

基于 `solid-js` 和 `ag-grid` 的现代化数据表格组件，提供丰富的表格编辑和管理功能。

## ✨ 功能特性

| 功能 | 描述 | 状态 |
|------|------|------|
| 🖱️ 表格编辑 | 双击单元格可编辑 | ✅ 已完成 |
| 📊 添加字段 | 支持多种字段类型：文本、数字、日期、选项、公式 | ✅ 已完成 |
| 🔄 字段拖拽 | 拖拽字段可调整顺序 | ✅ 已完成 |
| 📋 范围选区 | 复制粘贴与 Excel 交互 | ✅ 已完成 |
| 🎨 表格主题 | 主题可选：网格、线框、紧凑 | ✅ 已完成 |
| ✅ 数据验证 | 字段级别的数据验证规则 | ✅ 已完成 |
| 📤 数据导出 | 支持 CSV 和 Excel 导出 | ✅ 已完成 |
| 🔍 排序过滤 | 内置排序和过滤功能 | ✅ 已完成 |
| 📱 响应式 | 支持移动端适配 | ✅ 已完成 |

## 🚀 快速开始

### 安装依赖

```bash
pnpm add ag-grid-community ag-grid-solid
```

### 基本使用

```tsx
import { Component } from 'solid-js';
import DataTable from './components/DataTable';

const App: Component = () => {
  return (
    <div style="height: 100vh;">
      <DataTable />
    </div>
  );
};
```

### 带配置的使用

```tsx
import { Component, createSignal } from 'solid-js';
import DataTable, { Field } from './components/DataTable';

const App: Component = () => {
  const [data, setData] = createSignal([
    { id: 1, name: '项目A', value: 100, status: '活跃' },
    { id: 2, name: '项目B', value: 250, status: '暂停' },
  ]);

  const [fields, setFields] = createSignal<Field[]>([
    { id: 'id', name: 'ID', type: 'number', width: 80, editable: false },
    { id: 'name', name: '名称', type: 'text', width: 150, editable: true },
    { id: 'value', name: '数值', type: 'number', width: 120, editable: true },
    { id: 'status', name: '状态', type: 'select', options: ['活跃', '暂停'], width: 100, editable: true },
  ]);

  return (
    <DataTable
      data={data()}
      fields={fields()}
      theme="grid"
      onDataChange={setData}
      onFieldsChange={setFields}
    />
  );
};
```

## 📊 字段类型详解

### 1. 文本字段 (text)
```tsx
{
  id: 'name',
  name: '名称',
  type: 'text',
  width: 150,
  editable: true,
  required: true,
  validation: {
    pattern: '^[a-zA-Z0-9\\s]+$',
    message: '只能包含字母、数字和空格'
  }
}
```

### 2. 数字字段 (number)
```tsx
{
  id: 'price',
  name: '价格',
  type: 'number',
  width: 120,
  editable: true,
  validation: {
    min: 0,
    max: 10000,
    message: '价格必须在 0-10000 之间'
  }
}
```

### 3. 日期字段 (date)
```tsx
{
  id: 'date',
  name: '日期',
  type: 'date',
  width: 130,
  editable: true,
  defaultValue: new Date().toISOString().split('T')[0]
}
```

### 4. 选项字段 (select)
```tsx
{
  id: 'status',
  name: '状态',
  type: 'select',
  options: ['进行中', '已完成', '暂停', '取消'],
  width: 100,
  editable: true,
  defaultValue: '进行中'
}
```

### 5. 公式字段 (formula)
```tsx
{
  id: 'total',
  name: '总计',
  type: 'formula',
  formula: 'price * quantity',
  width: 120,
  editable: false
}
```

## ⚙️ 配置选项

### 表格配置
```tsx
const config = {
  enableEditing: true,        // 启用编辑
  enableSorting: true,        // 启用排序
  enableFiltering: true,      // 启用过滤
  enableColumnResize: true,   // 启用列宽调整
  enableColumnReorder: true,  // 启用列重排序
  enableRangeSelection: true, // 启用范围选择
  enableFillHandle: true,     // 启用填充手柄
  enableCopyPaste: true,      // 启用复制粘贴
  enableExcelExport: true,    // 启用 Excel 导出
  rowHeight: 40,              // 行高
  headerHeight: 40,           // 表头高度
  pagination: {
    enabled: false,           // 启用分页
    pageSize: 20,             // 每页行数
    pageSizeOptions: [10, 20, 50, 100]
  }
};
```

### 主题选项
- `grid`: 网格主题（默认）- 现代化网格样式
- `line`: 线框主题 - 简洁的线框样式
- `compact`: 紧凑主题 - 紧凑的布局样式

## 🎯 事件回调

```tsx
<DataTable
  onDataChange={(data) => {
    // 数据变化时触发
    console.log('数据已更新:', data);
  }}
  onFieldsChange={(fields) => {
    // 字段变化时触发
    console.log('字段已更新:', fields);
  }}
  onSelectionChange={(selection) => {
    // 选择变化时触发
    console.log('选择已更新:', selection);
  }}
  onCellEdit={(rowIndex, colId, oldValue, newValue) => {
    // 单元格编辑时触发
    console.log('单元格编辑:', { rowIndex, colId, oldValue, newValue });
  }}
  onRowAdd={(row) => {
    // 添加行时触发
    console.log('添加行:', row);
  }}
  onRowDelete={(rowIds) => {
    // 删除行时触发
    console.log('删除行:', rowIds);
  }}
  onColumnReorder={(newOrder) => {
    // 列重排序时触发
    console.log('列重排序:', newOrder);
  }}
/>
```

## 🎨 样式定制

### 自定义主题
```scss
.data-table-container {
  .ag-grid-container {
    &.ag-theme-alpine {
      --ag-header-height: 50px;
      --ag-row-height: 45px;
      --ag-header-background-color: #your-color;
      --ag-header-foreground-color: #your-color;
      --ag-border-color: #your-border-color;
      --ag-row-hover-color: #your-hover-color;
      --ag-selected-row-background-color: #your-selection-color;
    }
  }
}
```

### 响应式设计
组件已内置响应式设计，支持移动端适配。在小屏幕设备上，工具栏会自动调整为垂直布局。

## ⌨️ 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+C` | 复制选中内容 |
| `Ctrl+V` | 粘贴内容 |
| `Ctrl+A` | 全选 |
| `Delete` | 删除选中内容 |
| `F2` | 编辑当前单元格 |
| `Enter` | 确认编辑 |
| `Escape` | 取消编辑 |
| `Tab` | 移动到下一个单元格 |
| `Shift+Tab` | 移动到上一个单元格 |

## 📱 移动端支持

组件完全支持移动端操作：
- 触摸友好的界面设计
- 响应式布局适配
- 手势操作支持
- 移动端优化的工具栏

## 🔧 开发指南

### 项目结构
```
src/components/DataTable/
├── index.tsx          # 主组件
├── types.ts           # 类型定义
├── DataTable.scss     # 样式文件
├── example.tsx        # 使用示例
├── demo.tsx           # 演示页面
├── test.tsx           # 测试页面
├── usage.md           # 使用文档
└── README.md          # 说明文档
```

### 扩展功能
如需添加新功能，可以：
1. 在 `types.ts` 中添加新的类型定义
2. 在 `index.tsx` 中实现功能逻辑
3. 在 `DataTable.scss` 中添加样式
4. 更新文档和示例

## 🐛 常见问题

### Q: 如何禁用某些功能？
A: 通过 `config` 属性可以禁用特定功能：
```tsx
<DataTable
  config={{
    enableEditing: false,
    enableSorting: false,
    enableFiltering: false
  }}
/>
```

### Q: 如何处理大数据量？
A: 建议启用分页和虚拟滚动：
```tsx
<DataTable
  config={{
    pagination: {
      enabled: true,
      pageSize: 50
    }
  }}
/>
```

### Q: 如何自定义单元格渲染？
A: 在字段定义中使用 `cellRenderer` 属性：
```tsx
{
  id: 'status',
  name: '状态',
  type: 'text',
  cellRenderer: (params) => {
    return `<span class="status-${params.value}">${params.value}</span>`;
  }
}
```

### Q: 如何添加数据验证？
A: 在字段定义中添加 `validation` 属性：
```tsx
{
  id: 'email',
  name: '邮箱',
  type: 'text',
  validation: {
    pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
    message: '请输入有效的邮箱地址'
  }
}
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如有问题，请查看：
1. [使用文档](./usage.md)
2. [示例代码](./example.tsx)
3. [演示页面](./demo.tsx)
4. [测试用例](./test.tsx)