// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserRole } from '../entities/user-role.entity';
import { Role } from '../entities/role.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRole, Role]), // 注册所有相关实体
    PermissionsModule, // 导入PermissionsModule以访问AbilityFactory和PoliciesGuard
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // 导出服务以便其他模块使用
})
export class UserModule {}