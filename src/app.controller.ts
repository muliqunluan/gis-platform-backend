import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

@Controller('maps')
export class MapsController {
  @Get()
  getMaps() {
    return [{ id: 1, name: 'Chongqing City Map' }];
  }
}