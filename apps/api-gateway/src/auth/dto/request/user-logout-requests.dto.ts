import { ApiProperty } from '@nestjs/swagger';

export class UserLogoutRequestDto {
  @ApiProperty({
    example: '00c39561-0268-4826-938c-20a4cf7dd188',
    description: 'uuid of the user',
    required: true,
  })
  id: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QxQHRlc3QuY29tIiwiaWQiOiI0MWEzMzhiNi02NDFjLTRhNmItOGFlYy1lNjQyZGEwOWYxYWEiLCJpYXQiOjE3NDg2NDA3NDYsImV4cCI6MTc0OTAwMDc0Nn0.a7D5QjRChhi4nEqPU1t_-3WWQzXIn5Vb2Kuoj82ss3M',
    description: 'token',
    required: true,
  })
  token: string;

  
}
