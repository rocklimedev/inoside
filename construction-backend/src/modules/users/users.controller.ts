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

import { UsersService } from './users.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ================= CREATE =================

  @Post()
  @UseGuards(RolesGuard)
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  // ================= READ ALL =================

  @Get()
  @UseGuards(RolesGuard)
  findAll() {
    return this.usersService.findAll();
  }

  // ================= READ ONE =================

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // ================= UPDATE =================

  @Patch(':id')
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  // ================= DELETE =================

  @Delete(':id')
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // ================= TOGGLE ACTIVE =================

  @Patch(':id/toggle-active')
  @UseGuards(RolesGuard)
  toggleActive(@Param('id') id: string) {
    return this.usersService.toggleActive(id);
  }
}
