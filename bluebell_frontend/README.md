# Bluebell 前端

基于 Vue 3、Vite、TypeScript、Vue Router 和 Pinia 的现代化版本，兼容 Node.js 24 / npm 11。

## 本地运行

```powershell
npm install
npm run dev
```

前端默认运行在 `http://localhost:5173`，开发代理会把请求转发到 `http://127.0.0.1:8081` 的 Go 服务。

## 可用命令

- `npm run dev`：启动开发服务器
- `npm run type-check`：TypeScript 类型检查
- `npm run build`：类型检查并构建生产版本
- `npm run preview`：预览生产构建

## 后端接口约定

当前 Go 项目已经实现：

- `POST /signup`
- `POST /login`
- `GET /ping`

前端还保留了原项目计划使用的帖子接口：

- `GET /api/v1/community`
- `GET /api/v1/posts2?page=1&order=time|score`
- `GET /api/v1/post/:id`
- `POST /api/v1/post`
- `POST /api/v1/vote`

这些接口尚未在当前 Go 路由中注册，因此相关页面会显示可恢复的空状态，而不会用假数据掩盖问题。

## 新功能

- 深色 / 浅色主题，偏好保存在浏览器本地
- 首页本地关键词搜索
- 帖子收藏，保存在浏览器本地
- 发帖草稿自动保存
- 清晰的请求错误和后端未实现提示
- 响应式手机布局
- 登录路由保护与登录后原路返回
