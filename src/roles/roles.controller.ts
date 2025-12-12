// src/roles/roles.controller.ts
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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { AssignRoleToUserDto } from './dto/assign-role-to-user.dto';

@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // 获取所有角色
  @Get()
  async findAll() {
    return this.rolesService.findAll();
  }

  // 通过ID获取角色
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.rolesService.findById(parseInt(id, 10));
  }

  // 创建新角色
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto.name);
  }

  // 更新角色
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(parseInt(id, 10), updateRoleDto.name);
  }

  // 删除角色
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.rolesService.remove(parseInt(id, 10));
    return { message: 'Role deleted successfully' };
  }

  // 获取角色的所有权限
  @Get(':id/permissions')
  async getRolePermissions(@Param('id') id: string) {
    return this.rolesService.getRolePermissions(parseInt(id, 10));
  }

  // 为角色分配权限
  @Post(':id/permissions')
  @HttpCode(HttpStatus.OK)
  async assignPermission(
    @Param('id') id: string,
    @Body() assignPermissionDto: AssignPermissionDto,
  ) {
    return this.rolesService.assignPermissionToRole(
      parseInt(id, 10),
      assignPermissionDto.permissionId,
    );
  }

  // 从角色移除权限
  @Delete(':id/permissions/:permissionId')
  async removePermission(
    @Param('id') id: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.rolesService.removePermissionFromRole(
      parseInt(id, 10),
      parseInt(permissionId, 10),
    );
  }

  // 获取拥有指定角色的所有用户
  @Get(':id/users')
  async getUsersWithRole(@Param('id') id: string) {
    return this.rolesService.getUsersWithRole(parseInt(id, 10));
  }

  // 通过邮箱为用户分配角色
  @Post('assign-to-user')
  @HttpCode(HttpStatus.OK)
  async assignRoleToUser(@Body() assignRoleToUserDto: AssignRoleToUserDto) {
    return this.rolesService.assignRoleToUserByEmail(
      assignRoleToUserDto.email,
      assignRoleToUserDto.roleName,
    );
  }

  // 通过邮箱从用户移除角色
  @Delete('remove-from-user')
  async removeRoleFromUser(@Query() query: { email: string; roleName: string }) {
    return this.rolesService.removeRoleFromUserByEmail(query.email, query.roleName);
  }
}