# CASL 权限系统

本目录包含了基于 CASL (Code Access Security Library) 的权限管理系统，用于替换原有的手动 RBAC 实现。

## 文件结构

```
permissions/
├── ability.factory.ts      # CASL 能力工厂，根据用户权限创建能力对象
├── permissions.service.ts   # 权限服务，处理权限和角色的CRUD操作
├── permissions.module.ts   # 权限模块，导出所有权限相关的服务和守卫
├── permissions.init.ts      # 权限初始化命令，用于创建基础权限和角色
├── guards/
│   ├── policies.guard.ts    # 通用策略守卫，用于检查自定义权限策略
│   └── admin.guard.ts      # 管理员守卫，检查用户是否有管理权限
└── decorators/
    └── policies.decorator.ts # 权限装饰器，用于在控制器方法上声明权限要求
```

## 基本概念

### 动作 (Actions)
- `Manage`: 完全控制权限
- `Create`: 创建权限
- `Read`: 读取权限
- `Update`: 更新权限
- `Delete`: 删除权限

### 资源 (Subjects)
- `User`: 用户资源
- `Role`: 角色资源
- `Permission`: 权限资源
- `Map`: 地图资源
- `Layer`: 图层资源
- `Group`: 群组资源
- `all`: 所有资源（管理员权限）

## 使用方法

### 1. 在控制器中使用权限装饰器

```typescript
import { UseGuards } from '@nestjs/common';
import { PoliciesGuard } from '../permissions/guards/policies.guard';
import { CheckPolicies, Policies } from '../permissions/decorators/policies.decorator';

@Controller('maps')
export class MapController {
  @Post()
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(Policies.canCreate('Map'))
  async createMap() {
    // 只有拥有创建地图权限的用户可以访问
  }

  @Get(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(Policies.canRead('Map'))
  async getMap() {
    // 只有拥有读取地图权限的用户可以访问
  }
}
```

### 2. 使用管理员守卫

```typescript
import { AdminGuard } from '../permissions/guards/admin.guard';

@Controller('admin')
export class AdminController {
  @Patch('user/:email/roles')
  @UseGuards(AdminGuard)
  async updateUserRoles() {
    // 只有拥有管理所有资源权限的用户可以访问
  }
}
```

### 3. 在服务中检查权限

```typescript
import { AbilityFactory } from '../permissions/ability.factory';

@Injectable()
export class SomeService {
  constructor(private abilityFactory: AbilityFactory) {}

  async someMethod(user: User) {
    const ability = await this.abilityFactory.createForUser(user);
    
    if (ability.can('delete', 'Map')) {
      // 用户有删除地图的权限
    }
  }
}
```

### 4. 初始化权限系统

运行以下命令初始化基础权限和角色：

```bash
npm run start:dev -- init:permissions
```

这将创建以下角色和权限：

#### 角色
- `admin`: 管理员，拥有所有权限
- `editor`: 编辑者，可以创建、读取、更新和删除地图和图层
- `viewer`: 查看者，只能读取地图、图层和群组

#### 权限
- 管理员: `manage:all`
- 编辑者: `create,read,update,delete:Map,Layer` 和 `read:Group`
- 查看者: `read:Map,Layer,Group`

## 迁移指南

### 从旧 RBAC 系统迁移

1. 替换 `AdminGuard` 导入：
   ```typescript
   // 旧的
   import { AdminGuard } from '../auth/guards/admin.guard';
   
   // 新的
   import { AdminGuard } from '../permissions/guards/admin.guard';
   ```

2. 使用细粒度权限控制：
   ```typescript
   // 旧的：只检查是否为管理员
   @UseGuards(AdminGuard)
   
   // 新的：检查具体权限
   @UseGuards(PoliciesGuard)
   @CheckPolicies(Policies.canUpdate('User'))
   ```

3. 移除硬编码的角色检查：
   ```typescript
   // 旧的
   if (user.roles.includes('admin')) { ... }
   
   // 新的
   const ability = await this.abilityFactory.createForUser(user);
   if (ability.can('manage', 'all')) { ... }
   ```

## 优势

相比原有的手动 RBAC 实现，CASL 系统具有以下优势：

1. **更灵活的权限控制**: 可以定义更细粒度的权限策略
2. **更好的可维护性**: 权限逻辑集中管理，易于扩展和修改
3. **类型安全**: TypeScript 支持，编译时检查权限错误
4. **性能优化**: 权限检查更高效，支持权限缓存
5. **易于测试**: 权限逻辑与业务逻辑分离，便于单元测试

## 注意事项

1. 确保在应用启动时运行权限初始化命令
2. 用户登录后，JWT token 中仍包含角色信息，用于 CASL 能力创建
3. 权限更改后，需要重新登录或刷新 token 才能生效
4. 匿名用户只能访问公开资源