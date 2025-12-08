import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { UserRole } from '../entities/user-role.entity';
import { RolePermission } from '../entities/role-permission.entity';

// 权限数据接口
export interface PermissionData {
  action: string;
  resource: string;
}

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
  ) {}

  // 获取用户的所有权限
  async getUserPermissions(userId: number): Promise<PermissionData[]> {
    // 查询用户的所有角色
    const userRoles = await this.userRoleRepository.find({
      where: { user: { id: userId } },
      relations: ['role'],
    });

    if (userRoles.length === 0) {
      return [];
    }

    const roleIds = userRoles.map(ur => ur.role.id);

    // 查询这些角色的所有权限
    const rolePermissions = await this.rolePermissionRepository.find({
      where: { role: { id: roleIds as any } }, // TypeORM 查询语法
      relations: ['permission'],
    });

    // 转换为权限数据
    return rolePermissions.map(rp => ({
      action: rp.permission.action,
      resource: rp.permission.resource,
    }));
  }

  // 创建权限
  async createPermission(action: string, resource: string): Promise<Permission> {
    const permission = this.permissionRepository.create({ action, resource });
    return this.permissionRepository.save(permission);
  }

  // 创建角色
  async createRole(name: string): Promise<Role> {
    const role = this.roleRepository.create({ name });
    return this.roleRepository.save(role);
  }

  // 为角色分配权限
  async assignPermissionToRole(roleId: number, permissionId: number): Promise<RolePermission> {
    const rolePermission = this.rolePermissionRepository.create({
      role: { id: roleId },
      permission: { id: permissionId },
    });
    return this.rolePermissionRepository.save(rolePermission);
  }

  // 为用户分配角色
  async assignRoleToUser(userId: number, roleId: number): Promise<UserRole> {
    const userRole = this.userRoleRepository.create({
      user: { id: userId },
      role: { id: roleId },
    });
    return this.userRoleRepository.save(userRole);
  }

  // 检查用户是否有特定权限
  async hasPermission(userId: number, action: string, resource: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);
    return permissions.some(
      p => 
        (p.action === 'manage' && p.resource === 'all') || // 管理员权限
        (p.action === action && p.resource === resource) || // 精确匹配
        (p.action === 'manage' && p.resource === resource)   // 管理特定资源
    );
  }

  // 初始化基础权限和角色
  async initializePermissions(): Promise<void> {
    // 创建基础权限
    const permissions = [
      { action: 'manage', resource: 'all' },      // 超级管理员
      { action: 'create', resource: 'Map' },
      { action: 'read', resource: 'Map' },
      { action: 'update', resource: 'Map' },
      { action: 'delete', resource: 'Map' },
      { action: 'create', resource: 'Layer' },
      { action: 'read', resource: 'Layer' },
      { action: 'update', resource: 'Layer' },
      { action: 'delete', resource: 'Layer' },
      { action: 'create', resource: 'Group' },
      { action: 'read', resource: 'Group' },
      { action: 'update', resource: 'Group' },
      { action: 'delete', resource: 'Group' },
      { action: 'read', resource: 'User' },
      { action: 'update', resource: 'User' },
      { action: 'read', resource: 'Role' },
      { action: 'update', resource: 'Role' },
    ];

    for (const perm of permissions) {
      const exists = await this.permissionRepository.findOne({
        where: { action: perm.action, resource: perm.resource }
      });
      if (!exists) {
        await this.createPermission(perm.action, perm.resource);
      }
    }

    // 创建基础角色
    const roles = ['admin', 'editor', 'viewer'];
    for (const roleName of roles) {
      const exists = await this.roleRepository.findOne({
        where: { name: roleName }
      });
      if (!exists) {
        await this.createRole(roleName);
      }
    }

    // 为角色分配权限
    await this.assignRolePermissions();
  }

  // 为角色分配权限
  private async assignRolePermissions(): Promise<void> {
    const adminRole = await this.roleRepository.findOne({ where: { name: 'admin' } });
    const editorRole = await this.roleRepository.findOne({ where: { name: 'editor' } });
    const viewerRole = await this.roleRepository.findOne({ where: { name: 'viewer' } });

    if (!adminRole || !editorRole || !viewerRole) return;

    // 管理员拥有所有权限
    const adminPerm = await this.permissionRepository.findOne({
      where: { action: 'manage', resource: 'all' }
    });
    if (adminPerm) {
      const exists = await this.rolePermissionRepository.findOne({
        where: { role: { id: adminRole.id }, permission: { id: adminPerm.id } }
      });
      if (!exists) {
        await this.assignPermissionToRole(adminRole.id, adminPerm.id);
      }
    }

    // 编辑者权限
    const editorPermissions = [
      { action: 'create', resource: 'Map' },
      { action: 'read', resource: 'Map' },
      { action: 'update', resource: 'Map' },
      { action: 'delete', resource: 'Map' },
      { action: 'create', resource: 'Layer' },
      { action: 'read', resource: 'Layer' },
      { action: 'update', resource: 'Layer' },
      { action: 'delete', resource: 'Layer' },
      { action: 'read', resource: 'Group' },
    ];

    for (const perm of editorPermissions) {
      const permission = await this.permissionRepository.findOne({
        where: { action: perm.action, resource: perm.resource }
      });
      if (permission) {
        const exists = await this.rolePermissionRepository.findOne({
          where: { role: { id: editorRole.id }, permission: { id: permission.id } }
        });
        if (!exists) {
          await this.assignPermissionToRole(editorRole.id, permission.id);
        }
      }
    }

    // 查看者权限
    const viewerPermissions = [
      { action: 'read', resource: 'Map' },
      { action: 'read', resource: 'Layer' },
      { action: 'read', resource: 'Group' },
    ];

    for (const perm of viewerPermissions) {
      const permission = await this.permissionRepository.findOne({
        where: { action: perm.action, resource: perm.resource }
      });
      if (permission) {
        const exists = await this.rolePermissionRepository.findOne({
          where: { role: { id: viewerRole.id }, permission: { id: permission.id } }
        });
        if (!exists) {
          await this.assignPermissionToRole(viewerRole.id, permission.id);
        }
      }
    }
  }
}