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

@Controller('sites')
@UseGuards(JwtAuthGuard)
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  // ======================================================
  // CREATE SITE
  // ======================================================

  @Post()
  create(
    @Body()
    createSiteDto: CreateSiteDto,
  ) {
    return this.sitesService.create(createSiteDto);
  }

  // ======================================================
  // GET ALL SITES
  // ======================================================

  @Get()
  findAll() {
    return this.sitesService.findAll();
  }

  // ======================================================
  // GET SITE BY CLIENT
  // ======================================================

  @Get('client/:clientId')
  findByClient(
    @Param('clientId')
    clientId: string,
  ) {
    return this.sitesService.findByClient(clientId);
  }

  // ======================================================
  // GET SINGLE SITE
  // ======================================================

  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.sitesService.findOne(id);
  }

  // ======================================================
  // UPDATE SITE
  // ======================================================

  @Patch(':id')
  update(
    @Param('id')
    id: string,

    @Body()
    updateSiteDto: UpdateSiteDto,
  ) {
    return this.sitesService.update(id, updateSiteDto);
  }

  // ======================================================
  // DELETE SITE
  // ======================================================

  @Delete(':id')
  remove(
    @Param('id')
    id: string,
  ) {
    return this.sitesService.remove(id);
  }
}
