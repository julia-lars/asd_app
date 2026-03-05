# 孤独症支持平台 (asd_app)

## 项目概述

孤独症支持平台是一个为孤独症患者及其家庭提供支持和资源的综合性应用。该平台旨在通过提供信息、社区互动和专业支持，帮助用户更好地了解和应对孤独症。

## 项目结构

```
asd_app/
├── frontend/                    # 前端项目
│   ├── public/                  # 静态资源
│   │   ├── background.png       # 背景图片
│   │   ├── bulletin_board_1.jpg # 公告板图片1
│   │   ├── bulletin_board_2.jpg # 公告板图片2
│   │   ├── bulletin_board_3.jpg # 公告板图片3
│   │   └── vite.svg             # Vite默认图标
│   ├── src/                     # 源代码
│   │   ├── components/          # 可复用组件
│   │   │   └── common/          # 通用组件
│   │   │       ├── BottomNav.jsx    # 底部导航栏
│   │   │       └── ImageCarousel.jsx # 图片轮播组件
│   │   ├── contexts/            # 全局上下文
│   │   │   └── AuthContext.jsx  # 认证上下文
│   │   ├── pages/               # 页面组件
│   │   │   ├── AiChat/          # AI对话页面
│   │   │   │   └── AiChat.jsx   # AI对话组件
│   │   │   ├── Auth/            # 认证相关页面
│   │   │   │   ├── Login.jsx    # 登录页面
│   │   │   │   └── Register.jsx # 注册页面
│   │   │   ├── Help/            # 帮助中心页面
│   │   │   │   └── Help.jsx     # 帮助中心组件
│   │   │   ├── Profile/         # 个人资料页面
│   │   │   │   └── Profile.jsx  # 个人资料组件
│   │   │   └── Social/          # 社交平台页面
│   │   │       └── Social.jsx   # 社交平台组件
│   │   ├── services/            # 服务层
│   │   │   └── firebase.js      # Firebase配置
│   │   ├── App.jsx              # 应用主组件
│   │   ├── main.jsx             # 应用入口
│   │   ├── main.ts              # TypeScript入口
│   │   └── style.css            # 全局样式
│   ├── .gitignore               # Git忽略文件
│   ├── index.html               # HTML模板
│   ├── package-lock.json        # 依赖锁定文件
│   ├── package.json             # 前端依赖
│   ├── postcss.config.js        # PostCSS配置
│   ├── tailwind.config.js       # Tailwind CSS配置
│   └── tsconfig.json            # TypeScript配置
└── README.md                    # 项目说明
```

## 功能模块

### 1. 认证系统
- **登录功能**：用户可以通过邮箱和密码登录
- **注册功能**：新用户可以创建账号
- **身份验证**：使用Firebase Authentication进行身份验证

### 2. 社交平台
- **动态发布**：用户可以发布文本动态
- **动态列表**：展示所有用户的动态，按时间倒序排列
- **图片展示**：顶部展示公告板图片

### 3. AI对话
- **智能问答**：用户可以与AI进行关于孤独症的问答
- **个性化建议**：根据用户需求提供个性化的建议和支持

### 4. 帮助中心
- **常见问题**：提供孤独症相关的常见问题解答
- **资源链接**：提供专业的孤独症相关资源和支持机构的链接
- **联系我们**：提供联系方式，方便用户咨询

### 5. 个人资料
- **用户信息**：展示用户的基本信息
- **个人设置**：允许用户修改个人资料

## 技术栈

### 前端技术
- **React 19.2.4**：用于构建用户界面的JavaScript库
- **React Router 7.13.1**：用于页面路由管理
- **Firebase 12.10.0**：用于身份验证和数据存储
- **Tailwind CSS 4.2.1**：用于快速构建响应式界面
- **TypeScript**：提供类型安全
- **Vite**：现代前端构建工具

### 后端技术
- 项目目前主要使用Firebase作为后端服务，包括：
  - Firebase Authentication：用户认证
  - Firestore：数据库存储

## 安装和运行

### 前置要求
- Node.js 16.0或更高版本
- npm 7.0或更高版本
- Firebase项目配置（需要在services/firebase.js中配置）

### 安装步骤

1. 克隆项目
```bash
git clone <repository-url>
cd asd_app/frontend
```

2. 安装依赖
```bash
npm install
```

3. 配置Firebase
- 在Firebase控制台创建项目
- 启用Authentication和Firestore服务
- 将Firebase配置信息添加到`src/services/firebase.js`文件中

4. 运行开发服务器
```bash
npm run dev
```

5. 构建生产版本
```bash
npm run build
```

## 图片显示功能使用说明

### 更换图片
1. 打开`public`文件夹
2. 替换现有的`bulletin_board_1.jpg`文件
3. 保持文件名不变，直接替换图片内容即可

### 调整图片显示设置
1. 打开`src/pages/Social/Social.jsx`文件
2. 修改图片相关的代码：
   - `src`：修改图片路径
   - `alt`：修改图片描述
   - `className`：调整图片样式

### 示例配置
```jsx
<img 
  src="/bulletin_board_1.jpg" 
  alt="公告板图片" 
  className="max-w-full max-h-full object-contain"
  onError={(e) => {
    console.error('图片加载失败:', e.target.src);
    e.target.src = 'https://via.placeholder.com/800x300?text=图片加载失败';
  }}
/>
```

## 功能使用指南

### 1. 登录/注册
- 访问`/login`页面进行登录
- 访问`/register`页面进行注册
- 登录后会自动跳转到社交平台页面

### 2. 社交平台
- 在文本框中输入内容，点击"发布"按钮发布动态
- 浏览其他用户发布的动态
- 查看顶部的图片

### 3. AI对话
- 访问`/ai-chat`页面
- 在输入框中输入关于孤独症的问题
- 等待AI的回复

### 4. 帮助中心
- 访问`/help`页面
- 查看常见问题、资源链接和联系信息

### 5. 个人资料
- 访问`/profile`页面
- 查看和修改个人信息

## 项目亮点

1. **响应式设计**：适配不同屏幕尺寸
2. **图片显示**：提供视觉吸引力强的图片展示
3. **Firebase集成**：使用Firebase提供的服务，简化后端开发
4. **模块化结构**：代码组织清晰，易于维护和扩展
5. **AI集成**：提供智能问答功能，增强用户体验

## 未来计划

1. 总体 网页风格设计

2. 社交平台
- 在文本框中输入内容，点击"发布"按钮发布动态;添加图片和特定表情
- 增强社区互动功能，如评论和点赞
- 轮播内容：孤独症相关节日、大事件

3. AI对话
- 接入现有知识库，进行rag检索后回答问题
- 加入专有prompt，比如让ai语气更舒缓更友好，同理心更强等内容
- 增加更多AI功能，如情绪识别和行为分析

4. 帮助中心
- 相关专家、医生资料卡片
- 知识图谱相关
- 可能提供的志愿服务
- 查看常见问题、资源链接和联系信息

5. 个人资料
- 可以建立成长等级，记录对社区的贡献之类？
- 加入城市、电话、患者情况等信息，方便交流
---

© 2026 孤独症支持平台