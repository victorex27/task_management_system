import { ApiProperty } from '@nestjs/swagger';

export class UserLoginRequestDto {
  @ApiProperty({
    example: 'test@test.com',
    description: 'Email of the user',
    required: true,
  })
  email: string;

  @ApiProperty({
    example: 'Password@1',
    description: 'Password of the user',
    required: true,
  })
  password: string;

  
}
