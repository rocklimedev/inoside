import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';

import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  // ================= CREATE =================

  @Post()
  @UseGuards(RolesGuard)
  create(@Body() dto: CreateClientDto, @Req() req) {
    return this.clientsService.create(dto, req.user);
  }

  // ================= READ ALL =================

  @Get()
  findAll(@Req() req) {
    return this.clientsService.findAll(req.user);
  }

  // ================= READ ONE =================

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.clientsService.findOne(id, req.user);
  }

  // ================= UPDATE =================

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateClientDto, @Req() req) {
    return this.clientsService.update(id, dto, req.user);
  }

  // ================= DELETE =================

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.clientsService.remove(id, req.user);
  }
}
