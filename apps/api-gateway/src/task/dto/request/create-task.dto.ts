import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    example: 'title',
    description: 'title of the task',
    required: true,
  })
  title: string;

  @ApiProperty({
    example: 'write a task description',
    description: 'Provides a detailed description of the task',
    required: true,
  })
  description: string;

  @ApiProperty({
    example: 'deb5ef3d-5688-4c73-83df-69d109cc726f',
    description: 'id of the user to whom the task is assigned',
    required: true,
  })
  assignedTo: string;


  @ApiProperty({
    example: 'TODO',
    description: 'status of the task. Either TODO, IN_PROGRESS or COMPLETED',
    required: true,
  })
  status: string;

  
  @ApiProperty({
    example: 'LOW',
    description: 'Priority of the task. Either LOW, MEDIUM or HIGH',
    required: true,
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
