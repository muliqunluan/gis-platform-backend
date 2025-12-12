# NeoMap 使用指南

## 概述

本文档描述了 NeoMap 项目简化后的架构和使用方法。简化后的版本解决了原有系统中的模块重复、权限复杂、配置管理不完善等问题。

## 主要改进

### 1. 模块整合
- **用户模块**：合并了 `user` 和 `user-profile` 模块，统一了用户管理功能
- **角色模块**：合并了 `roles` 和 `role-management` 模块，简化了角色管理
- **权限系统**：移除了复杂的 CASL 权限系统，采用简单的基于角色的访问控制

### 2. 实体简化
- **用户实体**：直接在用户实体中存储角色数组，避免中间表
- **关系优化**：减少了不必要的中间表，简化了数据库结构

### 3. 配置管理
- **环境变量**：完善了环境变量配置，包括 JWT 密钥
- **配置文件**：使用统一的配置管理方案

### 4. API 响应
- **统一格式**：实现了统一的 API 响应格式
- **拦截器**：使用响应拦截器统一处理 API 响应

## 文件结构

```
src/
├── app.module.final.ts          # 简化后的主应用模块
├── config/
│   └── configuration.ts         # 配置管理
├── auth/
│   ├── auth.module.simplified.ts # 简化后的认证模块
│   ├── guards/
│   │   └── roles.guard.ts       # 角色守卫
│   ├── decorators/
│   │   └── roles.decorator.ts   # 角色装饰器
│   └── enums/
│       └── role.enum.ts         # 角色枚举
├── user/
│   ├── user.module.unified.ts   # 统一的用户模块
│   ├── user.service.unified.ts  # 统一的用户服务
│   ├── user.controller.unified.ts # 统一的用户控制器
│   └── dto/                   # 用户相关 DTO
├── roles/
│   ├── roles.module.unified.ts  # 统一的角色模块
│   ├── roles.service.unified.ts # 统一的角色服务
│   ├── roles.controller.unified.ts # 统一的角色控制器
│   └── dto/                   # 角色相关 DTO
├── entities/
│   ├── user.entity.simplified.ts # 简化后的用户实体
│   ├── map.entity.simplified.ts  # 简化后的地图实体
│   ├── layer.entity.ts          # 图层实体
│   └── group.entity.ts          # 群组实体
└── common/
    └── interceptors/
        └── response.interceptor.ts # 响应拦截器
```

## 使用方法

### 1. 环境配置

确保 `.env` 文件包含以下配置：

```env
PORT=7050
PG_USERNAME="postgres"
PG_PASSWORD="12100"
DB_NAME="webgisdatabase"
DB_HOST="localhost"
DB_PORT="5432"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
```

### 2. 启动应用

使用简化后的主模块启动应用：

```bash
# 替换原有的 app.module.ts
cp src/app.module.final.ts src/app.module.ts

# 启动应用
npm run start:dev
```

### 3. API 使用

#### 用户管理
- `GET /users/profile` - 获取当前用户信息
- `GET /users/:id` - 获取指定用户信息
- `PUT /users/:id/roles` - 更新用户角色
- `POST /users/:id/roles` - 为用户分配角色
- `DELETE /users/:id/roles/:roleName` - 从用户移除角色

#### 角色管理
- `GET /roles` - 获取所有角色
- `POST /roles` - 创建新角色
- `PUT /roles/:id` - 更新角色
- `DELETE /roles/:id` - 删除角色
- `POST /roles/assign-to-user` - 为用户分配角色

### 4. 权限控制

使用简化的角色装饰器：

```typescript
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('maps')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MapController {
  @Get()
  @Roles(Role.ADMIN, Role.EDITOR)
  async findAll() {
    // 只有管理员和编辑者可以访问
  }

  @Post()
  @Roles(Role.ADMIN)
  async create() {
    // 只有管理员可以创建
  }
}
```

## 迁移指南

### 从原有系统迁移

1. **数据库迁移**
   - 备份现有数据库
   - 执行迁移脚本，将用户角色数据从中间表迁移到用户实体的 roles 字段

2. **代码迁移**
   - 替换 `app.module.ts` 为 `app.module.final.ts`
   - 更新导入路径，使用统一后的模块
   - 替换 CASL 权限检查为角色装饰器

3. **配置更新**
   - 更新 `.env` 文件，添加 JWT 配置
   - 确保所有环境变量都已正确设置

## 注意事项

1. **向后兼容性**
   - 简化后的 API 可能与原有版本不完全兼容
   - 需要更新前端代码以适应新的 API 格式

2. **安全性**
   - 确保在生产环境中更改 JWT 密钥
   - 定期更新密钥以提高安全性

3. **性能**
   - 简化后的系统减少了数据库查询，性能应有所提升
   - 建议在生产环境中进行性能测试

## 故障排除

### 常见问题

1. **模块导入错误**
   - 检查文件路径是否正确
   - 确保所有依赖都已正确安装

2. **数据库连接问题**
   - 检查 `.env` 文件中的数据库配置
   - 确保数据库服务正在运行

3. **权限验证失败**
   - 检查 JWT 密钥配置
   - 确保用户角色已正确设置

## 后续开发

### 扩展建议

1. **添加更多角色**
   - 在 `role.enum.ts` 中添加新角色
   - 更新相关权限检查逻辑

2. **增强 API 功能**
   - 添加更多 CRUD 操作
   - 实现更复杂的查询和过滤

3. **性能优化**
   - 添加数据库索引
   - 实现缓存机制

## 总结

简化后的 NeoMap 系统具有以下优势：
- 更清晰的代码结构
- 更简单的权限管理
- 更好的可维护性
- 更高的性能

通过遵循本指南，您可以顺利迁移到简化版本，并在此基础上继续开发新功能。