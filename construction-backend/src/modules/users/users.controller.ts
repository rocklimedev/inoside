import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

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
  create(@Body() dto: CreateUserDto, @Req() req: any) {
    return this.usersService.create(dto, {
      id: req.user.id,
      name: req.user.name,
    });
  }

  // ================= UPDATE =================

  @Patch(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  // ================= UPDATE =================
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    return this.usersService.update(
      id,
      dto,
      {
        id: req.user.id,
        name: req.user.name,
      },
      file, // ← file goes last (as 4th parameter)
    );
  }

  // ================= OTHER ROUTES =================

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.usersService.remove(id, {
      id: req.user.id,
      name: req.user.name,
    });
  }

  @Patch(':id/toggle-active')
  toggleActive(@Param('id') id: string, @Req() req: any) {
    return this.usersService.toggleActive(id, {
      id: req.user.id,
      name: req.user.name,
    });
  }
}
