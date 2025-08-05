import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { User } from '../entities/user.entity';

@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userProfileService.findById(id);
  }
}