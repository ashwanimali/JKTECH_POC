import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ingestion } from './Ingestion.entity';
import { Repository } from 'typeorm';
import { CreateIngestionDto } from './dto/create-ingestion.dto';

describe('IngestionService', () => {
  let service: IngestionService;
  let repo: Repository<Ingestion>;

  const mockIngestionRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: getRepositoryToken(Ingestion),
          useValue: mockIngestionRepo,
        },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
    repo = module.get<Repository<Ingestion>>(getRepositoryToken(Ingestion));
  });

  afterEach(() => jest.clearAllMocks());

  describe('addIngestion', () => {
    it('should create and save a new ingestion record', async () => {
      const dto: CreateIngestionDto = {
        documentId: 'doc123',
        userId: 'user456',
      };

      const mockIngestion = { id: 'ing123', ...dto };

      mockIngestionRepo.create.mockReturnValue(mockIngestion);
      mockIngestionRepo.save.mockResolvedValue(mockIngestion);

      const result = await service.addIngestion(dto);

      expect(mockIngestionRepo.create).toHaveBeenCalledWith({
        documentId: dto.documentId,
        createdBy: dto.userId,
      });

      expect(mockIngestionRepo.save).toHaveBeenCalledWith(mockIngestion);
      expect(result).toEqual(mockIngestion);
    });

    it('should throw an error if saving ingestion fails', async () => {
      const dto: CreateIngestionDto = {
        documentId: 'doc123',
        userId: 'user456',
      };

      mockIngestionRepo.create.mockReturnValue(dto);
      mockIngestionRepo.save.mockRejectedValue(new Error('Save error'));

      await expect(service.addIngestion(dto)).rejects.toThrow('Save error');
    });
  });

  describe('getIngestion', () => {
    it('should return an ingestion by ID', async () => {
      const mockIngestion = {
        id: 'ing123',
        documentId: 'doc123',
        createdBy: 'user456',
      };

      mockIngestionRepo.findOne.mockResolvedValue(mockIngestion);

      const result = await service.getIngestion('ing123');

      expect(mockIngestionRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'ing123' },
      });
      expect(result).toEqual(mockIngestion);
    });

    it('should return null if ingestion not found', async () => {
      mockIngestionRepo.findOne.mockResolvedValue(null);

      const result = await service.getIngestion('nonexistent');

      expect(result).toBeNull();
    });
  });
});
