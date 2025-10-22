# Tastywhut - 武汉理工校园美食推荐小程序

> 一个基于微信小程序的校园周边美食推荐与评价平台

## 📖 项目简介

Tastywhut 是一个专为武汉理工大学师生打造的美食推荐小程序，提供校内外美食店铺的浏览、评价、收藏等功能。用户可以查看店铺详情、发表评论、管理个人收藏，帮助校园用户更好地发现和分享身边的美食。

## 🎯 主要功能

### 1. 店铺浏览与查询
- **分类浏览**：支持按校内/校外/综合排名查看店铺列表
- **分页加载**：实现数据分页，提升加载性能
- **星级展示**：显示店铺平均评分（基于用户评论计算）
- **详情查询**：根据店铺ID精确查询店铺详细信息
- **店铺信息**：包含店铺名称、电话、地址、营业时间、图片等

### 2. 评论系统
- **店铺评论**：用户可对店铺进行评价和打分（1-5星）
- **评论展示**：分页显示店铺的所有用户评论
- **用户信息**：评论包含用户昵称、头像、评分等信息
- **食品评论**：支持针对具体食品的评论功能

### 3. 用户系统
- **微信登录**：基于微信OpenID的用户身份认证
- **用户信息管理**：支持修改用户昵称和头像
- **自动注册**：新用户首次登录自动创建账户
- **头像上传**：支持用户自定义头像图片

### 4. 收藏功能
- **店铺收藏**：用户可收藏喜欢的店铺
- **收藏管理**：查看和管理个人收藏列表
- **取消收藏**：支持取消已收藏的店铺

### 5. 图片管理
- **图片上传**：支持上传店铺图片和用户头像
- **图片存储**：自动生成唯一文件名并存储
- **图片访问**：提供图片URL访问接口

## 🏗️ 技术架构

### 后端技术栈
- **框架**：Flask (Python Web框架)
- **数据库**：MySQL (使用PyMySQL连接)
- **图像处理**：PIL (Python Imaging Library), OpenCV
- **数据处理**：Pandas, NumPy
- **API**：RESTful API设计

### 前端技术栈
- **平台**：微信小程序
- **渲染引擎**：Skyline渲染引擎
- **组件框架**：Glass-easel
- **页面结构**：
  - 主页 (main)：店铺列表展示
  - 食谱 (recipe)：食谱推荐
  - 个人中心 (person)：用户信息和收藏管理
  - 评价页面 (evaluate)：店铺评价

### 数据库设计
主要数据表：
- `shops`：店铺信息表
- `comments`：评论信息表
- `users`：用户信息表
- `shop_collection`：店铺收藏关联表

## 📁 项目结构

```
Tastywhut/
├── backend/                 # 后端代码
│   ├── main.py             # 程序入口
│   ├── app_def.py          # API路由定义
│   ├── factory.py          # Flask应用工厂
│   ├── database_op.py      # 数据库操作封装
│   ├── functions.py        # 工具函数
│   ├── image/              # 图片存储目录
│   │   └── avatars/        # 用户头像目录
│   ├── instance/           # 实例配置目录
│   └── static/             # 静态资源目录
│
├── frontend/               # 前端代码
│   └── miniprogram-1/      # 小程序主目录
│       ├── app.js          # 小程序入口
│       ├── app.json        # 小程序配置
│       ├── pages/          # 页面目录
│       │   ├── main/       # 主页
│       │   ├── recipe/     # 食谱页
│       │   ├── person/     # 个人中心
│       │   └── evaluate/   # 评价页
│       ├── components/     # 自定义组件
│       ├── images/         # 图片资源
│       └── utils/          # 工具函数
│
└── README.md               # 项目说明文档
```

## 🚀 快速开始

### 环境要求
- Python 3.6+
- MySQL 数据库
- 微信开发者工具

### 后端安装与运行

1. 安装依赖：
```bash
pip install flask pandas sqlalchemy pymysql pillow opencv-python numpy
```

2. 配置数据库：
   - 修改 `backend/database_op.py` 中的数据库连接信息
   - 导入数据库结构（可参考 `backend/instance/backup.sql`）

3. 配置微信小程序信息：
   - 在 `backend/app_def.py` 中配置 `appid` 和 `app_secret`

4. 启动后端服务：
```bash
cd backend
python main.py
```

服务将在 `http://127.0.0.1:8000` 启动

### 前端部署

1. 使用微信开发者工具打开 `frontend/miniprogram-1` 目录
2. 配置小程序 AppID（在 `project.config.json` 中）
3. 修改 API 请求地址（指向后端服务器）
4. 编译并预览小程序

## 📡 API 接口说明

### 店铺相关
- `GET /data/<request_page>` - 获取店铺列表（支持 incampus/outcampus/rank）
- `GET /query?id=<shop_id>` - 查询指定店铺详情
- `POST /add_shop` - 添加新店铺

### 评论相关
- `GET /data/shopcomment?id=<shop_id>` - 获取店铺评论列表
- `GET /data/food?id=<food_id>` - 获取食品评论列表
- `POST /add_comment` - 添加评论

### 用户相关
- `GET /getopenid?code=<wx_code>` - 获取用户OpenID
- `POST /updateuserinfo` - 更新用户信息

### 收藏相关
- `POST /addcollection` - 收藏店铺
- `POST /removecollection` - 取消收藏
- `POST /usercollection` - 获取用户收藏列表

### 图片相关
- `GET /getpic?filename=<name>` - 获取店铺图片
- `GET /getpic_avatar?filename=<name>` - 获取用户头像
- `POST /add_shop_image` - 上传店铺图片
- `POST /add_avatar_image` - 上传用户头像

## 🔒 安全说明

⚠️ **重要提示**：
- 代码中包含数据库密码和微信小程序密钥，仅供学习参考
- 在生产环境中，请务必将敏感信息移至环境变量或配置文件中
- 建议使用 `.gitignore` 排除包含敏感信息的配置文件

## 👥 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📄 许可

本项目仅供学习交流使用。

## 📧 联系方式

如有问题或建议，欢迎通过 GitHub Issues 联系。

---

**Tastywhut** - 让美食发现更简单 🍜
