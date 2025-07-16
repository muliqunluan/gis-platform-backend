import { Module } from '@nestjs/common';
import { AppController, MapsController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(),],
  controllers: [MapsController],
  providers: [AppService],
})
export class AppModule {}
