// src/entities/permission.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RolePermission } from './role-permission.entity'; // 引入角色权限关联表

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string; // 例如：create, read, update, delete

  @Column()
  resource: string; // 例如：map, layer, group

  // 多对多关系：权限和角色
  @OneToMany(() => RolePermission, rolePermission => rolePermission.permission)
  roles: RolePermission[];
}
