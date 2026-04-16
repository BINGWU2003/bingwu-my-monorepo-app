# Bingwu Monorepo

基于 `pnpm workspace + turbo` 的全栈 Monorepo，包含 Web 管理端、Mobile H5 和 Express 服务端，并通过 workspace 包共享 HTTP 能力、类型契约和校验规则。

## 目录结构

```text
bingwu-my-monorepo-app/
├── apps/
│   ├── web/                  # Web 管理端（Vue3 + Element Plus + Vite）
│   ├── mobile/               # 移动端 H5（Vue3 + Vant + Vite）
│   └── server/               # 服务端（Express + Prisma + MySQL）
├── packages/
│   ├── api-client/           # 公共 API 接口层（通过 HttpAdapter 注入传输实现）
│   ├── shared/               # 运行时共享：HTTP 客户端、状态码、通用类型
│   ├── shared-schemas/       # Zod Schema + API 契约类型（前后端共用）
│   └── components/           # 公共 Vue 组件
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

## 架构约定

1. API 路径约定：前端统一请求 `/api/*`
2. 开发代理约定：使用 `VITE_API_PROXY_TARGET` 指向本地服务端（默认 `http://localhost:4000`）
3. 契约收敛：公共接口放在 `@bingwu-my-monorepo/api-client`，请求/响应类型优先复用 `@bingwu-my-monorepo/shared-schemas`
4. 传输下沉：`api-client` 不绑定 axios，各端通过 `HttpAdapter` 注入自己的拦截器策略
5. 后端边界：路由层不直接泄漏 ORM 实体，统一经过 DTO 序列化

## 技术栈

- 前端：Vue 3、Vite、Vue Router、Pinia、Axios
- 后端：Express、Prisma、MySQL、JWT
- 共享：Zod、TypeScript
- 构建：Turbo、pnpm workspace、tsup
- 工程化：ESLint、Prettier、Husky、Commitlint

## 快速开始

### 1) 环境要求

- Node.js >= 20
- pnpm >= 10

### 2) 安装依赖

```bash
pnpm install
```

### 3) 启动开发

```bash
pnpm dev            # 启动全部应用
pnpm dev:web        # 仅启动 web（默认 8848）
pnpm dev:mobile     # 仅启动 mobile（默认 3002）
pnpm dev:server     # 仅启动 server（默认 4000）
```

### 4) 构建

```bash
pnpm build
pnpm build:web
pnpm build:mobile
pnpm build:server
```

## 常用命令

```bash
pnpm lint
pnpm lint:fix
pnpm format
pnpm clean
```

## 数据库（apps/server）

```bash
pnpm db:generate
pnpm db:push
pnpm db:migrate
pnpm db:migrate:deploy
pnpm db:studio
pnpm db:reset
```

## 部署说明（Server）

- 推荐使用 Prisma migration，不要在生产使用 `db:push`
- Render 可参考根目录 `render.yaml`

## 提交规范

遵循 Conventional Commits：

- `feat`: 新功能
- `fix`: 问题修复
- `refactor`: 架构/代码重构（无行为变更）
- `chore`: 构建、依赖、脚本
- `docs`: 文档
- `test`: 测试
