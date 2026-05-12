// vendors.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { VendorsService } from './vendors.service';

import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { AssignVendorDto } from './dto/assign-vendor.dto';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

@Controller('vendors')
@UseGuards(JwtAuthGuard)
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  // ====================== Vendors ======================

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'project_manager')
  create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorsService.createVendor(createVendorDto);
  }

  @Get()
  findAll() {
    return this.vendorsService.findAllVendors();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorsService.findVendorById(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'project_manager')
  update(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto) {
    return this.vendorsService.updateVendor(id, updateVendorDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.vendorsService.deleteVendor(id);
  }

  // ====================== Vendor Types ======================

  @Post('types')
  @UseGuards(RolesGuard)
  @Roles('admin', 'project_manager')
  createVendorType(@Body('name') name: string) {
    return this.vendorsService.createVendorType(name);
  }

  @Get('types/all')
  getVendorTypes() {
    return this.vendorsService.getVendorTypes();
  }

  // ====================== Project Vendors ======================

  @Post('assign')
  @UseGuards(RolesGuard)
  @Roles('admin', 'project_manager')
  assignToProject(@Body() assignVendorDto: AssignVendorDto) {
    return this.vendorsService.assignVendorToProject(assignVendorDto);
  }

  @Get('project/:projectId')
  getByProject(@Param('projectId') projectId: string) {
    return this.vendorsService.getVendorsByProject(projectId);
  }

  @Patch('project-assignment/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'project_manager')
  updateProjectVendor(
    @Param('id') id: string,
    @Body() updateData: Partial<AssignVendorDto>,
  ) {
    return this.vendorsService.updateProjectVendor(id, updateData);
  }

  @Delete('project-assignment/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'project_manager')
  removeVendorFromProject(@Param('id') id: string) {
    return this.vendorsService.removeVendorFromProject(id);
  }
}
