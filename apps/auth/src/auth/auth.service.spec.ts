import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { LoggerService } from 'logger';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { status } from '@grpc/grpc-js';
import { CustomGrpcException, CustomError } from 'error';
import RESPONSE_MESSAGE from '../constants/message.constant';

const mockAuthRepository = {
  findOneByEmail: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
  decode: jest.fn(),
};

const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
};

const mockLoggerService = {
  debug: jest.fn(),
};

const mockConfigService = {
  get: jest.fn(),
};

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedpassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AuthRepository, useValue: mockAuthRepository },
        { provide: JwtService, useValue: mockJwtService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('createAuthUser', () => {
    it('should create a new user', async () => {
      const payload = { email: 'test@test.com', password: 'password', role: 'USER' };
      mockAuthRepository.findOneByEmail.mockResolvedValue(null);
      mockAuthRepository.create.mockResolvedValue({
        id: '1',
        email: payload.email,
        isActive: true,
      });

      const result = await service.createAuthUser(payload);

      expect(result).toEqual({
        message: RESPONSE_MESSAGE.USER_CREATION_SUCCESS,
        id: '1',
        email: payload.email,
        isActive: true,
      });
    });

    it('should throw if user exists', async () => {
      const payload = { email: 'test@test.com', password: 'password', role: 'USER' };
      mockAuthRepository.findOneByEmail.mockResolvedValue({
        id: '1',
        email: payload.email,
      });

      await expect(service.createAuthUser(payload)).rejects.toThrow(
        new CustomGrpcException(
          RESPONSE_MESSAGE.USER_ALREADY_EXISTS,
          { email: payload.email },
          status.ALREADY_EXISTS
        )
      );
    });
  });

  describe('validateAuth', () => {
    const payload = { email: 'test@test.com', password: 'password' };
    const mockUser = {
      id: '1',
      email: payload.email,
      isActive: true,
      password: 'hashed_password',
      role: 'USER',
    };

    it('should return user if valid', async () => {
      mockAuthRepository.findOneByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.validateAuth(payload);
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        isActive: mockUser.isActive,
        role: mockUser.role,
      });
    });

    it('should throw error if user not found', async () => {
      mockAuthRepository.findOneByEmail.mockResolvedValue(null);

      await expect(service.validateAuth(payload)).rejects.toThrow(
        new CustomGrpcException(
          RESPONSE_MESSAGE.USER_NOT_FOUND,
          { email: payload.email },
          status.NOT_FOUND
        )
      );
    });

    it('should throw error if user inactive', async () => {
      mockAuthRepository.findOneByEmail.mockResolvedValue({
        ...mockUser,
        isActive: false,
      });

      await expect(service.validateAuth(payload)).rejects.toThrow(
        new CustomGrpcException(
          RESPONSE_MESSAGE.USER_NOT_ACTIVE,
          { email: payload.email },
          status.PERMISSION_DENIED
        )
      );
    });

    it('should throw error for invalid password', async () => {
      mockAuthRepository.findOneByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.validateAuth(payload)).rejects.toThrow(
        new CustomGrpcException(
          RESPONSE_MESSAGE.INVALID_LOGIN,
          { email: payload.email },
          status.UNAUTHENTICATED
        )
      );
    });
  });

  describe('login', () => {
  const payload = { email: 'test@test.com', password: 'password' , role: 'USER' };
  const authUser = { id: '1', email: payload.email, isActive: true, role: 'USER' };
  const token = 'generated_token';

  beforeEach(() => {
    jest.spyOn(service, 'validateAuth').mockResolvedValue(authUser);
    mockJwtService.sign.mockReturnValue(token);
    mockConfigService.get.mockReturnValue(3600);
  });

  it('should return token on success', async () => {
    const result = await service.login(payload);
    
    expect(service.validateAuth).toHaveBeenCalledWith(payload);

    expect(mockCacheManager.set).toHaveBeenCalledWith(
      `auth:${authUser.id}`,
      token,
      3600
    );
    expect(result).toEqual({
      message: RESPONSE_MESSAGE.LOGIN_SUCCESS,
      token,
    });
  });
});

describe('validateJwtToken', () => {
  const token = 'valid_token';
  const decoded = { id: '1', email: 'test@test.com' };

  it('should validate token successfully', async () => {
    mockCacheManager.get.mockImplementation(key => 
      key === `blacklist:${token}` ? null : token
    );
    mockJwtService.verify.mockReturnValue(decoded);
    
    const result = await service.validateJwtToken(token);
    expect(result).toEqual({ id: decoded.id, email: decoded.email });
  });

  it('should throw for blacklisted token', async () => {
    mockCacheManager.get.mockResolvedValue('true'); 
    
    await expect(service.validateJwtToken(token)).rejects.toThrow(
      new CustomError(
        RESPONSE_MESSAGE.INVALID_TOKEN,
        status.UNAUTHENTICATED,
        { message: RESPONSE_MESSAGE.INVALID_TOKEN }
      )
    );
  });

  it('should throw for token mismatch', async () => {
    mockCacheManager.get.mockImplementation(key => 
      key === `auth:${decoded.id}` ? 'different_token' : null
    );
    mockJwtService.verify.mockReturnValue(decoded);
    
    await expect(service.validateJwtToken(token)).rejects.toThrow(
      new CustomError(
        RESPONSE_MESSAGE.INVALID_TOKEN,
        status.UNAUTHENTICATED,
        { message: RESPONSE_MESSAGE.INVALID_TOKEN }
      )
    );
  });
});

describe('logout', () => {
  it('should blacklist token and clear cache', async () => {
    const payload = { id: '1', token: 'logout_token' };
    const decoded = { exp: Math.floor(Date.now() / 1000) + 3600 }; // 1hr valid
    mockJwtService.decode.mockReturnValue(decoded);

    await service.logout(payload);
    
    expect(mockCacheManager.set).toHaveBeenCalledWith(
      `blacklist:${payload.token}`,
      'true',
      expect.any(Number)
    );
    expect(mockCacheManager.del).toHaveBeenCalledWith(`auth:${payload.id}`);
  });
});


});
