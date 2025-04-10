import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { Document } from '../documents/entities/document.entity';
import { ClsService } from 'nestjs-cls';
import { of } from 'rxjs';
import { CreateIngestionDto } from './dto/create-ingestion.dto';

describe('IngestionService', () => {
  let service: IngestionService;

  const mockUserRepo = {
    findOneByOrFail: jest.fn(),
  };

  const mockDocumentRepo = {
    findOneByOrFail: jest.fn(),
  };

  const mockClientProxy = {
    send: jest.fn(),
  };

  const mockClsService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: getRepositoryToken(Document), useValue: mockDocumentRepo },
        { provide: 'INGESTION_SERVICE', useValue: mockClientProxy },
        { provide: ClsService, useValue: mockClsService },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('addIngestion', () => {
    it('should send add.ingestion message with userId', async () => {
      const dto: CreateIngestionDto = { documentId: 'doc123' };
      const mockResponse = { ingestion: { id: 'ing123' } };

      mockClsService.get.mockReturnValue('user123');
      mockClientProxy.send.mockReturnValue(of(mockResponse));

      const result = await service.addIngestion(dto);

      expect(mockClsService.get).toHaveBeenCalledWith('authUser.id');
      expect(mockClientProxy.send).toHaveBeenCalledWith('add.ingestion', {
        userId: 'user123',
        documentId: 'doc123',
        type: 'TYPE',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findIngestionById', () => {
    it('should return ingestion details with document and user info', async () => {
      const mockIngestionResponse = {
        ingestion: {
          id: 'ing123',
          documentId: 'doc123',
          userId: 'user123',
          status: 'COMPLETED',
        },
      };

      const mockUser = { id: 'user123', name: 'Test User', email: 'test@example.com' };
      const mockDocument = { id: 'doc123', originalName: 'file.pdf' };

      mockClientProxy.send.mockReturnValue(of(mockIngestionResponse));
      mockUserRepo.findOneByOrFail.mockResolvedValue(mockUser);
      mockDocumentRepo.findOneByOrFail.mockResolvedValue(mockDocument);

      const result = await service.findIngestionById('ing123');

      expect(mockClientProxy.send).toHaveBeenCalledWith('get.ingestion', 'ing123');
      expect(result).toEqual({
        id: 'ing123',
        document: {
          id: 'doc123',
          name: 'file.pdf',
        },
        user: {
          id: 'user123',
          name: 'Test User',
          email: 'test@example.com',
        },
        status: 'COMPLETED',
      });
    });
  });
});
