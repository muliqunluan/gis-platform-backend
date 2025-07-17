// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { UserRole } from '../entities/user-role.entity'; // 引入中间表
import { In } from 'typeorm';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>, // 用来管理用户角色的中间表
  ) {}

  async updateUserRoles(email: string, roles: string[]) {
    const user = await this.userRepository.findOne({ 
        where: { email },
        relations: ['roles', 'roles.role'] // 确保加载关联关系
    });

    if (!user) {
        throw new Error('User not found');
    }

    // 根据角色名称查找角色实体
    const roleEntities = await this.roleRepository.find({
        where: { name: In(roles) } // 使用 In 操作符查询多个角色
    });

    if (roleEntities.length !== roles.length) {
        throw new Error('Some roles not found');
    }

    // 删除用户原有角色
    await this.userRoleRepository.delete({ user });

    // 给用户添加新的角色
    for (const role of roleEntities) {
        const userRole = this.userRoleRepository.create({ user, role });
        await this.userRoleRepository.save(userRole);
    }

    return user;
}
}
