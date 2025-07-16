// src/role-management/role-management.module.ts
import { Module } from '@nestjs/common';
import { RoleManagementService } from './role-management.service';
import { RoleManagementCommand } from './role-nanagement.command';  // 引入命令
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { UserRole } from '../entities/user-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, UserRole])],
  providers: [RoleManagementService, RoleManagementCommand],  // 注册命令
  exports: [RoleManagementService],
})
export class RoleManagementModule {}
