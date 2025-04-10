import { Test, TestingModule } from '@nestjs/testing';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

describe('PermissionController', () => {
  let controller: PermissionController;
  let service: PermissionService;

  const mockPermissionService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = { id: 'user123', name: 'Test User' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionController],
      providers: [
        {
          provide: PermissionService,
          useValue: mockPermissionService,
        },
      ],
    }).compile();

    controller = module.get<PermissionController>(PermissionController);
    service = module.get<PermissionService>(PermissionService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should call service.create with dto and user', async () => {
      const dto: CreatePermissionDto = {
        userId: 'abc123',
        method: 'GET',
        url: '/test',
        role: 'Admin',
      };

      const expectedResult = { id: 1, ...dto, createdBy: mockUser };
      mockPermissionService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(dto, { user: mockUser });

      expect(service.create).toHaveBeenCalledWith(dto, mockUser);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return all permissions', async () => {
      const expected = [{ id: 1, method: 'GET' }];
      mockPermissionService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return a permission by id', async () => {
      const id = '1';
      const expected = { id: 1, method: 'POST' };
      mockPermissionService.findOne.mockResolvedValue(expected);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should update a permission', async () => {
      const id = '1';
      const dto: UpdatePermissionDto = { role: 'Viewer' };
      const expected = { id: 1, role: 'Viewer' };

      mockPermissionService.update.mockResolvedValue(expected);

      const result = await controller.update(id, dto, { user: mockUser });

      expect(service.update).toHaveBeenCalledWith(id, dto, mockUser);
      expect(result).toEqual(expected);
    });
  });

  describe('remove', () => {
    it('should remove a permission', async () => {
      const id = '1';
      const expected = { success: true };
      mockPermissionService.remove.mockResolvedValue(expected);

      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(expected);
    });
  });
});
