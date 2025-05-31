import { ApiProperty } from '@nestjs/swagger';

export class GetTaskDto {
  @ApiProperty({
    example: 'deb5ef3d-5688-4c73-83df-69d109cc726f',
    description: 'id of the task to be fetched',
    required: true,
  })
  id: string;
}
