import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AdminGuard } from '../guards/admin.guard';
import { UserLoginRequestDto } from './dto/request/user-login-request.dto';
import { UserLoginResponseDto } from './dto/response/user-login-response.dto';
import { UserRegistrationResponseDto } from './dto/response/user-registration-response.dto';
import { UserRegistrationRequestDto } from './dto/request/user-registration.request.dto';
import { UserLogoutResponseDto } from './dto/response/user-logout-response.dto';
import { UserLogoutRequestDto } from './dto/request/user-logout-requests.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: UserLoginResponseDto })
  @ApiBody({
    type: UserLoginRequestDto,
    description: 'JSON payload for auth login',
  })
  login(@Body() payload: UserLoginRequestDto) {
    return this.authService.login(payload);
  }

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ type: UserRegistrationResponseDto })
  @ApiBody({
    type: UserRegistrationRequestDto,
    description: 'JSON payload for creating a new user',
  })
  @UseGuards(AdminGuard)
  registerAuth(@Body() payload: UserRegistrationRequestDto) {
    return this.authService.registerAuth(payload);
  }

  @Post('/logout')
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: UserLogoutResponseDto })
  @ApiBody({
    type: UserLogoutRequestDto,
    description: 'JSON payload for auth logout',
  })
  loginAuth(@Body() payload: UserLogoutRequestDto) {
    return this.authService.logout(payload);
  }
}
