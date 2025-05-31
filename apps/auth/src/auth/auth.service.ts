import { Inject, Injectable } from '@nestjs/common';
import { Auth } from './auth.entity';
import * as bcrypt from 'bcrypt';
import { status } from '@grpc/grpc-js';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { CustomError, CustomGrpcException } from 'error';
import RESPONSE_MESSAGE from '../constants/message.constant';
import { LoggerService } from 'logger';
import { ConfigService } from '@nestjs/config';
import { AuthProto } from 'protos';
import { RouterModule } from '@nestjs/core';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService,
    private  readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async createAuthUser(payload: AuthProto.CreateAuthUserRequest) {
    // Check if auth already exists
    const existingAuthUser = await this.authRepository.findOneByEmail(
      payload.email
    );

    if (existingAuthUser) {
      throw new CustomGrpcException(
        RESPONSE_MESSAGE.USER_ALREADY_EXISTS,
        {
          email: payload.email,
        },
        status.ALREADY_EXISTS
      );
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const newAuth = await this.authRepository.create({
      ...payload,
      password: hashedPassword,
      isActive: true,
    });

    return {
      message: RESPONSE_MESSAGE.USER_CREATION_SUCCESS,
      id: newAuth.id,
      email: newAuth.email,
      isActive: newAuth.isActive,
    };
  }

  async validateAuth(payload: {
    email: string;
    password: string;
  }): Promise<Pick<Auth, 'id' | 'email' | 'role' | 'isActive'>> {
    // Check if auth exists
    const existingAuth = await this.authRepository.findOneByEmail(
      payload.email
    );

    if (!existingAuth) {
      throw new CustomGrpcException(
        RESPONSE_MESSAGE.USER_NOT_FOUND,
        {
          email: payload.email,
        },
        status.NOT_FOUND
      );
    }

    // Check if auth is active
    if (!existingAuth.isActive) {
      throw new CustomGrpcException(
        RESPONSE_MESSAGE.USER_NOT_ACTIVE,
        {
          email: payload.email,
        },
        status.PERMISSION_DENIED
      );
    }

    // Validate password

    const isValidPassword = await bcrypt.compare(
      payload.password,
      existingAuth.password
    );

    if (!isValidPassword) {
      throw new CustomGrpcException(
        RESPONSE_MESSAGE.INVALID_LOGIN,
        {
          email: payload.email,
        },
        status.UNAUTHENTICATED
      );
    }

    return {
      id: existingAuth.id,
      email: existingAuth.email,
      isActive: existingAuth.isActive,
      role: existingAuth.role,
    };
  }

  async login(payload: { email: string; password: string }) {
    this.logger.debug('logging auth' + payload.email);

    const ttl = this.configService.get<number>('REDIS_DEFAULT_TTL') || 3600; // Default to 1 hour if not set
    const auth = await this.validateAuth(payload);

    this.logger.debug('gotten  auth' + payload.email);

    // Generate JWT token

    const token = this.jwtService.sign({
      email: auth.email,
      id: auth.id,
      role: auth.role
    });

    this.logger.debug(`set key.... auth:${auth.id}`);

    await this.cacheManager.set(`auth:${auth.id}`, token, ttl);

    return {
      message: RESPONSE_MESSAGE.LOGIN_SUCCESS,
      token,
    };
  }

  async validateJwtToken(token: string) {
    try {
      if (await this.isTokenBlacklisted(token)) {
         throw new CustomError(
          RESPONSE_MESSAGE.INVALID_TOKEN,
          status.UNAUTHENTICATED,
          { message: RESPONSE_MESSAGE.INVALID_TOKEN }
        );
      }

      const auth = this.jwtService.verify(token);

      this.logger.debug(`get key.... auth:${auth.id}`);

      const cachedToken = await this.cacheManager.get(`auth:${auth.id}`);


      if (cachedToken !== token) {
        throw new CustomError(
          RESPONSE_MESSAGE.INVALID_TOKEN,
          status.UNAUTHENTICATED,
          { message: RESPONSE_MESSAGE.INVALID_TOKEN }
        );
      }

      return {
        id: auth.id,
        email: auth.email,
        role: auth.role,
      };
    } catch (error) {
      throw new CustomGrpcException(
        error.message,
        {},
        status.PERMISSION_DENIED
      );
    }
  }

  async logout(payload: { id: string; token: string }) {
    const decodedToken = this.jwtService.decode(payload.token);
    const expiresIn = decodedToken['exp'] - Math.floor(Date.now() / 1000);

    this.logger.debug('token is meant to expire in ' + expiresIn);

    if (expiresIn > 0) {
      await this.cacheManager.set(
        `blacklist:${payload.token}`,
        'true',
        expiresIn * 1000
      );
    }

    await this.cacheManager.del(`auth:${payload.id}`);
  }

  private async isTokenBlacklisted(token: string): Promise<boolean> {
    const isBlacklisted = await this.cacheManager.get(`blacklist:${token}`);
    return !!isBlacklisted;
  }
}
