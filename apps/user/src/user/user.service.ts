import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { UserRepository } from './user.repository';
import RESPONSE_MESSAGE from '../constants/message.constant';
import { LoggerService } from 'logger';
import { UserProto } from 'protos';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: LoggerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async createUser(payload: UserProto.CreateUserRequest) {
    const newUser = await this.userRepository.create(payload);

    this.logger.log(`User created with ID: ${newUser.id}`, 'UserService');

    return {
      ...newUser,
      message: RESPONSE_MESSAGE.TASK_CREATION_SUCCESS,
    };
  }

  async findAllUsers() {
    return await this.userRepository.findAll();
  }

  async findById(payload: UserProto.GetUserRequest) {
    return this.userRepository.findOne(payload.id);
  }
}
