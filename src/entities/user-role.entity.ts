// src/entities/user-role.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';  // 引入用户实体
import { Role } from './role.entity';  // 引入角色实体

@Entity()
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  // 多对一关系：用户和用户角色
  @ManyToOne(() => User, user => user.roles)
  user: User;

  @ManyToOne(() => Role, role => role.users)
  role: Role;
}
