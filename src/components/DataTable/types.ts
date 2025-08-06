// 字段类型定义
export type FieldType = 'text' | 'number' | 'date' | 'select' | 'formula';

// 字段接口
export interface Field {
  id: string;
  name: string;
  type: FieldType;
  options?: string[] | { label?: string; value: string }[] // 用于 select 类型
  formula?: string; // 用于 formula 类型
  width?: number;
  editable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  required?: boolean;
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

// 表格主题
export type TableTheme = 'grid' | 'line' | 'compact';

// 表格数据行
export interface TableRow {
  id: string | number;
  [key: string]: any;
}

// 表格选择范围
export interface SelectionRange {
  startRow: number;
  endRow: number;
  startCol: number;
  endCol: number;
}

// 表格事件
export interface TableEvents {
  onDataChange?: (data: TableRow[]) => void;
  onFieldsChange?: (fields: Field[]) => void;
  onSelectionChange?: (selection: SelectionRange[]) => void;
  onCellEdit?: (rowIndex: number, colId: string, oldValue: any, newValue: any) => void;
  onRowAdd?: (row: TableRow) => void;
  onRowDelete?: (rowIds: (string | number)[]) => void;
  onColumnReorder?: (newOrder: string[]) => void;
}

// 表格配置
export interface TableConfig {
  enableEditing?: boolean;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enableColumnResize?: boolean;
  enableColumnReorder?: boolean;
  enableRangeSelection?: boolean;
  enableFillHandle?: boolean;
  enableCopyPaste?: boolean;
  enableExcelExport?: boolean;
  rowHeight?: number;
  headerHeight?: number;
  pagination?: {
    enabled: boolean;
    pageSize: number;
    pageSizeOptions: number[];
  };
}

// 表格组件属性
export interface DataTableProps extends TableEvents {
  data?: TableRow[];
  fields?: Field[];
  theme?: TableTheme;
  config?: TableConfig;
  className?: string;
  style?: Record<string, any>;
}

// 公式计算上下文
export interface FormulaContext {
  [key: string]: any;
}

// 公式计算函数
export type FormulaFunction = (context: FormulaContext) => any;

// 单元格编辑器配置
export interface CellEditorConfig {
  type: string;
  params?: Record<string, any>;
  validator?: (value: any) => boolean | string;
}

// 单元格渲染器配置
export interface CellRendererConfig {
  type: string;
  params?: Record<string, any>;
}

// 导出格式
export type ExportFormat = 'csv' | 'excel' | 'json' | 'pdf';

// 导出配置
export interface ExportConfig {
  format: ExportFormat;
  fileName?: string;
  includeHeaders?: boolean;
  includeSelection?: boolean;
}

// 导入配置
export interface ImportConfig {
  format: ExportFormat;
  onSuccess?: (data: TableRow[]) => void;
  onError?: (error: Error) => void;
  validateData?: (data: any[]) => boolean;
}

// 表格状态
export interface TableState {
  data: TableRow[];
  fields: Field[];
  selection: SelectionRange[];
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  filterValues: Record<string, any>;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  error?: string;
}

// 表格操作
export interface TableActions {
  addRow: (row?: Partial<TableRow>) => void;
  deleteRows: (rowIds: (string | number)[]) => void;
  updateRow: (rowId: string | number, updates: Partial<TableRow>) => void;
  addField: (field: Field) => void;
  removeField: (fieldId: string) => void;
  updateField: (fieldId: string, updates: Partial<Field>) => void;
  sortBy: (columnId: string, direction: 'asc' | 'desc') => void;
  filterBy: (columnId: string, value: any) => void;
  clearFilters: () => void;
  exportData: (config: ExportConfig) => void;
  importData: (config: ImportConfig) => void;
  selectRange: (range: SelectionRange) => void;
  clearSelection: () => void;
  copySelection: () => void;
  pasteData: (data: any[][]) => void;
} 