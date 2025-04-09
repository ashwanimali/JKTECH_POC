import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { createReadStream } from 'fs';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { rm } from 'fs/promises';
import { getSizeOfDocument } from "src/common/utils/constant";
@Injectable()
export class DocumentsService {
    constructor(
        @InjectRepository(Document)
        private readonly documentRepository: Repository<Document>,
        private readonly configService: ConfigService,
    ) { }

    async create(file: any, req: any) {
        try {
            const newDocument = new Document();
            newDocument.originalName = file.originalname;
            newDocument.name = file.filename;
            newDocument.createdBy = req.user
            newDocument.mimeType = file.mimetype;
            return await this.documentRepository.save(newDocument);
        } catch (error) {
            throw error;
        }
    }

    async findAll() {
        const documents = await this.documentRepository.find();
        return Promise.all(
          documents.map(async (document) => {
            const size = await getSizeOfDocument(
              join(this.configService.get("upload.path") as string, document.name),
            );
            return {
              id: document.id,
              name: document.originalName,
              size
            };
          }),
        );
    }

    async getDocument(id: string) {
        const document = await this.findOne(id);
        // get read stream from the file system
        const readStream = createReadStream(
            join(this.configService.get("upload.path") as string, document.name),
        );
        return readStream;
    }

    async findOne(id: string) {
        const document = await this.documentRepository.findOne({ where: { id } });
        if (!document) {
            throw new NotFoundException(`Document with ID ${id} not found`);
        }
        return document;
    }

    async update(id: string, file: any, user: any) {
        const previousDocument = await this.findOne(id);
        const documentToDelete = previousDocument.name;
        previousDocument.originalName = file.originalname;
        previousDocument.name = file.filename;
        previousDocument.mimeType = file.mimetype;
        previousDocument.updatedBy = user
        try {
            await this.documentRepository.save(previousDocument);
            await rm(
                join(this.configService.get("upload.path") as string, documentToDelete),
            );
        } catch (error) {
            await rm(file.path);
            throw error;
        }
    }

    async remove(id: string) {
        const document = await this.findOne(id);
        await rm(
            join(this.configService.get("upload.path") as string, document.name),
        );
        await this.documentRepository.remove(document);
    }
}
