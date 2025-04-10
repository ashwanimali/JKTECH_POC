import { Test, TestingModule } from '@nestjs/testing';
import { PermissionService } from './permission.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { NotFoundException } from '@nestjs/common';

describe('PermissionService', () => {
  let service: PermissionService;
  let repo: Repository<Permission>;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneOrFail: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockUser = {
    id: 'user123',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    password : "password"
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionService,
        {
          provide: getRepositoryToken(Permission),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<PermissionService>(PermissionService);
    repo = module.get<Repository<Permission>>(getRepositoryToken(Permission));
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create and save a permission', async () => {
      const dto: CreatePermissionDto = {
        method: 'GET',
        url: '/test',
        role: 'Admin',
        userId: 'abc',
      };

      const created = { ...dto, createdBy: mockUser };
      mockRepo.create.mockReturnValue(created);
      mockRepo.save.mockResolvedValue({ id: '1', ...created });

      const result = await service.create(dto, mockUser);

      expect(mockRepo.create).toHaveBeenCalledWith({ ...dto, createdBy: mockUser });
      expect(mockRepo.save).toHaveBeenCalledWith(created);
      expect(result).toEqual({ id: '1', ...created });
    });
  });

  describe('findAll', () => {
    it('should return all permissions', async () => {
      const expected = [{ id: '1', method: 'GET' }];
      mockRepo.find.mockResolvedValue(expected);

      const result = await service.findAll();

      expect(mockRepo.find).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return a permission by id', async () => {
      const expected = { id: '1', method: 'POST' };
      mockRepo.findOne.mockResolvedValue(expected);

      const result = await service.findOne('1');

      expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should update and return the updated permission', async () => {
      const id = '1';
      const dto: UpdatePermissionDto = { role: 'Viewer' };
      const existing = { id, method: 'GET', role: 'Admin' };

      mockRepo.findOneOrFail.mockResolvedValue(existing);
      mockRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(id, dto, mockUser);

      expect(mockRepo.findOneOrFail).toHaveBeenCalledWith({ where: { id } });
      expect(mockRepo.update).toHaveBeenCalledWith(id, {
        ...dto,
        updatedBy: mockUser,
      });
      expect(result).toEqual({ affected: 1 });
    });

    it('should throw NotFoundException if permission not found', async () => {
      const id = '99';
      const dto: UpdatePermissionDto = { role: 'Viewer' };
      mockRepo.findOneOrFail.mockRejectedValue(new NotFoundException());

      await expect(service.update(id, dto, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete permission by id', async () => {
      const id = '1';
      mockRepo.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(id);

      expect(mockRepo.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual({ message: 'Permission deleted successfully' });
    });
  });
});
