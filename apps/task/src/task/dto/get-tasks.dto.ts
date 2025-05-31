import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';



class DataDto {
  @IsEnum(['TODO', 'IN_PROGRESS', 'COMPLETED'])
  @IsOptional()
  status: string;

  @IsEnum(['LOW', 'MEDIUM', 'HIGH'])
  @IsOptional()
  priority: string;

  @IsString()
  @IsOptional()
  assignedTo: string;

  @IsBoolean()
  @IsOptional()
  isDeleted: boolean;
}

class QueryDto {
  @IsInt()
  @IsOptional()
  @Min(1)
  page: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  limit: number;
}

export class GetTaskDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => DataDto)
  data?: DataDto = new DataDto();

  @IsOptional()
  @ValidateNested()
  @Type(() => QueryDto)
  query?: QueryDto = new QueryDto();
}


