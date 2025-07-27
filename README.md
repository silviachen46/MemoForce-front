# MemoForce - Flashcard Learning App

MemoForce是一个现代化的记忆卡片学习应用，使用React + TypeScript构建，提供直观的用户界面和强大的学习功能。

## 功能特性

### 🎯 核心功能
- **集合管理**: 创建和管理学习集合
- **智能生成**: 基于问题自动生成学习卡片
- **交互式学习**: 卡片翻面、详细查看和编辑功能
- **进度跟踪**: 掌握度和复习次数统计
- **数据分析**: 学习进度和效果分析

### 📱 用户界面
- **响应式设计**: 适配桌面和移动设备
- **现代化UI**: 渐变色彩和流畅动画
- **直观导航**: 顶部导航栏和可展开侧边栏
- **卡片动画**: 3D翻面效果和悬停动画

## 页面结构

### 1. Home页面
- **欢迎界面**: 首次访问时的引导页面
- **卡片生成**: 输入问题和数量，生成学习卡片
- **卡片学习**: 翻面查看答案，标记掌握或复习
- **详细模式**: 查看完整卡片信息和统计数据

### 2. Analytics页面
- **总体统计**: 集合数量、卡片总数、掌握率等
- **集合分析**: 每个集合的详细学习数据
- **进度追踪**: 复习次数和掌握次数统计

### 3. Manage页面
- **集合管理**: 查看、编辑和删除集合
- **卡片预览**: 查看集合中的所有卡片
- **批量操作**: 支持批量删除和管理

## 技术栈

- **前端框架**: React 19.1.0
- **开发语言**: TypeScript
- **构建工具**: Vite
- **路由管理**: React Router DOM
- **图标库**: Lucide React
- **样式**: CSS3 (自定义样式)

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动

### 构建生产版本
```bash
npm run build
```

## 使用指南

### 创建学习集合
1. 点击左侧边栏的展开按钮
2. 点击"+"按钮创建新集合
3. 输入集合名称并确认
4. 侧边栏会自动收起，进入主页面

### 生成学习卡片
1. 在聊天框中输入你的问题或主题
2. 设置想要生成的卡片数量
3. 点击"Generate"按钮
4. 系统会模拟API调用生成卡片

### 学习卡片
1. **翻面查看**: 点击卡片进行翻面，查看答案
2. **标记掌握**: 点击"Mastered"按钮，增加掌握计数并跳转下一张
3. **详细复习**: 点击"Review"按钮，查看完整信息和统计数据
4. **编辑卡片**: 在详细模式下可以编辑问题、答案和提示

### 查看学习数据
- **Analytics页面**: 查看总体学习进度和集合统计
- **Manage页面**: 管理集合和查看详细卡片信息

## 项目结构

```
src/
├── components/          # 可复用组件
│   ├── TopNav.tsx      # 顶部导航
│   ├── Sidebar.tsx     # 侧边栏
│   └── CardDisplay.tsx # 卡片展示组件
├── pages/              # 页面组件
│   ├── Home.tsx        # 主页
│   ├── Analytics.tsx   # 数据分析页
│   └── Manage.tsx      # 管理页面
├── App.tsx             # 主应用组件
├── main.tsx            # 应用入口
└── App.css             # 全局样式
```

## 数据模型

### Card接口
```typescript
interface Card {
  id: string;
  question: string;
  answer: string;
  hint?: string;
  reviewedCount: number;
  masteredCount: number;
  isMastered: boolean;
}
```

### CardSet接口
```typescript
interface CardSet {
  id: string;
  name: string;
  cards: Card[];
  createdAt: Date;
}
```

## 开发说明

### 状态管理
- 使用React Hooks进行状态管理
- 主要状态包括：当前页面、侧边栏状态、卡片集合、当前选中集合

### 组件通信
- 通过props传递数据和回调函数
- 使用TypeScript确保类型安全

### 样式设计
- 采用CSS3现代特性
- 使用CSS Grid和Flexbox布局
- 响应式设计支持移动端

## 未来改进

- [ ] 添加本地存储功能
- [ ] 集成真实的AI API
- [ ] 添加用户认证系统
- [ ] 支持卡片导入/导出
- [ ] 添加学习提醒功能
- [ ] 支持多媒体内容（图片、音频）

## 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

## 许可证

MIT License
# MemoForce-front
