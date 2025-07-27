import { createSignal, createEffect, onMount, For, Show } from 'solid-js';
import type { Component } from 'solid-js';
import AgGridSolid from 'ag-grid-solid';
import { type ColDef, type GridOptions, type GridApi, type CellEditingStoppedEvent, type SelectionChangedEvent, themeQuartz, themeBalham, themeAlpine } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import type { DataTableProps, Field, FieldType, TableRow, TableTheme, SelectionRange,TableConfig,ExportConfig } from './types';
export * from './types'
import './DataTable.scss';

const DataTable: Component<DataTableProps> = (props) => {
  const [gridApi, setGridApi] = createSignal<GridApi | null>(null);
  const [columnApi, setColumnApi] = createSignal<ColumnApi | null>(null);
  const [data, setData] = createSignal<TableRow[]>(props.data || []);
  const [fields, setFields] = createSignal<Field[]>(props.fields || []);
  const [selectedRange, setSelectedRange] = createSignal<SelectionRange[]>([]);
  const [showFieldManager, setShowFieldManager] = createSignal(false);
  const [newField, setNewField] = createSignal<Partial<Field>>({});
  const [isLoading, setIsLoading] = createSignal(false);

  // 默认配置
  const defaultConfig: TableConfig = {
    enableEditing: true,
    enableSorting: true,
    enableFiltering: true,
    enableColumnResize: true,
    enableColumnReorder: true,
    enableRangeSelection: true,
    enableFillHandle: true,
    enableCopyPaste: true,
    enableExcelExport: true,
    rowHeight: 40,
    headerHeight: 40,
    pagination: {
      enabled: false,
      pageSize: 20,
      pageSizeOptions: [10, 20, 50, 100]
    }
  };

  const config = () => ({ ...defaultConfig, ...props.config });

  // 默认字段
  const defaultFields: Field[] = [
    { id: 'id', name: 'ID', type: 'number', width: 80, editable: false },
    { id: 'name', name: '名称', type: 'text', width: 150, editable: true },
    { id: 'value', name: '数值', type: 'number', width: 120, editable: true },
    { id: 'date', name: '日期', type: 'date', width: 130, editable: true },
    { id: 'status', name: '状态', type: 'select', options: ['活跃', '暂停', '完成'], width: 100, editable: true },
  ];

  // 默认数据
  const defaultData: TableRow[] = [
    { id: 1, name: '项目A', value: 100, date: '2024-01-15', status: '活跃' },
    { id: 2, name: '项目B', value: 250, date: '2024-01-20', status: '暂停' },
    { id: 3, name: '项目C', value: 75, date: '2024-01-25', status: '完成' },
  ];

  // 初始化数据
  onMount(() => {
    if (!props.data) {
      setData(defaultData);
    }
    if (!props.fields) {
      setFields(defaultFields);
    }
  });

  // 创建列定义
  const createColumnDefs = (): ColDef[] => {
    return fields().map(field => {
      const colDef: ColDef = {
        field: field.id,
        headerName: field.name,
        width: field.width,
        editable: field.editable !== false && config().enableEditing,
        cellEditor: getCellEditor(field),
        cellEditorParams: getCellEditorParams(field),
        cellRenderer: getCellRenderer(field),
        sortable: field.sortable !== false && config().enableSorting,
        filter: field.filterable !== false && config().enableFiltering,
        resizable: config().enableColumnResize,
        draggable: config().enableColumnReorder,
        cellValidator: getCellValidator(field),
      };

      // 为公式字段添加特殊处理
      if (field.type === 'formula') {
        colDef.editable = false;
        colDef.cellRenderer = (params: any) => {
          try {
            const formula = field.formula || '';
            const result = evaluateFormula(formula, params.data);
            return result;
          } catch (error) {
            return '公式错误';
          }
        };
      }

      return colDef;
    });
  };

  // 获取单元格编辑器
  const getCellEditor = (field: Field) => {
    switch (field.type) {
      case 'select':
        return 'agSelectCellEditor';
      case 'date':
        return 'agDateCellEditor';
      default:
        return 'agTextCellEditor';
    }
  };

  // 获取单元格编辑器参数
  const getCellEditorParams = (field: Field) => {
    if (field.type === 'select' && field.options) {
      return { values: field.options };
    }
    return {};
  };

  // 获取单元格渲染器
  const getCellRenderer = (field: Field) => {
    switch (field.type) {
      case 'date':
        return (params: any) => {
          if (params.value) {
            return new Date(params.value).toLocaleDateString();
          }
          return '';
        };
      case 'number':
        return (params: any) => {
          if (typeof params.value === 'number') {
            return params.value.toLocaleString();
          }
          return params.value;
        };
      default:
        return undefined;
    }
  };

  // 获取单元格验证器
  const getCellValidator = (field: Field) => {
    if (!field.validation) return undefined;

    return (params: any) => {
      const value = params.value;
      const validation = field.validation!;

      if (validation.min !== undefined && value < validation.min) {
        return validation.message || `最小值不能小于 ${validation.min}`;
      }

      if (validation.max !== undefined && value > validation.max) {
        return validation.message || `最大值不能大于 ${validation.max}`;
      }

      if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
        return validation.message || '格式不正确';
      }

      return true;
    };
  };

  // 评估公式
  const evaluateFormula = (formula: string, data: any) => {
    try {
      let processedFormula = formula;
      Object.keys(data).forEach(key => {
        const regex = new RegExp(`\\b${key}\\b`, 'g');
        processedFormula = processedFormula.replace(regex, data[key] || 0);
      });
      return eval(processedFormula);
    } catch (error) {
      return '公式错误';
    }
  };

  // 网格选项
  const gridOptions: GridOptions = {
    columnDefs: createColumnDefs(),
    rowData: data(),
    enableRangeSelection: config().enableRangeSelection,
    enableFillHandle: config().enableFillHandle,
    suppressCopyRowsToClipboard: !config().enableCopyPaste,
    suppressCopySingleCellRanges: !config().enableCopyPaste,
    suppressPasteSingleCellRanges: !config().enableCopyPaste,
    suppressPasteMultipleCellRanges: !config().enableCopyPaste,
    allowPasteFromExcel: config().enableCopyPaste,
    allowCopyToExcel: config().enableCopyPaste,
    rowHeight: config().rowHeight,
    headerHeight: config().headerHeight,
    // theme: themeQuartz.withParams({ browserColorScheme: "light", headerFontSize: 14 }),
    // theme: themeAlpine,
    onGridReady: (params) => {
      setGridApi(params.api);
      setColumnApi(params.columnApi);
    },
    onCellEditingStopped: (event: CellEditingStoppedEvent) => {
      const newData = [...data()];
      const rowIndex = event.rowIndex;
      if (rowIndex !== undefined && newData[rowIndex]) {
        const oldValue = newData[rowIndex][event.column.getColId()];
        newData[rowIndex] = { ...newData[rowIndex], [event.column.getColId()]: event.newValue };
        setData(newData);
        props.onDataChange?.(newData);
        props.onCellEdit?.(rowIndex, event.column.getColId(), oldValue, event.newValue);
      }
    },
    onSelectionChanged: (event: SelectionChangedEvent) => {
      const selectedRows = event.api.getSelectedRows();
      const ranges = event.api.getCellRanges();
      setSelectedRange(ranges || []);
      props.onSelectionChange?.(ranges || []);
    },
    onColumnMoved: () => {
      const newFields = [...fields()];
      const columnOrder = columnApi()?.getColumnOrder() || [];
      const reorderedFields = columnOrder.map(colId => 
        newFields.find(field => field.id === colId)
      ).filter(Boolean) as Field[];
      setFields(reorderedFields);
      props.onFieldsChange?.(reorderedFields);
      props.onColumnReorder?.(columnOrder);
    },
  };

  // 添加新字段
  const addField = () => {
    if (newField().name && newField().type) {
      const field: Field = {
        id: `field_${Date.now()}`,
        name: newField().name!,
        type: newField().type!,
        options: newField().options,
        formula: newField().formula,
        width: 120,
        editable: newField().editable !== false,
        sortable: newField().sortable !== false,
        filterable: newField().filterable !== false,
        required: newField().required,
        defaultValue: newField().defaultValue,
        validation: newField().validation,
      };

      const newFields = [...fields(), field];
      setFields(newFields);
      props.onFieldsChange?.(newFields);
      setNewField({});
      setShowFieldManager(false);

      if (gridApi()) {
        gridApi()!.setColumnDefs(createColumnDefs());
      }
    }
  };

  // 删除字段
  const removeField = (fieldId: string) => {
    const newFields = fields().filter(field => field.id !== fieldId);
    setFields(newFields);
    props.onFieldsChange?.(newFields);

    if (gridApi()) {
      gridApi()!.setColumnDefs(createColumnDefs());
    }
  };

  // 添加新行
  const addRow = () => {
    const newRow: TableRow = { id: Date.now() };
    fields().forEach(field => {
      if (field.id !== 'id') {
        newRow[field.id] = field.defaultValue || '';
      }
    });
    
    const newData = [...data(), newRow];
    setData(newData);
    props.onDataChange?.(newData);
    props.onRowAdd?.(newRow);
  };

  // 删除选中行
  const deleteSelectedRows = () => {
    if (selectedRange().length > 0) {
      const selectedIds = selectedRange().map(range => 
        data()[range.startRow]?.id
      ).filter(Boolean);
      
      const newData = data().filter(row => !selectedIds.includes(row.id));
      setData(newData);
      props.onDataChange?.(newData);
      props.onRowDelete?.(selectedIds);
      setSelectedRange([]);
    }
  };

  // 复制到剪贴板
  const copyToClipboard = () => {
    if (gridApi() && config().enableCopyPaste) {
      gridApi()!.copySelectedRowsToClipboard();
    }
  };

  // 从剪贴板粘贴
  const pasteFromClipboard = () => {
    if (gridApi() && config().enableCopyPaste) {
      gridApi()!.pasteFromClipboard();
    }
  };

  // 导出数据
  const exportData = (format: 'csv' | 'excel' = 'csv') => {
    if (gridApi() && config().enableExcelExport) {
      const config: ExportConfig = {
        format,
        fileName: `table_data_${new Date().toISOString().split('T')[0]}`,
        includeHeaders: true,
        includeSelection: false
      };
      
      if (format === 'csv') {
        gridApi()!.exportDataAsCsv(config);
      } else {
        gridApi()!.exportDataAsExcel(config);
      }
    }
  };

  return (
    <div class="data-table-container">
      {/* 工具栏 */}
      <div class="toolbar">
        <div class="toolbar-left">
          <button class="btn btn-primary btn-sm" onClick={addRow}>
            添加行
          </button>
          <button 
            class="btn btn-error btn-sm" 
            onClick={deleteSelectedRows}
            disabled={selectedRange().length === 0}
          >
            删除选中
          </button>
          <button class="btn btn-secondary btn-sm" onClick={() => setShowFieldManager(true)}>
            字段管理
          </button>
        </div>

        <div class="toolbar-right">
          <Show when={config().enableCopyPaste}>
            <button class="btn btn-outline btn-sm" onClick={copyToClipboard}>
              复制
            </button>
            <button class="btn btn-outline btn-sm" onClick={pasteFromClipboard}>
              粘贴
            </button>
          </Show>
          <Show when={config().enableExcelExport}>
            <button class="btn btn-outline btn-sm" onClick={() => exportData('csv')}>
              导出 CSV
            </button>
            <button class="btn btn-outline btn-sm" onClick={() => exportData('excel')}>
              导出 Excel
            </button>
          </Show>
        </div>
      </div>

      {/* 字段管理器模态框 */}
      <Show when={showFieldManager()}>
        <div class="modal modal-open">
          <div class="modal-box">
            <h3 class="font-bold text-lg">字段管理</h3>
            
            <div class="form-control w-full mt-4">
              <label class="label">
                <span class="label-text">字段名称</span>
              </label>
              <input 
                type="text" 
                class="input input-bordered" 
                value={newField().name || ''}
                onChange={(e) => setNewField({ ...newField(), name: e.target.value })}
                placeholder="输入字段名称"
              />
            </div>

            <div class="form-control w-full mt-2">
              <label class="label">
                <span class="label-text">字段类型</span>
              </label>
              <select 
                class="select select-bordered"
                value={newField().type || ''}
                onChange={(e) => setNewField({ ...newField(), type: e.target.value as FieldType })}
              >
                <option value="">选择类型</option>
                <option value="text">文本</option>
                <option value="number">数字</option>
                <option value="date">日期</option>
                <option value="select">选项</option>
                <option value="formula">公式</option>
              </select>
            </div>

            <Show when={newField().type === 'select'}>
              <div class="form-control w-full mt-2">
                <label class="label">
                  <span class="label-text">选项（用逗号分隔）</span>
                </label>
                <input 
                  type="text" 
                  class="input input-bordered" 
                  value={newField().options?.join(', ') || ''}
                  onChange={(e) => setNewField({ 
                    ...newField(), 
                    options: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="选项1, 选项2, 选项3"
                />
              </div>
            </Show>

            <Show when={newField().type === 'formula'}>
              <div class="form-control w-full mt-2">
                <label class="label">
                  <span class="label-text">公式</span>
                </label>
                <input 
                  type="text" 
                  class="input input-bordered" 
                  value={newField().formula || ''}
                  onChange={(e) => setNewField({ ...newField(), formula: e.target.value })}
                  placeholder="例如：value * 1.1"
                />
              </div>
            </Show>

            <div class="form-control w-full mt-2">
              <label class="label cursor-pointer">
                <span class="label-text">可编辑</span>
                <input 
                  type="checkbox" 
                  class="checkbox"
                  checked={newField().editable !== false}
                  onChange={(e) => setNewField({ ...newField(), editable: e.target.checked })}
                />
              </label>
            </div>

            <div class="form-control w-full mt-2">
              <label class="label cursor-pointer">
                <span class="label-text">必填</span>
                <input 
                  type="checkbox" 
                  class="checkbox"
                  checked={newField().required || false}
                  onChange={(e) => setNewField({ ...newField(), required: e.target.checked })}
                />
              </label>
            </div>

            <div class="modal-action">
              <button class="btn btn-primary" onClick={addField}>添加字段</button>
              <button class="btn" onClick={() => setShowFieldManager(false)}>取消</button>
            </div>
          </div>
        </div>
      </Show>

      {/* 字段列表 */}
      <div class="fields-panel">
        <h4>字段列表</h4>
        <div class="fields-list">
          <For each={fields()}>
            {(field) => (
              <div class="field-item">
                <span class="field-name">{field.name}</span>
                <span class="field-type">{field.type}</span>
                <button 
                  class="btn btn-xs btn-error"
                  onClick={() => removeField(field.id)}
                >
                  删除
                </button>
              </div>
            )}
          </For>
        </div>
      </div>

      {/* 数据表格 */}
      <div class={`ag-grid-container ag-theme-material`} style='height: 300px'>
        <Show when={isLoading()}>
          <div class="loading-overlay">
            <div class="loading-spinner"></div>
            <span>加载中...</span>
          </div>
        </Show>
        <AgGridSolid gridOptions={gridOptions} />
      </div>

      {/* 状态栏 */}
      <div class="status-bar">
        <span>总行数: {data().length}</span>
        <span>选中: {selectedRange().length}</span>
        <span>字段数: {fields().length}</span>
      </div>
    </div>
  );
};

export default DataTable;
