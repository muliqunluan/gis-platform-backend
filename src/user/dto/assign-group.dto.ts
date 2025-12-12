// src/user/dto/assign-group.dto.ts
import { IsNumber, IsNotEmpty } from 'class-validator';

export class AssignGroupDto {
  @IsNumber()
  @IsNotEmpty()
  groupId: number;
}