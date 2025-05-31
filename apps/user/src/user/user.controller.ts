import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { GrpcMethod } from '@nestjs/microservices';
import { UserProto } from 'protos';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserByIdDto } from './dto/get-user-by-id.dto';

const USER_SERVICE_NAME = UserProto.USER_SERVICE_NAME;

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod(USER_SERVICE_NAME, 'CreateUser')
  async createUser(payload: CreateUserDto) {
    return await this.userService.createUser(payload);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'GetUsers')
  async findAllUsers() {
    return await this.userService.findAllUsers();
  }

  @GrpcMethod(USER_SERVICE_NAME, 'GetUser')
  async findById(payload: GetUserByIdDto) {
    return await this.userService.findById(payload);
  }
}
