import { type Component, createSignal } from 'solid-js';
import DataTable, { type Field, type FieldType } from './index';
import { createMutable } from 'solid-js/store';

const DataTableTest: Component = () => {
  const [testData, setTestData] = createSignal([
    { id: 1, name: '测试项目1', price: 100, quantity: 5, date: '2024-01-15', status: '进行中' },
    { id: 2, name: '测试项目2', price: 200, quantity: 3, date: '2024-01-20', status: '已完成' },
    { id: 3, name: '测试项目3', price: 150, quantity: 8, date: '2024-01-25', status: '暂停' },
  ]);

  const testFields = createMutable<Field[]>([
    { id: 'id', name: 'ID', type: 'number', width: 80, editable: false },
    { id: 'name', name: '项目名称', type: 'text', width: 200, editable: true },
    { id: 'price', name: '单价', type: 'number', width: 100, editable: true, validation: { min: 0 } },
    { id: 'quantity', name: '数量', type: 'number', width: 100, editable: true, validation: { min: 1 } },
    { id: 'total', name: '总价', type: 'formula', formula: 'price * quantity', width: 120, editable: false },
    { id: 'date', name: '日期', type: 'date', width: 130, editable: true },
    { id: 'status', name: '状态', type: 'select', options: ['进行中', '已完成', '暂停', '取消'], width: 100, editable: true },
  ])

  const handleDataChange = (data: any[]) => {
    console.log('测试 - 数据变化:', data);
    setTestData(data);
  };

  const handleCellEdit = (rowIndex: number, colId: string, oldValue: any, newValue: any) => {
    console.log('测试 - 单元格编辑:', { rowIndex, colId, oldValue, newValue });
  };

  const handleSelectionChange = (selection: any[]) => {
    console.log('测试 - 选择变化:', selection);
  };

  return (
    <div style="padding: 20px; height: 100vh; background: #f5f5f5;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h1 style="margin-bottom: 20px; color: #333; font-size: 24px;">
          数据表格组件测试
        </h1>
        
        <div style="background: white; border-radius: 8px; overflow: hidden; height: calc(100vh - 100px);">
          <DataTable
            data={testData()}
            fields={testFields}
            theme="grid"
            onDataChange={handleDataChange}
            onFieldsChange={fields => testFields.splice(0, Infinity, ...fields)}
            onCellEdit={handleCellEdit}
            onSelectionChange={handleSelectionChange}
            config={{
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
            }}
          />
        </div>

        <div style="margin-top: 20px; padding: 16px; background: white; border-radius: 8px;">
          <h3 style="margin-bottom: 12px; color: #333;">测试说明</h3>
          <ul style="color: #666; line-height: 1.6;">
            <li><strong>双击编辑:</strong> 双击任意单元格进行编辑测试</li>
            <li><strong>字段拖拽:</strong> 拖拽列标题调整字段顺序</li>
            <li><strong>范围选择:</strong> 选择多个单元格进行复制粘贴测试</li>
            <li><strong>公式计算:</strong> "总价"字段自动计算：单价 × 数量</li>
            <li><strong>数据验证:</strong> 单价和数量字段有最小值验证</li>
            <li><strong>主题切换:</strong> 在工具栏切换不同主题</li>
            <li><strong>字段管理:</strong> 点击"字段管理"添加新字段</li>
            <li><strong>导出功能:</strong> 测试 CSV 和 Excel 导出</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DataTableTest; 