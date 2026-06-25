import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { DailyProgressReportsService } from './services/daily-progress-reports.service';
import { CreateDailyProgressReportDto } from './dto/create-daily-progress-report.dto';
import { UpdateDailyProgressReportDto } from './dto/update-daily-progress-report.dto';

@Controller('daily-progress-reports')
export class DailyProgressReportsController {
  constructor(private readonly service: DailyProgressReportsService) {}

  @Post()
  create(@Body() dto: CreateDailyProgressReportDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDailyProgressReportDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
