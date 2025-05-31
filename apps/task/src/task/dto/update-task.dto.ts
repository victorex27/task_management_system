import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

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
   @Transform(({ value }) => value.toNumber())
  dueDate: number;

  @IsInt()
  @IsOptional()
   @Transform(({ value }) => value.toNumber())
  completedAt: number;

  @IsBoolean()
  @IsOptional()
  isDeleted: boolean;
}
