// src/entities/layer.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Map } from './map.entity';

export enum LayerType {
  VECTOR = 'vector',
  RASTER = 'raster'
}

@Entity()
export class Layer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: LayerType })
  type: LayerType;

  @Column()
  url: string; // 图层数据源URL

  @Column('json', { nullable: true })
  style: any; // 图层样式配置

  @Column({ default: true })
  visible: boolean;

  @Column({ default: 1 })
  zIndex: number;

  @ManyToOne(() => Map, map => map.layers)
  map: Map;
}
