# DataTable 组件使用文档

## 功能特性

- ✅ **表格编辑**: 双击单元格可编辑
- ✅ **添加字段**: 支持多种字段类型（文本、数字、日期、选项、公式）
- ✅ **字段拖拽**: 拖拽字段可调整顺序
- ✅ **范围选区**: 复制粘贴与 Excel 交互
- ✅ **表格主题**: 主题可选（网格、线框、紧凑）

## 基本使用

```tsx
import DataTable from './components/DataTable';

// 基本使用
<DataTable />

// 带配置的使用
<DataTable
  data={yourData}
  fields={yourFields}
  theme="grid"
  onDataChange={(data) => console.log('数据变化:', data)}
  onFieldsChange={(fields) => console.log('字段变化:', fields)}
/>
```

## 字段类型

### 1. 文本字段 (text)
```tsx
{
  id: 'name',
  name: '名称',
  type: 'text',
  width: 150,
  editable: true
}
```

### 2. 数字字段 (number)
```tsx
{
  id: 'value',
  name: '数值',
  type: 'number',
  width: 120,
  editable: true,
  validation: {
    min: 0,
    max: 1000,
    message: '数值必须在 0-1000 之间'
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
  editable: true
}
```

### 4. 选项字段 (select)
```tsx
{
  id: 'status',
  name: '状态',
  type: 'select',
  options: ['活跃', '暂停', '完成'],
  width: 100,
  editable: true
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

## 配置选项

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
- `grid`: 网格主题（默认）
- `line`: 线框主题
- `compact`: 紧凑主题

## 事件回调

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

## 工具栏功能

### 基本操作
- **添加行**: 在表格末尾添加新行
- **删除选中**: 删除选中的行
- **字段管理**: 打开字段管理对话框

### 主题切换
- **网格**: 标准网格样式
- **线框**: 简洁线框样式
- **紧凑**: 紧凑布局样式

### 数据操作
- **复制**: 复制选中的单元格到剪贴板
- **粘贴**: 从剪贴板粘贴数据
- **导出 CSV**: 导出数据为 CSV 文件
- **导出 Excel**: 导出数据为 Excel 文件

## 字段管理

### 添加字段
1. 点击"字段管理"按钮
2. 填写字段名称
3. 选择字段类型
4. 配置字段选项（如需要）
5. 设置字段属性
6. 点击"添加字段"

### 字段属性
- **名称**: 字段显示名称
- **类型**: 字段数据类型
- **可编辑**: 是否允许编辑
- **必填**: 是否为必填字段
- **默认值**: 字段默认值
- **验证规则**: 数据验证规则

## 键盘快捷键

- `Ctrl+C`: 复制选中内容
- `Ctrl+V`: 粘贴内容
- `Ctrl+A`: 全选
- `Delete`: 删除选中内容
- `F2`: 编辑当前单元格
- `Enter`: 确认编辑
- `Escape`: 取消编辑

## 样式定制

### 自定义主题
```scss
.data-table-container {
  .ag-grid-container {
    &.ag-theme-alpine {
      --ag-header-height: 50px;
      --ag-row-height: 45px;
      --ag-header-background-color: #your-color;
      --ag-header-foreground-color: #your-color;
    }
  }
}
```

### 响应式设计
组件已内置响应式设计，支持移动端适配。

## 注意事项

1. **公式字段**: 公式字段不可编辑，会自动计算结果
2. **数据验证**: 支持字段级别的数据验证
3. **性能优化**: 大数据量时建议启用分页
4. **浏览器兼容**: 支持现代浏览器，IE 需要 polyfill
5. **内存管理**: 组件会自动清理事件监听器

## 常见问题

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

### Q: 如何添加自定义工具栏按钮？
A: 可以扩展工具栏组件或使用插槽功能（需要修改组件）。

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