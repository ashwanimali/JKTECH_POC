import { Controller, Get, Post, Delete, Param, UseInterceptors, UploadedFile, UseGuards, Req, StreamableFile, Put } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { PermissionGuard } from 'src/common/guards/permission.guard';

@Controller('documents')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    @Post()
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        description: "Upload A document",
        schema: {
            type: "object",
            properties: {
                files: {
                    type: "file",
                    format: "binary",
                },
            },
        },
    })
    @UseGuards(AuthGuard, PermissionGuard)
    @UseInterceptors(FileInterceptor("document"))

    async createDocument(@UploadedFile() file: any, @Req() req: any) {
        const newDocument = await this.documentsService.create(file, req);

        return {
            message: "Document is created",
            document: {
                id: newDocument.id,
            },
        };
    }

    @Get(":id")
    @ApiBearerAuth()
    async getDocumentById(@Param("id") id: string) {
        const stream = await this.documentsService.getDocument(id);

        return new StreamableFile(stream);
    }

    @Put(":id")
    @ApiBearerAuth()
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        description: "Upload a new document to update",
        schema: {
            type: "object",
            properties: {
                files: {
                    type: "file",
                    format: "binary",
                },
            },
        },
    })
    @UseGuards(AuthGuard, PermissionGuard)
    @UseInterceptors(FileInterceptor("document"))
    async updateDocument(
        @Param("id") id: string,
        @UploadedFile() document: any,
        @Req() req: any
    ) {
        await this.documentsService.update(id, document,req);

        return {
            message: "Document updated",
        };
    }

    @Get()
    @ApiBearerAuth()
    @UseGuards(AuthGuard, PermissionGuard)
    async getAllDocument() {
      return this.documentsService.findAll();
    }

    @ApiBearerAuth()
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.documentsService.remove(id);
    }
}
