import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory, AppAbility, Action } from '../ability.factory';
import { CHECK_POLICIES_KEY, PolicyHandler } from '../decorators/policies.decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers = this.reflector.get<PolicyHandler[]>(
      CHECK_POLICIES_KEY,
      context.getHandler(),
    ) || [];

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      // 如果没有用户，使用匿名用户能力
      const ability = this.abilityFactory.createForAnonymous();
      return policyHandlers.every(handler => handler(ability));
    }

    // 为用户创建能力
    const ability = await this.abilityFactory.createForUser(user);

    return policyHandlers.every(handler => handler(ability));
  }
}