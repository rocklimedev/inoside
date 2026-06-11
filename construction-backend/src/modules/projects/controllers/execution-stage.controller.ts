import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ExecutionStageService } from '../services/execution-stage.service';

import { CreateExecutionStageDto } from '../dto/create-stage.dto';
import { UpdateExecutionStageDto } from '../dto/update-stage.dto';

@Controller('execution/stages')
export class ExecutionStageController {
  constructor(private readonly service: ExecutionStageService) {}

  @Post()
  async create(@Body() dto: CreateExecutionStageDto) {
    return this.service.create(dto);
  }

  @Get('project/:projectId')
  async findAll(@Param('projectId') projectId: string) {
    return this.service.findAll(projectId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateExecutionStageDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
