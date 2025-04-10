import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { CreateIngestionDto } from './dto/create-ingestion.dto';

describe('IngestionController', () => {
  let controller: IngestionController;
  let service: IngestionService;

  const mockIngestionService = {
    addIngestion: jest.fn(),
    getIngestion: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        {
          provide: IngestionService,
          useValue: mockIngestionService,
        },
      ],
    }).compile();

    controller = module.get<IngestionController>(IngestionController);
    service = module.get<IngestionService>(IngestionService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('addIngestion', () => {
    it('should return a message and the created ingestion', async () => {
      const dto: CreateIngestionDto = {
        documentId: 'doc123',
        userId : "user123"
      };

      const ingestionResult = { id: '1', ...dto };

      mockIngestionService.addIngestion.mockResolvedValue(ingestionResult);

      const result = await controller.addIngestion(dto);

      expect(service.addIngestion).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        message: 'Successfully added',
        ingestion: ingestionResult,
      });
    });
  });

  describe('getIngestion', () => {
    it('should return a message and the fetched ingestion', async () => {
      const ingestionResult = {
        id: 'ing123',
        documentId: 'doc123',
        content: 'Sample content',
        metadata: { source: 'test' },
      };

      mockIngestionService.getIngestion.mockResolvedValue(ingestionResult);

      const result = await controller.getIngestion('ing123');

      expect(service.getIngestion).toHaveBeenCalledWith('ing123');
      expect(result).toEqual({
        message: 'Successfully fetched',
        ingestion: ingestionResult,
      });
    });
  });
});
