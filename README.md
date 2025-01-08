# 📚 WeRead Enhancement

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Chrome Extension](https://img.shields.io/badge/Chrome_Extension-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://chrome.google.com/webstore)

一个为微信读书网页版提供增强功能的 Chrome 扩展，让阅读体验更加舒适。

[功能特性](#功能特性) •
[安装说明](#安装说明) •
[使用方法](#使用方法) •
[开发指南](#开发) •
[许可证](#许可证)

</div>

## ✨ 功能特性

### 🎨 自定义背景色

- 🔄 支持开启/关闭背景色自定义功能
- 🎯 使用颜色选择器自定义阅读背景色
- 🔙 无缝切换回原始背景色

### 🎯 注意力助手

- 🔄 可拖动的透明遮罩层，帮助集中注意力
- ⚙️ 支持自定义：
  - 📏 高度（5-500px）
  - 📐 宽度（400-1200px）
  - 🎨 颜色
- 💾 位置记忆功能
- 🔄 一键重置位置

## 📥 安装说明

### 开发环境

1. 克隆仓库

```bash
git clone [repository-url]
cd wxread-plugin
```

2. 安装依赖

```bash
npm install
```

3. 构建项目

```bash
npm run build
```

### 🌐 在 Chrome 中安装

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目的 `dist` 目录

## 📖 使用方法

1. 访问 [微信读书网页版](https://weread.qq.com/)
2. 点击浏览器工具栏中的扩展图标 <img src="public/icon48.png" width="16" height="16" />
3. 在弹出的面板中：
   - 🎨 使用开关控制背景色功能
   - 🎯 使用颜色选择器调整背景色
   - ⚡ 开启/关闭注意力助手
   - 📐 调整注意力助手的大小和颜色
   - 🔄 拖动注意力助手到合适位置

## 🛠️ 开发

### 技术栈

- [TypeScript](https://www.typescriptlang.org/) - 类型安全的 JavaScript 超集
- [React](https://reactjs.org/) - 用户界面构建库
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [shadcn/ui](https://ui.shadcn.com/) - 精美的 UI 组件库

### 项目结构

```
src/
├── content/        # 内容脚本 - 注入到网页的代码
├── popup/          # 弹出面板 - 扩展的用户界面
├── components/     # 共享组件 - 可复用的 UI 组件
└── lib/           # 工具函数 - 通用工具和辅助函数
```

### 开发命令

```bash
# 开发模式 - 支持热重载
npm run dev

# 构建项目 - 生成生产版本
npm run build

# 类型检查 - 确保代码类型安全
npm run typecheck
```

## ⚠️ 注意事项

- 🌐 扩展仅在微信读书网页版（weread.qq.com）中生效
- 💾 所有设置会自动保存到浏览器存储中
- 🎯 注意力助手的位置会被记住，可以通过重置按钮恢复默认位置

## 📄 许可证

[MIT](LICENSE) © 2024
