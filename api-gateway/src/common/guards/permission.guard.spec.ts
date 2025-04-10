import { PermissionGuard } from './permission.guard';
import { ClsService } from 'nestjs-cls';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PermissionFactory } from 'src/factories/permission.factory';
import { User } from 'src/modules/v1/users/users.entity';
import { Request } from 'express';

describe('PermissionGuard', () => {
  let guard: PermissionGuard;
  let clsService: ClsService;
  let permissionFactory: PermissionFactory;

  const mockUser: User = {
    id: 'abc-123-uuid',
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'hashed',
    role: 'editor',
    createdById: undefined,
  };

  const mockRequest = {
    method: 'GET',
    url: '/documents',
    headers: {},
  } as Request;

  const createMockContext = (): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    }) as unknown as ExecutionContext;

  beforeEach(() => {
    clsService = {
      get: jest.fn(),
    } as any;

    permissionFactory = {
      hasPermission: jest.fn(),
    } as any;

    guard = new PermissionGuard(clsService, permissionFactory);
  });

  it('should allow access if user has permission', async () => {
    (clsService.get as jest.Mock).mockReturnValue(mockUser);
    (permissionFactory.hasPermission as jest.Mock).mockResolvedValue(true);

    const result = await guard.canActivate(createMockContext());

    expect(result).toBe(true);
    expect(permissionFactory.hasPermission).toHaveBeenCalledWith(mockUser, mockRequest);
  });

  it('should deny access if user lacks permission', async () => {
    (clsService.get as jest.Mock).mockReturnValue(mockUser);
    (permissionFactory.hasPermission as jest.Mock).mockResolvedValue(false);

    const result = await guard.canActivate(createMockContext());

    expect(result).toBe(false);
    expect(permissionFactory.hasPermission).toHaveBeenCalledWith(mockUser, mockRequest);
  });

  it('should throw UnauthorizedException if no user in context', async () => {
    (clsService.get as jest.Mock).mockReturnValue(undefined);

    await expect(guard.canActivate(createMockContext())).rejects.toThrow(
      new UnauthorizedException('User not found in context'),
    );
  });
});
