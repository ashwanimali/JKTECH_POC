import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { StreamableFile } from '@nestjs/common';

describe('DocumentsController', () => {
  let controller: DocumentsController;
  let service: DocumentsService;

  const mockDocument = {
    id: 'doc-123',
    filename: 'test.pdf',
    buffer: Buffer.from('file content'),
  };

  const mockDocumentsService = {
    create: jest.fn(),
    getDocument: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        { provide: DocumentsService, useValue: mockDocumentsService },
      ],
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController);
    service = module.get<DocumentsService>(DocumentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a document', async () => {
    mockDocumentsService.create.mockResolvedValue(mockDocument);

    const result = await controller.createDocument(mockDocument, { user: { id: 'user-1' } });

    expect(service.create).toHaveBeenCalledWith(mockDocument, { user: { id: 'user-1' } });
    expect(result).toEqual({
      message: 'Document is created',
      document: {
        id: 'doc-123',
      },
    });
  });

  it('should get a document by id', async () => {
    mockDocumentsService.getDocument.mockResolvedValue(mockDocument.buffer);

    const result = await controller.getDocumentById('doc-123');

    expect(service.getDocument).toHaveBeenCalledWith('doc-123');
    expect(result).toBeInstanceOf(StreamableFile);
  });

  it('should update a document', async () => {
    mockDocumentsService.update.mockResolvedValue(undefined);

    const result = await controller.updateDocument(
      'doc-123',
      mockDocument,
      { user: { id: 'user-1' } },
    );

    expect(service.update).toHaveBeenCalledWith('doc-123', mockDocument, { user: { id: 'user-1' } });
    expect(result).toEqual({ message: 'Document updated' });
  });

  it('should get all documents', async () => {
    const mockDocs = [mockDocument];
    mockDocumentsService.findAll.mockResolvedValue(mockDocs);

    const result = await controller.getAllDocument();

    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockDocs);
  });

  it('should delete a document by id', async () => {
    mockDocumentsService.remove.mockResolvedValue({ message: 'Deleted' });

    const result = await controller.remove('doc-123');

    expect(service.remove).toHaveBeenCalledWith('doc-123');
    expect(result).toEqual({ message: 'Deleted' });
  });
});
