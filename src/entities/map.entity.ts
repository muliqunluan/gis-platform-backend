// src/entities/map.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Layer } from './layer.entity';
import { Group } from './group.entity';

export enum MapType {
  OPENLAYERS_GAODE = 'openlayers_gaode',
  GAME = 'game',
}

@Entity()
export class Map {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  is_public: boolean;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @Column({ nullable: true })
  type: MapType;

  @ManyToOne(() => User, user => user.maps)
  owner: User;

  @ManyToOne(() => Group, group => group.maps, { nullable: true })
  group: Group;

  @OneToMany(() => Layer, layer => layer.map)
  layers: Layer[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}