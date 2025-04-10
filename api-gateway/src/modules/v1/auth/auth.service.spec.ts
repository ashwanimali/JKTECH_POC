import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { HashUtil } from 'src/common/utils/hash.util';

jest.mock('src/common/utils/hash.util');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    id: 'uuid-123',
    email: 'user@example.com',
    password: 'hashed-password',
    role: 'viewer',
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw if email or password is missing', async () => {
    const invalidDto: LoginUserDto = { email: '', password: '' };
    await expect(authService.login(invalidDto)).rejects.toThrow(
      new HttpException('Send Email and Password', 400),
    );
  });

  it('should throw UnauthorizedException if user not found', async () => {
    mockUsersService.findByEmail.mockResolvedValue(null);

    const dto: LoginUserDto = { email: 'wrong@example.com', password: 'pass' };

    await expect(authService.login(dto)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if password is incorrect', async () => {
    mockUsersService.findByEmail.mockResolvedValue(mockUser);
    (HashUtil.comparePasswords as jest.Mock).mockResolvedValue(false);

    const dto: LoginUserDto = { email: mockUser.email, password: 'wrongpass' };

    await expect(authService.login(dto)).rejects.toThrow(UnauthorizedException);
  });

  it('should return access_token if credentials are valid', async () => {
    mockUsersService.findByEmail.mockResolvedValue(mockUser);
    (HashUtil.comparePasswords as jest.Mock).mockResolvedValue(true);
    mockJwtService.sign.mockReturnValue('mocked-jwt-token');

    const dto: LoginUserDto = { email: mockUser.email, password: 'correctpass' };

    const result = await authService.login(dto);

    expect(mockUsersService.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(HashUtil.comparePasswords).toHaveBeenCalledWith(dto.password, mockUser.password);
    expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: mockUser.id, role: mockUser.role });
    expect(result).toEqual({ access_token: 'mocked-jwt-token' });
  });
});
