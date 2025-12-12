import { Injectable } from '@nestjs/common';
import { AbilityBuilder, createMongoAbility, MongoAbility } from '@casl/ability';
import { User } from '../entities/user.entity';
import { Map } from '../entities/map.entity';
import { Group } from '../entities/group.entity';
import { Action } from './enums/action.enum';

export type AppAbility = MongoAbility;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    // 基础权限：所有用户都可以读取公开的地图
    can(Action.Read, Map, { is_public: true });

    // 管理员权限
    if (user.roles.includes('admin')) {
      can(Action.Manage, 'all'); // 管理员可以管理所有资源
    }

    // 地图权限
    can(Action.Create, Map);
    can(Action.Read, Map, { owner: { id: user.id } });
    can(Action.Update, Map, { owner: { id: user.id } });
    can(Action.Delete, Map, { owner: { id: user.id } });

    // 群组权限 - 简化版本，具体权限检查在服务层实现
    can(Action.Create, Group);
    can(Action.Read, Group); // 可以读取所有群组信息

    // 用户管理权限
    can(Action.Read, User, { id: user.id });
    can(Action.Update, User, { id: user.id });

    return build({
      detectSubjectType: (object) => object.constructor as any,
    });
  }
}