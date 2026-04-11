import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DailyProgressService } from './daily-progress.service';
import { CreateDailyProgressReportDto } from './dto/create-daily-progress.dto';
// import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
// import { RolesGuard } from '../../common/guards/roles.guard';
// import { Roles } from '../../common/decorators/roles.decorator';

@Controller('projects/:projectId/daily-progress')
export class DailyProgressController {
  constructor(private readonly service: DailyProgressService) {}

  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('SUPERVISOR', 'PROJECT_MANAGER')
  async create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateDailyProgressReportDto,
  ) {
    dto.project_id = projectId;
    return this.service.create(dto);
  }

  @Get()
  async findAll(@Param('projectId') projectId: string) {
    return this.service.findAllByProject(projectId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateDailyProgressReportDto>,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
