import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  assignedTo: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  createdBy: string;

  @IsEnum(['TODO', 'IN_PROGRESS', 'COMPLETED'])
  @IsNotEmpty()
  status: string;

  @IsEnum(['LOW', 'MEDIUM', 'HIGH'])
  @IsNotEmpty()
  priority: string;

  @IsInt()
  @IsOptional()
  dueDate: number;

  @IsInt()
  @IsOptional()
  completedAt: number;
}
