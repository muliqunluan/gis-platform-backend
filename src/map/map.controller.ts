// src/map/map.controller.ts
import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe
} from '@nestjs/common';
import { MapService } from './map.service';
import { CreateMapDto } from './dto/create-map.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PoliciesGuard } from '../permissions/guards/policies.guard';
import { CheckPolicies } from '../permissions/decorators/policies.decorator';
import { Policies } from '../permissions/decorators/policies.decorator';

@Controller('maps')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(Policies.canCreate('Map'))
  async createMap(@Body() createMapDto: CreateMapDto, @Request() req) {
    const userId = req.user.id;
    return this.mapService.createMap(createMapDto, userId);
  }

  @Get('public')
  async getPublicMaps() {
    return this.mapService.getPublicMaps();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(Policies.canReadOwnResource('Map'))
  async getMyMaps(@Request() req) {
    const userId = req.user.id;
    return this.mapService.getUserMaps(userId);
  }

  @Get(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(Policies.canRead('Map'))
  async getMap(@Param('id', ParseIntPipe) id: number) {
    return this.mapService.getMapById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(Policies.canDeleteOwnResource('Map'))
  async deleteMap(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user.id;
    return this.mapService.deleteMap(id, userId);
  }
}