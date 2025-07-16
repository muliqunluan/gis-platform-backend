// src/role-management/role-management.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { UserRole } from '../entities/user-role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleManagementService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
  ) {}

  // 通过邮箱分配角色
  async assignRoleToUser(email: string, roleName: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return `User with email ${email} not found.`;
    }

    const role = await this.roleRepository.findOne({ where: { name: roleName } });
    if (!role) {
      return `Role ${roleName} not found.`;
    }

    const existingUserRole = await this.findUserRole(user, role);

    if (existingUserRole) {
      return `User already has the ${roleName} role.`;
    }

    const userRole = this.userRoleRepository.create({ user, role });
    await this.userRoleRepository.save(userRole);

    return `Role ${roleName} successfully assigned to ${email}.`;
  }

  // 通过邮箱移除角色
  async removeRoleFromUser(email: string, roleName: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return `User with email ${email} not found.`;
    }

    const role = await this.roleRepository.findOne({ where: { name: roleName } });
    if (!role) {
      return `Role ${roleName} not found.`;
    }

    const existingUserRole = await this.findUserRole(user, role);

    if (!existingUserRole) {
      return `User does not have the ${roleName} role.`;
    }

    await this.userRoleRepository.remove(existingUserRole);

    return `Role ${roleName} successfully removed from ${email}.`;
  }
  // 查找用户角色关联的私有方法
  private async findUserRole(user: User, role: Role): Promise<UserRole | null> {
    return this.userRoleRepository.findOne({
      where: {
        user: { id: user.id },
        role: { id: role.id },
      },
    });
  }
}
