// src/map/map.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapController } from './map.controller';
import { MapService } from './map.service';
import { Map } from '../entities/map.entity';
import { Group } from '../entities/group.entity';
import { UserGroup } from '../entities/user-group.entity';
import { User } from '../entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Map, Group, UserGroup, User]),
    JwtModule.register({
      secret: 'jwt_secret', // 与auth模块保持一致
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [MapController],
  providers: [MapService, JwtAuthGuard],
  exports: [MapService],
})
export class MapModule {}