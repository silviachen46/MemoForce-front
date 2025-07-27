import { useState } from 'react';
import { storage } from '../utils/storage';
import type { CardSet } from '../App';

interface DataBackupProps {
  onImport: (cardSets: CardSet[]) => void;
}

const DataBackup = ({ onImport }: DataBackupProps) => {
  const [message, setMessage] = useState<string>('');

  const exportData = () => {
    try {
      const cardSets = storage.loadCardSets();
      const currentSet = storage.loadCurrentSet();
      const apiKey = storage.loadApiKey();

      const exportData = {
        cardSets,
        currentSet,
        apiKey,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `memoforce-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      setMessage('✅ 数据导出成功！文件已下载到您的下载文件夹。');
    } catch (error) {
      setMessage(`❌ 导出失败：${error}`);
    }
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importData = JSON.parse(content);

        // 验证数据格式
        if (!importData.cardSets || !Array.isArray(importData.cardSets)) {
          throw new Error('无效的数据格式：缺少卡片集合');
        }

        // 转换日期
        const cardSets = importData.cardSets.map((set: any) => ({
          ...set,
          createdAt: new Date(set.createdAt)
        }));

        // 保存数据
        storage.saveCardSets(cardSets);
        
        if (importData.currentSet) {
          const currentSet = {
            ...importData.currentSet,
            createdAt: new Date(importData.currentSet.createdAt)
          };
          storage.saveCurrentSet(currentSet);
        }

        if (importData.apiKey) {
          storage.saveApiKey(importData.apiKey);
        }

        // 通知父组件更新状态
        onImport(cardSets);

        setMessage('✅ 数据导入成功！页面将自动刷新以显示导入的数据。');
        
        // 刷新页面
        setTimeout(() => {
          window.location.reload();
        }, 1000);

      } catch (error) {
        setMessage(`❌ 导入失败：${error}`);
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (window.confirm('⚠️ 确定要清除所有数据吗？此操作不可撤销！')) {
      try {
        storage.clearAll();
        setMessage('✅ 所有数据已清除！页面将自动刷新。');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        setMessage(`❌ 清除失败：${error}`);
      }
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', margin: '20px' }}>
      <h3>数据备份与恢复</h3>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={exportData}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          📤 导出数据
        </button>
        
        <label style={{ 
          padding: '10px 20px',
          marginRight: '10px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'inline-block'
        }}>
          📥 导入数据
          <input
            type="file"
            accept=".json"
            onChange={importData}
            style={{ display: 'none' }}
          />
        </label>
        
        <button 
          onClick={clearAllData}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🗑️ 清除所有数据
        </button>
      </div>
      
      {message && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: 'white', 
          borderRadius: '4px',
          border: '1px solid #dee2e6'
        }}>
          {message}
        </div>
      )}
      
      <div style={{ marginTop: '15px', fontSize: '14px', color: '#6c757d' }}>
        <p><strong>说明：</strong></p>
        <ul>
          <li>导出数据：将您的所有卡片集合、当前设置和API密钥保存为JSON文件</li>
          <li>导入数据：从之前导出的JSON文件恢复您的数据</li>
          <li>清除数据：删除所有本地存储的数据（不可撤销）</li>
        </ul>
      </div>
    </div>
  );
};

export default DataBackup; 