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

import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  // ================= CREATE =================

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'project_manager')
  create(@Body() dto: CreateClientDto) {
    return this.clientsService.create(dto);
  }

  // ================= READ ALL =================

  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  // ================= READ ONE =================

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  // ================= UPDATE =================

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'project_manager')
  update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
    return this.clientsService.update(id, dto);
  }

  // ================= DELETE =================

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}
