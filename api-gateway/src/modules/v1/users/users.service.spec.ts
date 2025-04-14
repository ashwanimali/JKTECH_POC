import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashUtil } from 'src/common/utils/hash.util';
import { HttpException, NotFoundException } from '@nestjs/common';

jest.mock('src/common/utils/hash.util');

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    preload: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get(getRepositoryToken(User));
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create and return a new user', async () => {
      const dto: CreateUserDto = {
        name: 'John',
        email: 'john@example.com',
        password: '123456',
        role: 'admin',
      };

      const hashedPassword = 'hashedPassword';
      (HashUtil.hashPassword as jest.Mock).mockResolvedValue(hashedPassword);

      mockRepo.findOne.mockResolvedValue(null);
      const createdUser = { ...dto, password: hashedPassword };
      mockRepo.create.mockReturnValue(createdUser);
      mockRepo.save.mockResolvedValue(createdUser);

      const result = await service.create(dto);

      expect(HashUtil.hashPassword).toHaveBeenCalledWith(dto.password);
      expect(repo.create).toHaveBeenCalledWith({ ...dto, password: hashedPassword });
      expect(repo.save).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(createdUser);
    });

    it('should throw if user already exists', async () => {
      const dto: CreateUserDto = {
        name: 'John',
        email: 'john@example.com',
        password: '123456',
        role: 'admin',
      };

      mockRepo.findOne.mockResolvedValue({ email: dto.email });

      await expect(service.create(dto)).rejects.toThrow(HttpException);
    });

    it('should throw if password, name, or email is missing', async () => {
      await expect(service.create({} as any)).rejects.toThrow('Password is required');
      await expect(service.create({ password: 'x' } as any)).rejects.toThrow('Name is required');
      await expect(service.create({ name: 'x', password: 'x' } as any)).rejects.toThrow('Email is required');
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ id: '1', name: 'Test', email: 'test@example.com' }];
      mockRepo.find.mockResolvedValue(users);
      expect(await service.findAll()).toEqual(users);
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      const user = { id: '1', email: 'test@example.com' };
      mockRepo.findOne.mockResolvedValue(user);
      expect(await service.findByEmail('test@example.com')).toEqual(user);
    });
  });

  describe('findByRole', () => {
    it('should return user by role', async () => {
      const user = { id: '1', role: 'admin' };
      mockRepo.findOne.mockResolvedValue(user);
      expect(await service.findByRole('admin')).toEqual(user);
    });
  });

  describe('findById', () => {
    it('should return user by ID', async () => {
      const user = { id: '1', name: 'Test' };
      mockRepo.findOne.mockResolvedValue(user);
      expect(await service.findById('1')).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      const dto: UpdateUserDto = { name: 'Updated Name' };
      const user = { id: '1', name: 'Old Name' };
      const updatedUser = { id: '1', ...dto };

      mockRepo.preload.mockResolvedValue(updatedUser);
      mockRepo.save.mockResolvedValue(updatedUser);

      const result = await service.update('1', dto, {});
      expect(repo.preload).toHaveBeenCalledWith({ id: '1', ...dto });
      expect(repo.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepo.preload.mockResolvedValue(null);
      await expect(service.update('1', {}, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete user and return message', async () => {
      const user = { id: '1' };
      mockRepo.findOne.mockResolvedValue(user);

      const result = await service.delete('1');
      expect(repo.delete).toHaveBeenCalledWith('1');
      expect(result).toEqual({ message: `User with ID 1 successfully deleted` });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.delete('123')).rejects.toThrow(NotFoundException);
    });
  });
});
