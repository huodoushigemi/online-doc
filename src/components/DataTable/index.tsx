import { createSignal, createEffect, onMount, For, Show } from 'solid-js';
import type { Component } from 'solid-js';
import AgGridSolid from 'ag-grid-solid';
import { type ColDef, type GridOptions, type GridApi, type CellEditingStoppedEvent, type SelectionChangedEvent, themeQuartz, themeBalham, themeAlpine } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import type { DataTableProps, Field, TableRow, TableTheme, SelectionRange,TableConfig,ExportConfig } from './types';
export * from './types'
import './DataTable.scss';
import { createMutable } from 'solid-js/store';
import { defineHeaderRenderer } from './fields/_utils';
import { Popover } from '../Popover';
import { Menu } from '../Menu';

// 自动导入 fields 目录下所有 *Field.tsx
const modules = import.meta.glob('./fields/*Field.tsx', { eager: true });
const fieldTypeMap: Record<string, any> = {};
for (const path in modules) {
  // 文件名如 ./fields/TextField.tsx => text
  const match = path.match(/\.\/fields\/(\w+)Field\.tsx$/i);
  if (match) {
    const type = match[1].toLowerCase();
    fieldTypeMap[type] = modules[path];
  }
}

const DataTable: Component<DataTableProps> = (props) => {
  const [gridApi, setGridApi] = createSignal<GridApi | null>(null);
  const [columnApi, setColumnApi] = createSignal<ColumnApi | null>(null);
  const [data, setData] = createSignal<TableRow[]>(createMutable(props.data || []));
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

  const actionCol: ColDef = {
    width: 40,
    resizable: false,
    headerClass: 'p-0!',
    headerComponent: defineHeaderRenderer(props => {
      return <Popover
        trigger='click'
        portal={document.body}
        placement='bottom-start'
        reference={<div class='flex-1 flex justify-center items-center self-stretch text-[1.2em]'><ILucideCirclePlus /></div>}
        floating={() => <Menu items={[
          ...Object.values(modules).sort((a, b) => (a.field.sort || 0) - (b.field.sort || 0)).map(e => ({
            label: e.field.name,
            icon: e.field.icon,
            cb: () => {
              // 添加新字段
            }
          }))
        ]} />}
      />
    })
  }

  // 创建列定义
  const createColumnDefs = (): ColDef[] => {
    const arr = fields().map(field => {
      const colDef: ColDef = {
        field: field.id,
        headerName: field.name,
        width: field.width,
        editable: field.editable !== false && config().enableEditing,
        sortable: field.sortable !== false && config().enableSorting,
        filter: field.filterable !== false && config().enableFiltering,
        resizable: config().enableColumnResize,
        draggable: config().enableColumnReorder,
        // cellValidator: getCellValidator(field),
        ...fieldTypeMap[field.type]?.colDef?.(field)
      };

      return colDef;
    });

    arr.push(actionCol)

    return arr
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
      const newData = data();
      const rowIndex = event.rowIndex!;
      if (newData[rowIndex]) {
        const oldValue = newData[rowIndex][event.column.getColId()];
        newData[rowIndex] = { ...newData[rowIndex], [event.column.getColId()]: event.newValue };
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
        ...newField() as any
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
