// src/user/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { AssignGroupDto } from './dto/assign-group.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 获取当前用户信息
  @Get('profile')
  async getProfile(@Request() req) {
    return this.userService.findById(req.user.sub);
  }

  // 通过ID获取用户信息
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.findById(parseInt(id, 10));
  }

  // 通过邮箱获取用户信息
  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  // 创建新用户
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    // 这里可以调用 AuthService 的 register 方法
    // 或者直接在 UserService 中实现创建逻辑
    return { message: 'User creation endpoint - to be implemented with AuthService' };
  }

  // 更新用户信息
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    // 实现用户信息更新逻辑
    return { message: 'User update endpoint - to be implemented' };
  }

  // 更新用户角色
  @Put(':id/roles')
  async updateUserRoles(@Param('id') id: string, @Body() body: { roles: string[] }) {
    // 首先获取用户邮箱
    const user = await this.userService.findById(parseInt(id, 10));
    return this.userService.updateUserRoles(user.email, body.roles);
  }

  // 为用户分配单个角色
  @Post(':id/roles')
  @HttpCode(HttpStatus.OK)
  async assignRole(@Param('id') id: string, @Body() assignRoleDto: AssignRoleDto) {
    const user = await this.userService.findById(parseInt(id, 10));
    return this.userService.assignRoleToUser(user.email, assignRoleDto.roleName);
  }

  // 从用户移除角色
  @Delete(':id/roles/:roleName')
  async removeRole(@Param('id') id: string, @Param('roleName') roleName: string) {
    const user = await this.userService.findById(parseInt(id, 10));
    return this.userService.removeRoleFromUser(user.email, roleName);
  }

  // 为用户分配群组
  @Post(':id/groups')
  @HttpCode(HttpStatus.OK)
  async assignGroup(@Param('id') id: string, @Body() assignGroupDto: AssignGroupDto) {
    return this.userService.assignGroupToUser(parseInt(id, 10), assignGroupDto.groupId);
  }

  // 从用户移除群组
  @Delete(':id/groups/:groupId')
  async removeGroup(@Param('id') id: string, @Param('groupId') groupId: string) {
    return this.userService.removeGroupFromUser(parseInt(id, 10), parseInt(groupId, 10));
  }

  // 获取用户的所有角色名称
  @Get(':id/roles/names')
  async getUserRoleNames(@Param('id') id: string) {
    return this.userService.getUserRoleNames(parseInt(id, 10));
  }
}