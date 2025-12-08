// src/user/user.controller.ts
import { Controller, Get, Param, NotFoundException, Patch, Body, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserRole } from '../entities/user-role.entity';
import { Role } from '../entities/role.entity';
import { UserService } from './user.service';
import { PoliciesGuard } from '../permissions/guards/policies.guard';
import { CheckPolicies } from '../permissions/decorators/policies.decorator';
import { Policies } from '../permissions/decorators/policies.decorator';

@Controller('users')
export class UserController {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(UserRole)
    private userRoleRepo: Repository<UserRole>,
    private userService: UserService // 注入UserService
  ) {}

  @Get(':email/roles')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(Policies.canRead('User'))
  async getUserRoles(@Param('email') email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const userRoles = await this.userRoleRepo.find({
      where: { user: { id: user.id } },
      relations: ['role'],
    });

    return userRoles.map(ur => ur.role.name); // 返回 ["admin", "editor"]
  }

  @Patch(':email/roles')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(Policies.canUpdate('User'))
  async updateUserRoles(
    @Param('email') email: string,
    @Body() body: { roles: string[] }
  ) {
    if (!Array.isArray(body.roles)) {
      throw new Error('roles must be an array');
    }

    const user = await this.userService.updateUserRoles(email, body.roles);
    return { success: true, user };
  }
}
