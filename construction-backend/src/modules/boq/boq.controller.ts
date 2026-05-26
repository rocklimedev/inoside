import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { BoqService } from './boq.service';

import { CreateBoqDto } from './dto/create-boq.dto';
import { CreateBoqSectionDto } from './dto/create-boq-section.dto';
import { CreateBoqItemDto } from './dto/create-boq-item.dto';
import { CreateBoqSubHeadingDto } from './dto/create-boq-subheading.dto';
import { CreateBoqCategoryDto } from './dto/create-boq-category.dto';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('boq')
@UseGuards(JwtAuthGuard)
export class BoqController {
  constructor(private readonly boqService: BoqService) {}

  // =========================================================
  // BOQ CATEGORIES
  // =========================================================

  @Get('categories')
  findCategories() {
    return this.boqService.findAllCategories();
  }

  @Post('categories')
  createCategory(@Body() dto: CreateBoqCategoryDto) {
    return this.boqService.createCategory(dto);
  }

  // =========================================================
  // BOQS
  // =========================================================

  @Post()
  createBoq(@Body() dto: CreateBoqDto) {
    return this.boqService.createBoq(dto);
  }

  @Patch(':id')
  updateBoq(@Param('id') id: string, @Body() dto: Partial<CreateBoqDto>) {
    return this.boqService.updateBoq(id, dto);
  }

  @Get()
  findAllBoqs(
    @Query('projectId') projectId?: string,
    @Query('clientId') clientId?: string,
  ) {
    return this.boqService.findAllBoqs(projectId, clientId);
  }

  @Get('client/:clientId')
  getBoqsByClient(@Param('clientId') clientId: string) {
    return this.boqService.getBoqsByClient(clientId);
  }

  // =========================================================
  // SECTIONS
  // =========================================================

  @Post('sections')
  createSection(@Body() dto: CreateBoqSectionDto) {
    return this.boqService.createSection(dto);
  }

  @Patch('sections/:id')
  updateSection(
    @Param('id') id: string,
    @Body() dto: Partial<CreateBoqSectionDto>,
  ) {
    return this.boqService.updateSection(id, dto);
  }

  @Delete('sections/:id')
  deleteSection(@Param('id') id: string) {
    return this.boqService.deleteSection(id);
  }

  @Get(':boqId/sections')
  findSections(@Param('boqId') boqId: string) {
    return this.boqService.findSectionsByBoq(boqId);
  }

  // =========================================================
  // SUBHEADINGS
  // =========================================================

  @Post('subheadings')
  createSubHeading(@Body() dto: CreateBoqSubHeadingDto) {
    return this.boqService.createSubHeading(dto);
  }

  @Patch('subheadings/:id')
  updateSubHeading(
    @Param('id') id: string,
    @Body() dto: Partial<CreateBoqSubHeadingDto>,
  ) {
    return this.boqService.updateSubHeading(id, dto);
  }

  @Delete('subheadings/:id')
  deleteSubHeading(@Param('id') id: string) {
    return this.boqService.deleteSubHeading(id);
  }

  @Get('sections/:sectionId/subheadings')
  findSubHeadings(@Param('sectionId') sectionId: string) {
    return this.boqService.findSubHeadingsBySection(sectionId);
  }

  // =========================================================
  // ITEMS
  // =========================================================

  @Post('items')
  createItem(@Body() dto: CreateBoqItemDto) {
    return this.boqService.createItem(dto);
  }

  @Patch('items/:id')
  updateItem(@Param('id') id: string, @Body() dto: Partial<CreateBoqItemDto>) {
    console.log('PATCH ITEM HIT:', id);

    return this.boqService.updateItem(id, dto);
  }

  @Delete('items/:id')
  deleteItem(@Param('id') id: string) {
    return this.boqService.deleteItem(id);
  }

  // =========================================================
  // CALCULATIONS
  // =========================================================

  @Post(':id/calculate')
  calculateTotal(@Param('id') id: string) {
    return this.boqService.calculateBoqTotal(id);
  }

  // =========================================================
  // KEEP THIS LAST
  // =========================================================

  @Get(':id')
  findBoq(@Param('id') id: string) {
    return this.boqService.getBoqWithDetails(id);
  }
}
