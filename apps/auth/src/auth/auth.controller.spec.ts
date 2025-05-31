import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';


describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthService = {
    createAuthUser: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    validateJwtToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createAuth', () => {
    const payload = { email: 'test@test.com', password: 'password', role : 'USER' };
    const expectedResult = {
      message: 'User created successfully',
      id: '1',
      email: 'test@test.com',
      isActive: true,
    };

    it('should call createAuthUser with payload', async () => {
      mockAuthService.createAuthUser.mockResolvedValue(expectedResult);

      const result = await controller.createAuth(payload);

      expect(mockAuthService.createAuthUser).toHaveBeenCalledWith(payload);
      expect(result).toEqual(expectedResult);
    });

    it('should handle errors from service', async () => {
      const error = new Error('Service error');
      mockAuthService.createAuthUser.mockRejectedValue(error);

      await expect(controller.createAuth(payload)).rejects.toThrow(error);
    });
  });

  describe('login', () => {
    const payload = { email: 'test@test.com', password: 'password' };
    const expectedResult = {
      message: 'Login successful',
      token: 'jwt_token',
    };

    it('should call login with payload', async () => {
      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(payload);

      expect(mockAuthService.login).toHaveBeenCalledWith(payload);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('logout', () => {
    const payload = { id: '1', token: 'jwt_token' };
    const expectedResult = undefined;

    it('should call logout with payload', async () => {
      mockAuthService.logout.mockResolvedValue(expectedResult);

      const result = await controller.logout(payload);

      expect(mockAuthService.logout).toHaveBeenCalledWith(payload);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getProfile (ValidateAuthToken)', () => {
    const payload = { token: 'valid_token' };
    const expectedResult = {
      id: '1',
      email: 'test@test.com',
    };

    it('should call validateJwtToken with token', async () => {
      mockAuthService.validateJwtToken.mockResolvedValue(expectedResult);

      const result = await controller.getProfile(payload);

      expect(mockAuthService.validateJwtToken).toHaveBeenCalledWith(
        payload.token
      );
      expect(result).toEqual(expectedResult);
    });
  });

  
});
