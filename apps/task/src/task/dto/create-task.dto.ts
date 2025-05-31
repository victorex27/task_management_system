import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';

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

  @IsNumber()
  @Transform(({ value }) => value.toNumber())
  @IsOptional()
  dueDate: number;

  @IsNumber()
  @Transform(({ value }) => value.toNumber())
  @IsOptional()
  completedAt: number;
}
