// src/roles/roles.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { Repository } from 'typeorm';
import { PoliciesGuard } from '../permissions/guards/policies.guard';
import { CheckPolicies } from '../permissions/decorators/policies.decorator';
import { Policies } from '../permissions/decorators/policies.decorator';

@Controller('roles')
export class RolesController {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>
  ) {}

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(Policies.canRead('Role'))
  async getAllRoles() {
    const roles = await this.roleRepo.find();
    return roles.map(r => r.name); // 返回 ["admin", "user", "editor"]
  }
}
