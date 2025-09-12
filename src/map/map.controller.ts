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

@Controller('maps')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createMap(@Body() createMapDto: CreateMapDto, @Request() req) {
    const userId = req.user.id;
    return this.mapService.createMap(createMapDto, userId);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyMaps(@Request() req) {
    const userId = req.user.id;
    return this.mapService.getUserMaps(userId);
  }

  @Get('public')
  async getPublicMaps() {
    return this.mapService.getPublicMaps();
  }

  @Get(':id')
  async getMap(@Param('id', ParseIntPipe) id: number) {
    return this.mapService.getMapById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteMap(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user.id;
    return this.mapService.deleteMap(id, userId);
  }
}