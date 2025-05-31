import { ApiProperty } from '@nestjs/swagger';

export class GetTasksDto {
  @ApiProperty({
    example: 'TODO',
    description: 'status of the task. Either TODO, IN_PROGRESS or COMPLETED',
    required: false,
  })
  status: string;

  @ApiProperty({
    example: 'LOW',
    description: 'Priority of the task. Either LOW, MEDIUM or HIGH',
    required: false,
  })
  priority: string;

  @ApiProperty({
    example: '1',
    description: 'The Page number you want to view',
    required: false,
  })
  page: number;

  @ApiProperty({
    example: '5',
    description: 'The number of items you want to view per page',
    required: false,
  })
  limit: number;
}
