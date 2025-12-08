import { Injectable } from '@nestjs/common';
import { AbilityBuilder, Ability, AbilityClass } from '@casl/ability';
import { User } from '../entities/user.entity';
import { PermissionsService } from './permissions.service';

// 定义动作类型
export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

// 定义主体类型
export type Subjects = 
  | 'all'
  | 'User'
  | 'Role'
  | 'Permission'
  | 'Map'
  | 'Layer'
  | 'Group';

export type AppAbility = Ability<[Action, Subjects]>;

// 权限接口
export interface PermissionData {
  action: string;
  resource: string;
}

@Injectable()
export class AbilityFactory {
  constructor(private permissionsService: PermissionsService) {}

  // 为用户创建能力
  async createForUser(user: User): Promise<AppAbility> {
    const { can, build } = new AbilityBuilder(
      Ability as AbilityClass<AppAbility>
    );

    // 获取用户的所有权限
    const userPermissions = await this.permissionsService.getUserPermissions(user.id);

    // 根据权限设置能力
    userPermissions.forEach(permission => {
      const { action, resource } = permission;
      
      // 处理通配符权限
      if (action === 'manage' && resource === 'all') {
        can(Action.Manage, 'all'); // 管理员权限
        return;
      }

      // 根据资源类型设置权限
      switch (resource) {
        case 'User':
          can(action as Action, 'User');
          break;
        case 'Role':
          can(action as Action, 'Role');
          break;
        case 'Permission':
          can(action as Action, 'Permission');
          break;
        case 'Map':
          can(action as Action, 'Map');
          break;
        case 'Layer':
          can(action as Action, 'Layer');
          break;
        case 'Group':
          can(action as Action, 'Group');
          break;
        default:
          // 对于未知资源，给予读取权限
          can(Action.Read, resource as Subjects);
      }
    });

    // 用户总是可以管理自己的资源
    can(Action.Manage, 'User');

    return build();
  }

  // 为匿名用户创建能力
  createForAnonymous(): AppAbility {
    const { can, build } = new AbilityBuilder(
      Ability as AbilityClass<AppAbility>
    );

    // 匿名用户只能读取公开资源
    can(Action.Read, 'Map');
    can(Action.Read, 'Layer');

    return build();
  }
}