import { Command, Positional } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { RoleManagementService } from './role-management.service';

@Injectable()
export class RoleManagementCommand {
  constructor(private readonly roleManagementService: RoleManagementService) {}

  @Command({
    command: 'assign-role <email> <role>',
    describe: 'Assign a role to a user',
  })
  async assignRole(
    @Positional({
      name: 'email',
      describe: 'user email',
      type: 'string'
    })
    email: string,
    @Positional({
      name: 'role',
      describe: 'role name',
      type: 'string'
    })
    role: string
  ) {
    console.log('Executing with:', { email, role });
    const result = await this.roleManagementService.assignRoleToUser(email, role);
    console.log(result);
  }
}