// src/admin/admin.controller.ts
import { Controller, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../permissions/guards/admin.guard'; // 使用新的CASL管理员守卫
import { UserService } from '../user/user.service'; // 用户服务

@Controller('admin')
export class AdminController {
  constructor(private userService: UserService) {}

  @Patch('user/:email/roles')
  @UseGuards(AdminGuard) // 只有拥有管理权限的用户可以访问
  async updateUserRoles(
    @Param('email') email: string,
    @Body() body: { roles: string[] }
  ) {
    const updatedUser = await this.userService.updateUserRoles(email, body.roles);
    return { message: 'User roles updated successfully', user: updatedUser };
  }
}
