// src/roles/dto/assign-permission.dto.ts
import { IsNumber, IsNotEmpty } from 'class-validator';

export class AssignPermissionDto {
  @IsNumber()
  @IsNotEmpty()
  permissionId: number;
}