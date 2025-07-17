// src/admin/admin.controller.ts
import { Controller, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin.guard'; // 保护路由的守卫
import { UserService } from '../user/user.service'; // 用户服务

@Controller('admin')
export class AdminController {
  constructor(private userService: UserService) {}

  @Patch('user/:email/roles')
  @UseGuards(AdminGuard) // 只有admin可以访问
  async updateUserRoles(
    @Param('email') email: string,
    @Body() body: { roles: string[] }
  ) {
    const updatedUser = await this.userService.updateUserRoles(email, body.roles);
    return { message: 'User roles updated successfully', user: updatedUser };
  }
}
