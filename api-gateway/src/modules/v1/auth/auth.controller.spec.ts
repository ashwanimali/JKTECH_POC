import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call AuthService.login with the correct DTO and return result', async () => {
    const loginDto: LoginUserDto = {
      email: 'test@example.com',
      password: 'securepassword',
    };

    const mockResponse = {
      accessToken: 'jwt-token',
      user: { id: 'uuid', email: loginDto.email, name: 'Test User' },
    };

    mockAuthService.login.mockResolvedValue(mockResponse);

    const result = await controller.login(loginDto);

    expect(authService.login).toHaveBeenCalledWith(loginDto);
    expect(result).toEqual(mockResponse);
  });
});
