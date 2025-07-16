// src/entities/role.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserRole } from './user-role.entity';  // 引入中间表
import { RolePermission } from './role-permission.entity'; // 引入角色权限关联表

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // 例如：admin, editor, viewer

  // 多对多关系：角色和用户
  @OneToMany(() => UserRole, userRole => userRole.role)
  users: UserRole[];

  // 多对多关系：角色和权限
  @OneToMany(() => RolePermission, rolePermission => rolePermission.role)
  permissions: RolePermission[];
}
