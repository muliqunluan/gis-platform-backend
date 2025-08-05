import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { UserRole } from '../entities/user-role.entity';
import { Group } from '../entities/group.entity';
import { UserGroup } from '../entities/user-group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, UserRole, Group, UserGroup]),
  ],
  providers: [UserProfileService],
  controllers: [UserProfileController],
})
export class UserProfileModule {}