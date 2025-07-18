// src/entities/map.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Layer } from './layer.entity';
import { Group } from './group.entity';

export enum MapType {
  OPENLAYERS_GAODE = 'openlayers_gaode',
  GAME = 'game'
}

@Entity()
export class Map {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: MapType })
  type: MapType;

  @Column('json', { nullable: true })
  bounds: { // 高德地图范围
    minLng: number;
    minLat: number;
    maxLng: number;
    maxLat: number;
  };

  @Column('simple-array', { nullable: true })
  zoomRange: number[]; // 缩放范围 [min, max]

  @Column({ default: false })
  isPublic: boolean; // 是否公开到地图广场

  @ManyToOne(() => User, user => user.maps)
  owner: User;

  @OneToMany(() => Layer, layer => layer.map)
  layers: Layer[];

  @OneToOne(() => Group, group => group.map)
  group: Group;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
