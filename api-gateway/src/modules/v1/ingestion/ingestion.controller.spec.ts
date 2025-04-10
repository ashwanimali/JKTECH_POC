import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { CreateIngestionDto } from './dto/create-ingestion.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { PermissionGuard } from 'src/common/guards/permission.guard';

describe('IngestionController', () => {
  let controller: IngestionController;
  let service: IngestionService;

  const mockIngestionService = {
    addIngestion: jest.fn(),
    findIngestionById: jest.fn(),
  };

  const createDto: CreateIngestionDto = {
    documentId: '123'
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        { provide: IngestionService, useValue: mockIngestionService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<IngestionController>(IngestionController);
    service = module.get<IngestionService>(IngestionService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should call ingestionService.addIngestion with dto', async () => {
      const mockResult = { id: 'abc123', ...createDto };
      mockIngestionService.addIngestion.mockResolvedValue(mockResult);

      const result = await controller.create(createDto);

      expect(service.addIngestion).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findOne()', () => {
    it('should return ingestion by ID', async () => {
      const mockIngestion = { id: 'abc123', documentId: '123', type: 'mockType' };
      mockIngestionService.findIngestionById.mockResolvedValue(mockIngestion);

      const result = await controller.findOne('abc123');

      expect(service.findIngestionById).toHaveBeenCalledWith('abc123');
      expect(result).toEqual(mockIngestion);
    });
  });
});
