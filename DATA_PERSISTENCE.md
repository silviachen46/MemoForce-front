# MemoForce 数据持久化说明

## 概述

MemoForce 使用浏览器的本地存储（localStorage）来实现数据持久化，无需用户登录即可保存所有数据。

## 数据存储内容

应用会自动保存以下数据：

1. **卡片集合** (`memoforce_card_sets`)
   - 所有创建的卡片集合
   - 每个集合包含名称、创建时间和卡片列表

2. **当前集合** (`memoforce_current_set`)
   - 当前选中的卡片集合
   - 用于在页面刷新后恢复用户的选择

3. **API密钥** (`memoforce_api_key`)
   - 用户的OpenAI API密钥
   - 加密存储在本地

## 数据持久化特性

### ✅ 自动保存
- 每次数据变化时自动保存到localStorage
- 无需手动操作，数据实时同步

### ✅ 自动加载
- 页面刷新后自动恢复所有数据
- 保持用户的学习进度和设置

### ✅ 跨会话保持
- 关闭浏览器后重新打开，数据依然存在
- 数据存储在用户本地设备上

### ✅ 无需登录
- 完全本地存储，不需要账户
- 保护用户隐私，数据不会上传到服务器

## 数据备份与恢复

### 导出数据
- 点击"📤 导出数据"按钮
- 将生成包含所有数据的JSON文件
- 文件包含卡片集合、当前设置和API密钥

### 导入数据
- 点击"📥 导入数据"按钮
- 选择之前导出的JSON文件
- 自动恢复所有数据并刷新页面

### 清除数据
- 点击"🗑️ 清除所有数据"按钮
- 确认后删除所有本地存储的数据
- **此操作不可撤销**

## 故障排除

### 数据丢失问题
如果刷新页面后数据消失，请检查：

1. **浏览器设置**
   - 确保localStorage功能已启用
   - 检查是否处于隐私浏览模式（可能限制存储）

2. **存储空间**
   - 检查浏览器存储空间是否充足
   - localStorage通常有5-10MB限制

3. **浏览器兼容性**
   - 使用现代浏览器（Chrome、Firefox、Safari、Edge）
   - 避免使用过时的浏览器版本

### 测试存储功能
在应用首页可以找到"本地存储测试"工具：
- 运行存储测试验证功能是否正常
- 检查存储状态查看当前数据情况

## 技术实现

### 存储工具 (`src/utils/storage.ts`)
```typescript
// 保存卡片集合
storage.saveCardSets(cardSets: CardSet[])

// 加载卡片集合
storage.loadCardSets(): CardSet[]

// 检查存储可用性
storage.isAvailable(): boolean
```

### 自动保存机制
```typescript
// 数据变化时自动保存
useEffect(() => {
  if (!isLoading) {
    storage.saveCardSets(cardSets);
    storage.saveCurrentSet(currentSet);
    storage.saveApiKey(apiKey);
  }
}, [cardSets, currentSet, apiKey, isLoading]);
```

## 安全注意事项

1. **API密钥安全**
   - API密钥存储在本地，不会上传到服务器
   - 建议定期更换API密钥

2. **数据备份**
   - 定期导出数据作为备份
   - 重要数据建议保存多个备份文件

3. **设备安全**
   - 数据存储在本地设备上
   - 请确保设备安全，避免数据泄露

## 浏览器支持

- ✅ Chrome 4+
- ✅ Firefox 3.5+
- ✅ Safari 4+
- ✅ Edge 12+
- ❌ Internet Explorer 8及以下版本

## 数据格式

导出的JSON文件格式：
```json
{
  "cardSets": [
    {
      "id": "set-id",
      "name": "集合名称",
      "cards": [...],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "currentSet": {...},
  "apiKey": "your-api-key",
  "exportDate": "2024-01-01T00:00:00.000Z",
  "version": "1.0"
}
``` 