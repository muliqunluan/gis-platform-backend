// src/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { IsEmail, Length } from 'class-validator';
import { Map } from './map.entity';
import { Group } from './group.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @Length(6, 20)
  password_hash: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ default: true })
  is_active: boolean;

  // 简化的角色存储 - 直接存储角色数组，避免中间表
  @Column({
    type: 'simple-array',
    default: ['viewer']
  })
  roles: string[];

  @OneToMany(() => Map, map => map.owner)
  maps: Map[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password_hash) {
      this.password_hash = await bcrypt.hash(this.password_hash, 10);
    }
  }
}