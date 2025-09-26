// src/entities/group.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';
import { Map } from './map.entity';
import { UserGroup } from './user-group.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Map, map => map.group)
  maps: Map[];

  @OneToMany(() => UserGroup, userGroup => userGroup.group)
  userGroups: UserGroup[];
}
