import { SetMetadata } from '@nestjs/common';
import { AppAbility, Action } from '../ability.factory';

// 策略处理函数类型
export type PolicyHandler = (ability: AppAbility) => boolean;

// 设置策略元数据键
export const CHECK_POLICIES_KEY = 'check_policy';

// 策略装饰器
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);

// 常用策略处理函数
export const Policies = {
  canManageAll: (ability: AppAbility) => ability.can(Action.Manage, 'all'),
  canCreate: (resource: string) => (ability: AppAbility) => ability.can(Action.Create, resource as any),
  canRead: (resource: string) => (ability: AppAbility) => ability.can(Action.Read, resource as any),
  canUpdate: (resource: string) => (ability: AppAbility) => ability.can(Action.Update, resource as any),
  canDelete: (resource: string) => (ability: AppAbility) => ability.can(Action.Delete, resource as any),
  canManage: (resource: string) => (ability: AppAbility) => ability.can(Action.Manage, resource as any),
};