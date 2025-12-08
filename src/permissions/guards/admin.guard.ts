import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory, Action } from '../ability.factory';
import { Policies } from '../decorators/policies.decorator';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false; // 没有用户信息，拒绝访问
    }

    // 为用户创建能力
    const ability = await this.abilityFactory.createForUser(user);

    // 检查用户是否有管理所有资源的权限
    return Policies.canManageAll(ability);
  }
}