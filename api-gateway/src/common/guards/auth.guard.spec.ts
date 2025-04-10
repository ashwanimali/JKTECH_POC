import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/modules/v1/users/users.entity';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;
  let userRepository: Repository<User>;

  const mockUser: User = {
    id: 'c0a8012e-bbbc-42f3-99a0-61f8cfd4f8fa',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedpassword',
    role: 'admin',
    createdById: undefined,
  };

  const mockJwtService = {
    verify: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockExecutionContext = (token: string) => ({
    switchToHttp: () => ({
      getRequest: () => ({
        headers: { authorization: token },
      }),
    }),
  }) as unknown as ExecutionContext;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthGuard,
        { provide: JwtService, useValue: mockJwtService },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    authGuard = moduleRef.get(AuthGuard);
    jwtService = moduleRef.get(JwtService);
    userRepository = moduleRef.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should allow access with valid token and user', async () => {
    const token = 'valid-token';
    const payload = { sub: mockUser.id };

    mockJwtService.verify.mockReturnValue(payload);
    mockUserRepository.findOne.mockResolvedValue(mockUser);

    const context = mockExecutionContext(`Bearer ${token}`);
    const result = await authGuard.canActivate(context);

    expect(result).toBe(true);
    expect(mockJwtService.verify).toHaveBeenCalledWith(token);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: payload.sub } });
  });

  it('should throw UnauthorizedException if token is missing', async () => {
    const context = mockExecutionContext('');

    await expect(authGuard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    mockJwtService.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const context = mockExecutionContext('Bearer invalid-token');
    await expect(authGuard.canActivate(context)).rejects.toThrow('Invalid/Expired token');
  });

  it('should throw UnauthorizedException if user not found', async () => {
    const token = 'valid-token';
    const payload = { sub: 'non-existent-user-id' };

    mockJwtService.verify.mockReturnValue(payload);
    mockUserRepository.findOne.mockResolvedValue(null);

    const context = mockExecutionContext(`Bearer ${token}`);
    await expect(authGuard.canActivate(context)).rejects.toThrow('User not found');
  });

  it('should return null if Authorization header format is incorrect', () => {
    const result = (authGuard as any).extractTokenFromHeader({
      headers: { authorization: 'Token something-wrong' },
    });
    expect(result).toBeNull();
  });

  it('should return token if Authorization header is valid', () => {
    const result = (authGuard as any).extractTokenFromHeader({
      headers: { authorization: 'Bearer real-token' },
    });
    expect(result).toBe('real-token');
  });
});
