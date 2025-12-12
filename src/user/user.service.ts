// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Group } from '../entities/group.entity';
import { UserGroup } from '../entities/user-group.entity';
import { In } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    @InjectRepository(Group)
    private groupRepository: Repository<Group>,

    @InjectRepository(UserGroup)
    private userGroupRepository: Repository<UserGroup>,
  ) {}

  // 获取用户详细信息（包括角色和群组）
  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['userGroups', 'userGroups.group'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user;
  }

  // 通过邮箱获取用户信息
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['userGroups', 'userGroups.group'],
    });
  }

  // 更新用户角色
  async updateUserRoles(email: string, roles: string[]) {
    const user = await this.userRepository.findOne({
      where: { email }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 根据角色名称查找角色实体
    const roleEntities = await this.roleRepository.find({
      where: { name: In(roles) }
    });

    if (roleEntities.length !== roles.length) {
      throw new NotFoundException('Some roles not found');
    }

    // 直接更新用户的roles数组
    user.roles = roles;
    await this.userRepository.save(user);

    return this.findById(user.id);
  }

  // 为用户分配单个角色
  async assignRoleToUser(email: string, roleName: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found.`);
    }

    const role = await this.roleRepository.findOne({ where: { name: roleName } });
    if (!role) {
      throw new NotFoundException(`Role ${roleName} not found.`);
    }

    // 检查用户是否已有该角色
    if (user.roles && user.roles.includes(roleName)) {
      return `User already has the ${roleName} role.`;
    }

    // 添加角色到用户的roles数组
    if (!user.roles) {
      user.roles = [];
    }
    user.roles.push(roleName);
    await this.userRepository.save(user);

    return `Role ${roleName} successfully assigned to ${email}.`;
  }

  // 从用户移除角色
  async removeRoleFromUser(email: string, roleName: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found.`);
    }

    const role = await this.roleRepository.findOne({ where: { name: roleName } });
    if (!role) {
      throw new NotFoundException(`Role ${roleName} not found.`);
    }

    // 检查用户是否有该角色
    if (!user.roles || !user.roles.includes(roleName)) {
      return `User does not have the ${roleName} role.`;
    }

    // 从用户的roles数组中移除角色
    user.roles = user.roles.filter(r => r !== roleName);
    await this.userRepository.save(user);

    return `Role ${roleName} successfully removed from ${email}.`;
  }

  // 为用户分配群组
  async assignGroupToUser(userId: number, groupId: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const group = await this.groupRepository.findOne({ where: { id: groupId } });
    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found.`);
    }

    const existingUserGroup = await this.findUserGroup(user, group);

    if (existingUserGroup) {
      return `User is already in group ${group.name}.`;
    }

    const userGroup = this.userGroupRepository.create({ user, group });
    await this.userGroupRepository.save(userGroup);

    return `User successfully added to group ${group.name}.`;
  }

  // 从用户移除群组
  async removeGroupFromUser(userId: number, groupId: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const group = await this.groupRepository.findOne({ where: { id: groupId } });
    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found.`);
    }

    const existingUserGroup = await this.findUserGroup(user, group);

    if (!existingUserGroup) {
      return `User is not in group ${group.name}.`;
    }

    await this.userGroupRepository.remove(existingUserGroup);

    return `User successfully removed from group ${group.name}.`;
  }

  // 获取用户的所有角色名称
  async getUserRoleNames(userId: number): Promise<string[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user.roles || [];
  }

  // 查找用户群组关联的私有方法
  private async findUserGroup(user: User, group: Group): Promise<UserGroup | null> {
    return this.userGroupRepository.findOne({
      where: {
        user: { id: user.id },
        group: { id: group.id },
      },
    });
  }
}