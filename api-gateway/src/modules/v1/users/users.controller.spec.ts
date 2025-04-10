import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should call service.create with correct DTO', async () => {
      const dto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        role: 'admin',
      };

      const createdUser = {
        id: '1',
        ...dto,
      };

      mockUsersService.create.mockResolvedValue({
        message: 'User Created',
        user: createdUser,
      });

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        message: 'User Created',
        user: createdUser,
      });
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        { id: '1', name: 'John', email: 'john@example.com', role: 'admin' },
      ];

      mockUsersService.findAll.mockResolvedValue({
        message: 'User Fetched Successfully',
        user: users,
      });

      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'User Fetched Successfully',
        user: users,
      });
    });
  });

  describe('update', () => {
    it('should update the user', async () => {
      const id = '1';
      const dto: UpdateUserDto = {
        name: 'Jane Doe',
        role: 'viewer',
      };

      const updatedUser = {
        id,
        name: 'Jane Doe',
        email: 'john@example.com',
        role: 'viewer',
      };

      mockUsersService.update.mockResolvedValue({
        message: 'User Updated Successfully',
        user: updatedUser,
      });

      const result = await controller.update(id, dto);
      expect(service.update).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual({
        message: 'User Updated Successfully',
        user: updatedUser,
      });
    });
  });

  describe('delete', () => {
    it('should delete the user', async () => {
      const id = '1';
      const deletedUser = {
        id,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
      };

      mockUsersService.delete.mockResolvedValue({
        message: 'User Deleted Successfully',
        user: deletedUser,
      });

      const result = await controller.delete(id);
      expect(service.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual({
        message: 'User Deleted Successfully',
        user: deletedUser,
      });
    });
  });
});
