// src/roles/roles.controller.ts
import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { Repository } from 'typeorm';

@Controller('roles')
export class RolesController {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>
  ) {}

  @Get()
  async getAllRoles() {
    const roles = await this.roleRepo.find();
    return roles.map(r => r.name); // 返回 ["admin", "user", "editor"]
  }
}
