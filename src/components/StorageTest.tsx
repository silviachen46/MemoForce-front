import { useState } from 'react';
import { storage } from '../utils/storage';
import type { CardSet } from '../App';

const StorageTest = () => {
  const [testResult, setTestResult] = useState<string>('');

  const runStorageTest = () => {
    try {
      // 测试数据
      const testSet: CardSet = {
        id: 'test-123',
        name: '测试集合',
        cards: [
          {
            id: 'card-1',
            question: '测试问题1',
            answer: '测试答案1',
            reviewedCount: 0,
            masteredCount: 0,
            isMastered: false
          }
        ],
        createdAt: new Date(),
        reviewMode: 'normal'
      };

      // 测试保存
      storage.saveCardSets([testSet]);
      storage.saveCurrentSet(testSet);
      storage.saveApiKey('test-api-key');

      // 测试加载
      const loadedSets = storage.loadCardSets();
      const loadedCurrentSet = storage.loadCurrentSet();
      const loadedApiKey = storage.loadApiKey();

      // 验证结果
      const isSuccess = 
        loadedSets.length === 1 &&
        loadedSets[0].name === '测试集合' &&
        loadedCurrentSet?.name === '测试集合' &&
        loadedApiKey === 'test-api-key';

      if (isSuccess) {
        setTestResult('✅ 本地存储测试成功！数据可以正确保存和加载。');
      } else {
        setTestResult('❌ 本地存储测试失败！数据没有正确保存或加载。');
      }

      // 清理测试数据
      storage.clearAll();

    } catch (error) {
      setTestResult(`❌ 本地存储测试出错：${error}`);
    }
  };

  const checkStorageStatus = () => {
    const isAvailable = storage.isAvailable();
    const cardSets = storage.loadCardSets();
    const currentSet = storage.loadCurrentSet();
    const apiKey = storage.loadApiKey();

    setTestResult(`
📊 存储状态检查：
- localStorage 可用: ${isAvailable ? '✅' : '❌'}
- 卡片集合数量: ${cardSets.length}
- 当前集合: ${currentSet ? currentSet.name : '无'}
- API密钥: ${apiKey ? '已保存' : '未保存'}
    `);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', margin: '20px' }}>
      <h3>本地存储测试</h3>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runStorageTest}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          运行存储测试
        </button>
        <button 
          onClick={checkStorageStatus}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          检查存储状态
        </button>
      </div>
      {testResult && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: 'white', 
          borderRadius: '4px',
          whiteSpace: 'pre-line',
          fontFamily: 'monospace'
        }}>
          {testResult}
        </div>
      )}
    </div>
  );
};

export default StorageTest; 