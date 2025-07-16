// src/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { IsEmail, Length } from 'class-validator';
import { UserRole } from './user-role.entity'; // 引入中间表

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

  // 多对多关系：用户和角色
  @OneToMany(() => UserRole, userRole => userRole.user)
  roles: UserRole[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password_hash) {
      this.password_hash = await bcrypt.hash(this.password_hash, 10);
    }
  }
}
