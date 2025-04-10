import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { createReadStream } from 'fs';
import { rm } from 'fs/promises';
import * as path from 'path';
import * as constantUtils from 'src/common/utils/constant';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  createReadStream: jest.fn().mockReturnValue('mockStream'),
}));

jest.mock('fs/promises', () => ({
  rm: jest.fn(),
}));

jest.mock('src/common/utils/constant', () => ({
  getSizeOfDocument: jest.fn(),
}));

describe('DocumentsService', () => {
  let service: DocumentsService;
  let repo: any;

  const mockRepo = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('/mock/uploads'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        { provide: getRepositoryToken(Document), useValue: mockRepo },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    repo = module.get(getRepositoryToken(Document));
  });

  afterEach(() => jest.clearAllMocks());

  it('should create a new document', async () => {
    const mockFile = {
      originalname: 'file.txt',
      filename: 'file-uuid.txt',
      mimetype: 'text/plain',
    };
    const req = { user: { id: 'user-1' } };
    mockRepo.save.mockResolvedValue({ id: '1', ...mockFile });

    const result = await service.create(mockFile, req);

    expect(mockRepo.save).toHaveBeenCalled();
    expect(result).toMatchObject({ id: '1', originalName: 'file.txt' });
  });

  it('should return all documents with sizes', async () => {
    const mockDocs = [
      { id: '1', name: 'doc1.txt', originalName: 'doc1.txt' },
    ];
    mockRepo.find.mockResolvedValue(mockDocs);
    (constantUtils.getSizeOfDocument as jest.Mock).mockResolvedValue(1234);

    const result = await service.findAll();

    expect(mockRepo.find).toHaveBeenCalled();
    expect(result).toEqual([
      { id: '1', name: 'doc1.txt', size: 1234 },
    ]);
  });

  it('should get a document as stream', async () => {
    const doc = { id: '1', name: 'doc1.txt' };
    mockRepo.findOne.mockResolvedValue(doc);

    const stream = await service.getDocument('1');

    expect(stream).toBe('mockStream');
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('should throw NotFoundException if document not found', async () => {
    mockRepo.findOne.mockResolvedValue(null);

    await expect(service.getDocument('99')).rejects.toThrow(NotFoundException);
  });

  it('should update a document and delete the previous one', async () => {
    const oldDoc = { id: '1', name: 'old.txt' };
    const newFile = {
      originalname: 'new.txt',
      filename: 'new-file.txt',
      mimetype: 'text/plain',
      path: '/tmp/new-file.txt',
    };
    mockRepo.findOne.mockResolvedValue(oldDoc);
    mockRepo.save.mockResolvedValue({ ...oldDoc, ...newFile });

    await service.update('1', newFile, { id: 'user-1' });

    expect(mockRepo.save).toHaveBeenCalled();
    expect(rm).toHaveBeenCalledWith(path.join('/mock/uploads', 'old.txt'));
  });

  it('should remove a document and delete the file', async () => {
    const doc = { id: '1', name: 'todelete.txt' };
    mockRepo.findOne.mockResolvedValue(doc);

    await service.remove('1');

    expect(rm).toHaveBeenCalledWith(path.join('/mock/uploads', 'todelete.txt'));
    expect(mockRepo.remove).toHaveBeenCalledWith(doc);
  });
});
