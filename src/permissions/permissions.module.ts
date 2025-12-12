import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { PoliciesGuard } from './guards/policies.guard';
import { AdminGuard } from './guards/admin.guard';

@Module({
  providers: [CaslAbilityFactory, PoliciesGuard, AdminGuard],
  exports: [CaslAbilityFactory, PoliciesGuard, AdminGuard],
})
export class PermissionsModule {}