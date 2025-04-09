import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "src/common/guards/auth.guard";
import { PermissionGuard } from "src/common/guards/permission.guard";

import { CreateIngestionDto } from "./dto/create-ingestion.dto";
import { IngestionService } from "./ingestion.service";

@Controller("ingestion")
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, PermissionGuard)
  create(@Body() createIngestionDto: CreateIngestionDto) {
    return this.ingestionService.addIngestion(createIngestionDto);
  }

  @ApiBearerAuth()
  @Get(":id")
  @UseGuards(AuthGuard, PermissionGuard)
  findOne(@Param("id") id: string) {
    return this.ingestionService.findIngestionById(id);
  }
}
