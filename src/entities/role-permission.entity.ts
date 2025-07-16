// src/entities/role-permission.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Role } from './role.entity';  // 引入角色实体
import { Permission } from './permission.entity';  // 引入权限实体

@Entity()
export class RolePermission {
  @PrimaryGeneratedColumn()
  id: number;

  // 多对一关系：角色和角色权限
  @ManyToOne(() => Role, role => role.permissions)
  role: Role;

  @ManyToOne(() => Permission, permission => permission.roles)
  permission: Permission;
}
