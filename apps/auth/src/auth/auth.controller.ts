import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthProto } from 'protos';
import { LoginDto } from './dto/login.dto';
import { ValidateTokenDto } from './dto/validate-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { CreateAuthUserDto } from './dto/create-auth-user.dto';

const AUTH_SERVICE_NAME = AuthProto.AUTH_SERVICE_NAME;


@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod(AUTH_SERVICE_NAME, 'CreateAuthUser')
  async createAuth(payload: CreateAuthUserDto) {
    return await  this.authService.createAuthUser(payload);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'Login')
  async login(payload: LoginDto) {
    return await this.authService.login(payload);
  }


  @GrpcMethod(AUTH_SERVICE_NAME, 'Logout')
  async logout(payload: LogoutDto) {
    return await this.authService.logout(payload);
  }

  
  @GrpcMethod(AUTH_SERVICE_NAME, 'ValidateAuthToken')
  getProfile(payload: ValidateTokenDto) {
    return  this.authService.validateJwtToken(payload.token);
  }
}
