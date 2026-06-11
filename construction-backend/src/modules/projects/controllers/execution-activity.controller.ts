import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';

import { ExecutionActivityService } from '../services/execution-activity.service';

import { CreateExecutionActivityDto } from '../dto/create-activity.dto';
import { UpdateExecutionActivityDto } from '../dto/update-activity.dto';

@Controller('execution/activities')
export class ExecutionActivityController {
  constructor(private readonly service: ExecutionActivityService) {}

  @Post()
  async create(@Body() dto: CreateExecutionActivityDto, @Req() req: any) {
    return this.service.create(dto, req.user.id);
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
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateExecutionActivityDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
