import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';

import { BoqService } from './boq.service';
import { CreateBoqDto } from './dto/create-boq.dto';
import { CreateBoqSectionDto } from './dto/create-boq-section.dto';
import { CreateBoqItemDto } from './dto/create-boq-item.dto';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

@Controller('boq')
@UseGuards(JwtAuthGuard)
export class BoqController {
  constructor(private readonly boqService: BoqService) {}

  // ====================== BOQ ======================

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'estimator', 'project_manager')
  create(@Body() dto: CreateBoqDto) {
    return this.boqService.createBoq(dto);
  }

  @Get()
  findAll(@Query('projectId') projectId?: string) {
    return this.boqService.findAllBoqs(projectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boqService.getBoqWithDetails(id);
  }

  // ====================== SECTIONS ======================

  @Post('sections')
  createSection(@Body() dto: CreateBoqSectionDto) {
    return this.boqService.createSection(dto);
  }

  @Get(':boqId/sections')
  getSections(@Param('boqId') boqId: string) {
    return this.boqService.findSectionsByBoq(boqId);
  }

  // ====================== ITEMS ======================

  @Post('items')
  createItem(@Body() dto: CreateBoqItemDto) {
    return this.boqService.createItem(dto);
  }

  @Patch('items/:id')
  updateItem(@Param('id') id: string, @Body() dto: Partial<CreateBoqItemDto>) {
    return this.boqService.updateItem(id, dto);
  }

  // ====================== CALCULATIONS ======================

  @Post(':id/calculate')
  calculateTotal(@Param('id') id: string) {
    return this.boqService.calculateBoqTotal(id);
  }
}
