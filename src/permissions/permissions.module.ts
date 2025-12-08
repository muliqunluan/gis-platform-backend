import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { AbilityFactory } from './ability.factory';
import { PoliciesGuard } from './guards/policies.guard';
import { AdminGuard } from './guards/admin.guard';
import { PermissionsInitCommand } from './permissions.init';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { UserRole } from '../entities/user-role.entity';
import { Permission } from '../entities/permission.entity';
import { RolePermission } from '../entities/role-permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      UserRole,
      Permission,
      RolePermission
    ])
  ],
  providers: [PermissionsService, AbilityFactory, PoliciesGuard, AdminGuard, PermissionsInitCommand],
  exports: [PermissionsService, AbilityFactory, PoliciesGuard, AdminGuard]
})
export class PermissionsModule {}