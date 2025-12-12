// src/roles/dto/assign-role-to-user.dto.ts
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class AssignRoleToUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  roleName: string;
}