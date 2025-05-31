import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../shared/dto/base-response.dto';

class Data {
  @ApiProperty()
  walletCreationRequest: boolean;
}

export class UserRegistrationResponseDto extends BaseResponseDto {
 
  @ApiProperty({ type: Data })
  data: Data;
}
