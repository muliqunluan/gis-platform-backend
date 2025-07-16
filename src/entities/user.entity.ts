// src/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { IsEmail, Length } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;  // 用户的邮箱，登录时的唯一标识

  @Column()
  @Length(6, 20)
  password_hash: string;  // 加密后的密码

  @Column({ nullable: true })
  first_name: string;  // 用户的名字（可选）

  @Column({ nullable: true })
  last_name: string;  // 用户的姓氏（可选）

  @Column({ default: true })
  is_active: boolean;  // 用户是否激活，默认是激活

  @BeforeInsert()
  async hashPassword() {
    if (this.password_hash) {
      // 使用 bcrypt 加密密码
      this.password_hash = await bcrypt.hash(this.password_hash, 10);
    }
  }
}
