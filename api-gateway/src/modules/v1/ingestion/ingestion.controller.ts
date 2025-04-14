import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags, ApiResponse, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "src/common/guards/auth.guard";
import { PermissionGuard } from "src/common/guards/permission.guard";

import { CreateIngestionDto } from "./dto/create-ingestion.dto";
import { IngestionService } from "./ingestion.service";

@ApiTags('Ingestion')
@Controller({ path: 'ingestion', version: '1' })
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) { }

  @Post()
  @ApiOperation({ summary: 'Trigger ingestion process' })
  @ApiResponse({ status: 201, description: 'Ingestion triggered successfully' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, PermissionGuard)
  create(@Body() createIngestionDto: CreateIngestionDto) {
    return this.ingestionService.addIngestion(createIngestionDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ingestion details by ID' })
  @ApiResponse({ status: 200, description: 'Ingestion details retrieved' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, PermissionGuard)
  findOne(@Param('id') id: string) {
    return this.ingestionService.findIngestionById(id);
  }
}

