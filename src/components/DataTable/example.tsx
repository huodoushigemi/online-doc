import type { Component } from 'solid-js';
import DataTable from './index';
import type { Field } from './types';

const DataTableExample: Component = () => {
  // 示例字段配置
  const exampleFields: Field[] = [
    { id: 'id', name: 'ID', type: 'number', width: 80, editable: false },
    { id: 'name', name: '项目名称', type: 'text', width: 200, editable: true },
    { id: 'budget', name: '预算', type: 'number', width: 120, editable: true },
    { id: 'spent', name: '已花费', type: 'number', width: 120, editable: true },
    { id: 'remaining', name: '剩余', type: 'formula', formula: 'budget - spent', width: 120, editable: false },
    { id: 'startDate', name: '开始日期', type: 'date', width: 130, editable: true },
    { id: 'status', name: '状态', type: 'select', options: ['规划中', '进行中', '已完成', '已暂停'], width: 100, editable: true },
    { id: 'progress', name: '进度', type: 'number', width: 100, editable: true },
  ];

  // 示例数据
  const exampleData = [
    { 
      id: 1, 
      name: '网站重构项目', 
      budget: 50000, 
      spent: 32000, 
      startDate: '2024-01-15', 
      status: '进行中', 
      progress: 64 
    },
    { 
      id: 2, 
      name: '移动应用开发', 
      budget: 80000, 
      spent: 45000, 
      startDate: '2024-02-01', 
      status: '进行中', 
      progress: 56 
    },
    { 
      id: 3, 
      name: '数据库迁移', 
      budget: 25000, 
      spent: 25000, 
      startDate: '2024-01-10', 
      status: '已完成', 
      progress: 100 
    },
    { 
      id: 4, 
      name: '安全审计', 
      budget: 15000, 
      spent: 8000, 
      startDate: '2024-03-01', 
      status: '规划中', 
      progress: 0 
    },
  ];

  const handleDataChange = (newData: any[]) => {
    console.log('数据已更新:', newData);
  };

  const handleFieldsChange = (newFields: Field[]) => {
    console.log('字段已更新:', newFields);
  };

  return (
    <div style="padding: 20px; height: 100vh; background: #f5f5f5;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h1 style="margin-bottom: 20px; color: #333; font-size: 24px;">
          数据表格组件示例
        </h1>
        
        <div style="background: white; border-radius: 8px; overflow: hidden; height: calc(100vh - 100px);">
          <DataTable
            data={exampleData}
            fields={exampleFields}
            theme="grid"
            onDataChange={handleDataChange}
            onFieldsChange={handleFieldsChange}
          />
        </div>

        <div style="margin-top: 20px; padding: 16px; background: white; border-radius: 8px;">
          <h3 style="margin-bottom: 12px; color: #333;">功能说明</h3>
          <ul style="color: #666; line-height: 1.6;">
            <li><strong>表格编辑：</strong>双击单元格即可编辑内容</li>
            <li><strong>字段管理：</strong>点击"字段管理"按钮可以添加、删除字段</li>
            <li><strong>字段拖拽：</strong>可以拖拽列标题调整字段顺序</li>
            <li><strong>范围选区：</strong>支持选择多个单元格进行复制粘贴</li>
            <li><strong>Excel 交互：</strong>支持与 Excel 的复制粘贴操作</li>
            <li><strong>主题切换：</strong>可以选择网格、线框、紧凑三种主题</li>
            <li><strong>公式字段：</strong>"剩余"字段使用公式计算：预算 - 已花费</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DataTableExample; 