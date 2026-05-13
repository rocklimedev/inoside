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
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

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
  @UseGuards(RolesGuard)
  @Roles('admin', 'estimator', 'project_manager')
  createCategory(@Body() dto: CreateBoqCategoryDto) {
    return this.boqService.createCategory(dto);
  }

  // =========================================================
  // BOQS
  // =========================================================

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'estimator', 'project_manager')
  createBoq(@Body() dto: CreateBoqDto) {
    return this.boqService.createBoq(dto);
  }

  @Get()
  findAllBoqs(@Query('projectId') projectId?: string) {
    return this.boqService.findAllBoqs(projectId);
  }

  @Get(':id')
  findBoq(@Param('id') id: string) {
    return this.boqService.getBoqWithDetails(id);
  }

  @Post(':id/calculate')
  calculateTotal(@Param('id') id: string) {
    return this.boqService.calculateBoqTotal(id);
  }

  // =========================================================
  // SECTIONS
  // =========================================================

  @Post('sections')
  @UseGuards(RolesGuard)
  @Roles('admin', 'estimator', 'project_manager')
  createSection(@Body() dto: CreateBoqSectionDto) {
    return this.boqService.createSection(dto);
  }

  @Get(':boqId/sections')
  findSections(@Param('boqId') boqId: string) {
    return this.boqService.findSectionsByBoq(boqId);
  }

  // =========================================================
  // SUBHEADINGS
  // =========================================================

  @Post('subheadings')
  @UseGuards(RolesGuard)
  @Roles('admin', 'estimator', 'project_manager')
  createSubHeading(@Body() dto: CreateBoqSubHeadingDto) {
    return this.boqService.createSubHeading(dto);
  }

  @Get('sections/:sectionId/subheadings')
  findSubHeadings(@Param('sectionId') sectionId: string) {
    return this.boqService.findSubHeadingsBySection(sectionId);
  }

  // =========================================================
  // ITEMS
  // =========================================================

  @Post('items')
  @UseGuards(RolesGuard)
  @Roles('admin', 'estimator', 'project_manager')
  createItem(@Body() dto: CreateBoqItemDto) {
    return this.boqService.createItem(dto);
  }

  @Patch('items/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'estimator', 'project_manager')
  updateItem(
    @Param('id') id: string,
    @Body()
    dto: Partial<CreateBoqItemDto>,
  ) {
    return this.boqService.updateItem(id, dto);
  }

  @Delete('items/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'estimator', 'project_manager')
  deleteItem(@Param('id') id: string) {
    return this.boqService.deleteItem(id);
  }
}
