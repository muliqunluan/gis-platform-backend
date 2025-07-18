<h1 align="center">NeoMap 地理空间数据服务</h1>

<p align="center">
  <strong>基于 NestJS 构建的高性能地理信息服务平台</strong>
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License" />
  </a>
</p>

## 技术栈

### 核心框架
- **NestJS**: 11.x
- **运行时**: Node.js 18+
- **编译工具**: SWC (通过 @swc/core)
- **代码规范**: ESLint + Prettier

### 数据库与ORM
- **PostgreSQL**: 通过 pg 驱动
- **TypeORM**: 0.3.x
- **数据验证**: class-validator + class-transformer

### 安全与认证
- **认证**: @nestjs/jwt
- **加密**: bcryptjs 3.x

### 开发工具链
- **测试框架**: Jest 29.x
- **E2E测试**: supertest 7.x
- **调试支持**: source-map-support
- **类型系统**: TypeScript 5.x

### 基础设施
- **配置管理**: @nestjs/config

## 开发环境配置

### 系统要求
- Node.js 18+
- PostgreSQL 12+ (推荐 14+ 并安装 PostGIS 扩展)
- (可选) Redis 6+ (如需缓存层)

### 安装步骤

```bash
# 安装依赖
yarn install

# 配置环境变量 (复制示例文件)
cp .env.example .env

# 启动开发服务器 (带热重载)
yarn start:dev
