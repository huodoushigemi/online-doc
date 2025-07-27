import { createSignal } from 'solid-js';
import type { Component } from 'solid-js'
import DataTable from './index';
import type { Field, FieldType } from './index';

const DataTableDemo: Component = () => {
  const [currentTheme, setCurrentTheme] = createSignal<'grid' | 'line' | 'compact'>('grid');
  const [demoData, setDemoData] = createSignal([
    { 
      id: 1, 
      name: '产品A', 
      category: '电子产品', 
      price: 299.99, 
      stock: 150, 
      sales: 45, 
      date: '2024-01-15', 
      status: '在售' 
    },
    { 
      id: 2, 
      name: '产品B', 
      category: '服装', 
      price: 89.99, 
      stock: 200, 
      sales: 78, 
      date: '2024-01-20', 
      status: '在售' 
    },
    { 
      id: 3, 
      name: '产品C', 
      category: '家居', 
      price: 159.99, 
      stock: 80, 
      sales: 32, 
      date: '2024-01-25', 
      status: '缺货' 
    },
    { 
      id: 4, 
      name: '产品D', 
      category: '电子产品', 
      price: 599.99, 
      stock: 50, 
      sales: 12, 
      date: '2024-02-01', 
      status: '在售' 
    },
    { 
      id: 5, 
      name: '产品E', 
      category: '图书', 
      price: 29.99, 
      stock: 300, 
      sales: 120, 
      date: '2024-02-05', 
      status: '在售' 
    },
  ]);

  const [demoFields, setDemoFields] = createSignal<Field[]>([
    { id: 'id', name: 'ID', type: 'number', width: 60, editable: false },
    { id: 'name', name: '产品名称', type: 'text', width: 180, editable: true },
    { id: 'category', name: '分类', type: 'select', options: ['电子产品', '服装', '家居', '图书', '食品'], width: 120, editable: true },
    { id: 'price', name: '价格', type: 'number', width: 100, editable: true, validation: { min: 0 } },
    { id: 'stock', name: '库存', type: 'number', width: 80, editable: true, validation: { min: 0 } },
    { id: 'sales', name: '销量', type: 'number', width: 80, editable: true, validation: { min: 0 } },
    { id: 'revenue', name: '收入', type: 'formula', formula: 'price * sales', width: 100, editable: false },
    { id: 'date', name: '上架日期', type: 'date', width: 120, editable: true },
    { id: 'status', name: '状态', type: 'select', options: ['在售', '缺货', '下架', '预售'], width: 80, editable: true },
  ]);

  const handleDataChange = (data: any[]) => {
    console.log('演示 - 数据变化:', data);
    setDemoData(data);
  };

  const handleFieldsChange = (fields: Field[]) => {
    console.log('演示 - 字段变化:', fields);
    setDemoFields(fields);
  };

  return (
    <div style="padding: 20px; min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <div style="max-width: 1400px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 30px; color: white;">
          <h1 style="font-size: 32px; margin-bottom: 10px; font-weight: 300;">
            数据表格组件演示
          </h1>
          <p style="font-size: 16px; opacity: 0.9;">
            基于 SolidJS 和 AG Grid 的现代化数据表格组件
          </p>
        </div>
        
        <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
          <DataTable
            data={demoData()}
            fields={demoFields()}
            theme={currentTheme()}
            onDataChange={handleDataChange}
            onFieldsChange={handleFieldsChange}
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
              rowHeight: 45,
              headerHeight: 45,
            }}
          />
        </div>

        <div style="margin-top: 30px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <h3 style="color: #333; margin-bottom: 15px; font-size: 18px;">✨ 核心功能</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>🖱️ 双击单元格编辑</li>
              <li>📊 多种字段类型支持</li>
              <li>🔄 字段拖拽重排序</li>
              <li>📋 范围选择与复制粘贴</li>
              <li>🎨 三种主题样式</li>
              <li>📈 公式字段自动计算</li>
            </ul>
          </div>

          <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <h3 style="color: #333; margin-bottom: 15px; font-size: 18px;">🔧 高级特性</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>✅ 数据验证规则</li>
              <li>📤 Excel 导入导出</li>
              <li>🔍 排序与过滤</li>
              <li>📱 响应式设计</li>
              <li>⚡ 高性能渲染</li>
              <li>🎯 事件回调支持</li>
            </ul>
          </div>

          <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <h3 style="color: #333; margin-bottom: 15px; font-size: 18px;">🚀 使用指南</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>💡 双击任意单元格开始编辑</li>
              <li>🎛️ 拖拽列标题调整顺序</li>
              <li>📋 选择多个单元格进行复制</li>
              <li>🎨 在工具栏切换主题</li>
              <li>⚙️ 点击"字段管理"添加字段</li>
              <li>📊 查看"收入"列的公式计算</li>
            </ul>
          </div>
        </div>

        <div style="margin-top: 30px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <h3 style="color: #333; margin-bottom: 15px; font-size: 18px;">📝 技术栈</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            <span style="background: #007bff; color: white; padding: 6px 12px; border-radius: 20px; font-size: 14px;">SolidJS</span>
            <span style="background: #28a745; color: white; padding: 6px 12px; border-radius: 20px; font-size: 14px;">AG Grid</span>
            <span style="background: #ffc107; color: #333; padding: 6px 12px; border-radius: 20px; font-size: 14px;">TypeScript</span>
            <span style="background: #17a2b8; color: white; padding: 6px 12px; border-radius: 20px; font-size: 14px;">SCSS</span>
            <span style="background: #6f42c1; color: white; padding: 6px 12px; border-radius: 20px; font-size: 14px;">DaisyUI</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTableDemo; 