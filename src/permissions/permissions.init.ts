import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { PermissionsService } from './permissions.service';

@Injectable()
export class PermissionsInitCommand {
  constructor(private permissionsService: PermissionsService) {}

  @Command({ command: 'init:permissions', describe: 'Initialize permissions and roles' })
  async run(): Promise<void> {
    console.log('Initializing permissions and roles...');
    try {
      await this.permissionsService.initializePermissions();
      console.log('Permissions and roles initialized successfully!');
    } catch (error) {
      console.error('Failed to initialize permissions and roles:', error);
    }
  }
}