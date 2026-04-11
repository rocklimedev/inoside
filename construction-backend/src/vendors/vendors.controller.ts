import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { CreateVendorQuotationDto } from './dto/create-vendor-quotation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { Roles } from '../rbac/decorators/roles.decorator';
import { UserRole } from '../common/enums';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@Controller('vendors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  // ====================== VENDORS ======================
  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR)
  async create(@Body() dto: CreateVendorDto) {
    const vendor = await this.vendorsService.create(dto);
    return {
      success: true,
      message: 'Vendor created successfully',
      data: vendor,
    };
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.ARCHITECT)
  async findAll() {
    const vendors = await this.vendorsService.findAll();
    return {
      success: true,
      count: vendors.length,
      data: vendors,
    };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.ARCHITECT)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const vendor = await this.vendorsService.findOne(id);
    return {
      success: true,
      data: vendor,
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateVendorDto,
  ) {
    const vendor = await this.vendorsService.update(id, dto);
    return {
      success: true,
      message: 'Vendor updated successfully',
      data: vendor,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.vendorsService.remove(id);
    return {
      success: true,
      message: 'Vendor deleted successfully',
    };
  }

  // ====================== VENDOR QUOTATIONS ======================
  @Post('quotations')
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.ARCHITECT)
  async createQuotation(@Body() dto: CreateVendorQuotationDto) {
    const quotation = await this.vendorsService.createQuotation(dto);
    return {
      success: true,
      message: 'Vendor quotation submitted successfully',
      data: quotation,
    };
  }

  @Get('project/:projectId/quotations')
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPERVISOR,
    UserRole.ARCHITECT,
    UserRole.CLIENT,
  )
  async getProjectQuotations(
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    const quotations =
      await this.vendorsService.findQuotationsByProject(projectId);
    return {
      success: true,
      count: quotations.length,
      data: quotations,
    };
  }

  @Get('vendor/:vendorId/quotations')
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR)
  async getVendorQuotations(
    @Param('vendorId', ParseUUIDPipe) vendorId: string,
  ) {
    const quotations =
      await this.vendorsService.findQuotationsByVendor(vendorId);
    return {
      success: true,
      count: quotations.length,
      data: quotations,
    };
  }
}
