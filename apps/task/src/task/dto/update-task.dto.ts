import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEnum(['TODO', 'IN_PROGRESS', 'COMPLETED'])
  @IsOptional()
  status: string;

  @IsEnum(['LOW', 'MEDIUM', 'HIGH'])
  @IsOptional()
  priority: string;

  @IsInt()
  @IsOptional()
  dueDate: number;

  @IsInt()
  @IsOptional()
  completedAt: number;

  @IsBoolean()
  @IsOptional()
  isDeleted: boolean;
}
