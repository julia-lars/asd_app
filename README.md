# asd_app

asd_app/
├── frontend/                    # 前端项目
│   ├── public/                  # 静态资源
│   ├── src/                     # 源代码
│   │   ├── components/          # 可复用组件
│   │   │   ├── common/          # 通用组件
│   │   │   ├── ai/              # AI相关组件
│   │   │   ├── social/          # 社交功能组件
│   │   │   ├── doctor/          # 医生相关组件
│   │   │   └── info/            # 信息页面组件
│   │   ├── pages/               # 页面组件
│   │   │   ├── Home/            # 首页
│   │   │   ├── AiChat/          # AI对话页面
│   │   │   ├── Social/          # 社交平台页面
│   │   │   ├── Doctor/          # 医生联系页面
│   │   │   └── InfoCenter/      # 信息中心页面
│   │   ├── services/            # 服务层
│   │   │   ├── api.js           # API调用
│   │   │   ├── firebase.js      # Firebase配置
│   │   │   └── ai.js            # AI服务
│   │   ├── hooks/               # 自定义Hooks
│   │   ├── utils/               # 工具函数
│   │   ├── contexts/            # 全局上下文
│   │   ├── App.jsx              # 应用主组件
│   │   ├── main.jsx             # 应用入口
│   │   └── routes.jsx           # 路由配置
│   ├── package.json             # 前端依赖
│   └── vite.config.js           # Vite配置
├── backend/                     # 后端项目
│   ├── src/                     # 源代码
│   │   ├── controllers/         # 控制器
│   │   │   ├── authController.js    # 认证控制器
│   │   │   ├── socialController.js  # 社交控制器
│   │   │   ├── doctorController.js  # 医生控制器
│   │   │   └── infoController.js    # 信息控制器
│   │   ├── services/            # 服务层
│   │   │   ├── aiService.js     # AI服务
│   │   │   ├── firebaseService.js   # Firebase服务
│   │   │   └── ragService.js    # RAG服务
│   │   ├── routes/              # 路由
│   │   ├── middleware/          # 中间件
│   │   ├── config/              # 配置
│   │   └── index.js             # 后端入口
│   ├── package.json             # 后端依赖
│   └── .env                     # 环境变量
└── README.md                    # 项目说明