import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../shared/dto/base-response.dto';

class Data {
  @ApiProperty()
  token: string;
}

export class UserLogoutResponseDto extends BaseResponseDto {
 
  @ApiProperty({ type: Data })
  data: Data;
}
