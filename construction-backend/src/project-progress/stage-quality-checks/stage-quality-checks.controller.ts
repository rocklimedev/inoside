import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { StageQualityChecksService } from './stage-quality-checks.service';
import { CreateStageQualityCheckDto } from './dto/create-stage-quality-check.dto';
import { UpdateStageQualityCheckDto } from './dto/update-stage-quality-check.dto';

@Controller('projects/:projectId/quality-checks')
export class StageQualityChecksController {
  constructor(
    private readonly qualityChecksService: StageQualityChecksService,
  ) {}

  @Post()
  async create(
    @Param('projectId') projectId: string,
    @Body() createDto: CreateStageQualityCheckDto,
  ) {
    createDto.project_id = projectId;
    return this.qualityChecksService.create(createDto);
  }

  @Get()
  async findAll(@Param('projectId') projectId: string) {
    return this.qualityChecksService.findAllByProject(projectId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.qualityChecksService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateStageQualityCheckDto,
  ) {
    return this.qualityChecksService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.qualityChecksService.remove(id);
  }
}
