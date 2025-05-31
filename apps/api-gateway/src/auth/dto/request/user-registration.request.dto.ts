import { ApiProperty } from '@nestjs/swagger';

export class UserRegistrationRequestDto {
  @ApiProperty({
    example: 'test@test.com',
    description: 'Email of the user',
    required: true,
  })
  email: string;

  @ApiProperty({
    example: 'ADMIN',
    description: 'ADMIN OR USER',
    enum: ['ADMIN', 'USER'],
    enumName: 'UserRole',
    default: 'USER',
    required: true,
  })
  role: string;

  @ApiProperty({
    example: 'John',
    description: 'First name of the user',
    required: true,
  })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the user',
    required: true,
  })
  lastName: string;
}
