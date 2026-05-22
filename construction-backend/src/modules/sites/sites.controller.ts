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

import { SitesService } from './sites.service';

import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';

import { Roles } from '@/common/decorators/roles.decorator';

@Controller('sites')
@UseGuards(JwtAuthGuard)
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  // ================= CREATE =================

  @Post()
  create(@Body() createSiteDto: CreateSiteDto) {
    return this.sitesService.create(createSiteDto);
  }

  // ================= GET ALL =================

  @Get()
  findAll() {
    return this.sitesService.findAll();
  }

  // ================= GET ONE =================

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sitesService.findOne(id);
  }

  // ================= UPDATE =================

  @Patch(':id')
  update(
    @Param('id') id: string,

    @Body()
    updateSiteDto: UpdateSiteDto,
  ) {
    return this.sitesService.update(id, updateSiteDto);
  }

  // ================= DELETE =================

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sitesService.remove(id);
  }
}
