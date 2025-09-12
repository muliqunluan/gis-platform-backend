// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/user.entity'; // 用户实体
import { Role } from './entities/role.entity'; // 角色实体
import { Permission } from './entities/permission.entity'; // 权限实体
import { UserRole } from './entities/user-role.entity'; // 用户角色关联表
import { RolePermission } from './entities/role-permission.entity'; // 角色权限关联表
import { RoleManagementModule } from './role-management/role-management.module';
import { AuthModule } from './auth/auth.module'; // 引入Auth模块
import { CommandModule } from 'nestjs-command'; // ✅ 导入 CommandModule
import { UserController } from './user/user.controller';
import { RolesController } from './roles/roles.controller';
import { UserModule } from './user/user.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { MapModule } from './map/map.module';
import { Map } from './entities/map.entity';
import { Group } from './entities/group.entity';
import { UserGroup } from './entities/user-group.entity';
import { Layer } from './entities/layer.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),  // 加载配置文件
    TypeOrmModule.forRoot({
      type: 'postgres',  // 使用PostgreSQL数据库
      host: 'localhost',
      port: 5432,
      username: process.env.PG_USERNAME,  // 数据库用户名
      password: process.env.PG_PASSWORD,  // 数据库密码
      database: process.env.DB_NAME,  // 数据库名称
      entities: [
        User,        // 用户实体
        Role,        // 角色实体
        Permission,  // 权限实体
        UserRole,    // 用户角色关联表
        RolePermission, // 角色权限关联表
        Map,         // 地图实体
        Group,       // 群组实体
        UserGroup,   // 用户群组实体 
        Layer        // 图层实体 
      ],  
      synchronize: true,  // 自动同步数据库（开发时使用）
    }),
    AuthModule,  // 导入认证模块
    CommandModule,
    RoleManagementModule,
    TypeOrmModule.forFeature([User, Role, UserRole]),
    UserModule,
    UserProfileModule,
    MapModule
  ],
  controllers:[UserController, RolesController]
})
export class AppModule {}
