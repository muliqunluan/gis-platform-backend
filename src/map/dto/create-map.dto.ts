// src/map/dto/create-map.dto.ts
import { IsNotEmpty, IsBoolean, IsOptional, IsArray, IsEnum, IsNumber } from 'class-validator';
import { MapType } from '../../entities/map.entity';

export class CreateMapDto {
  @IsNotEmpty({ message: '地图名称不能为空' })
  name: string;

  @IsEnum(MapType, { message: '地图类型必须为 openlayers_gaode 或 game' })
  type: MapType;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  bounds?: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  zoomRange?: [number, number]; // [minZoom, maxZoom]

  @IsBoolean()
  isPublic: boolean;

  @IsNotEmpty({ message: '群组名称不能为空' })
  groupName: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  projection?: string;

  @IsOptional()
  @IsNumber()
  defaultZoom?: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  extent?: [number, number, number, number];
}