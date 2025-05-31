import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
  

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
    example: '1748509306',
    description: 'Unix timestamp representing the due date of the task',
    required: false,
  })
  dueDate: number;

  @ApiProperty({
    example: '1748509306',
    description: 'Unix timestamp representing when the task was completed',
    required: false,
  })
  completedAt: number;
}
