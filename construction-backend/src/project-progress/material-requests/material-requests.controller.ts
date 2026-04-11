import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { MaterialRequestsService } from './material-requests.service';
import { CreateMaterialRequestDto } from './dto/create-material-request.dto';
import { UpdateMaterialRequestDto } from './dto/update-material-request.dto';
import { UpdateMaterialRequestStatusDto } from './dto/update-status.dto';

@Controller('material-requests')
export class MaterialRequestsController {
  constructor(
    private readonly materialRequestsService: MaterialRequestsService,
  ) {}

  @Post()
  async create(@Body() createDto: CreateMaterialRequestDto) {
    return this.materialRequestsService.create(createDto);
  }

  // Get all material requests for a specific project
  @Get('project/:projectId')
  async findByProject(@Param('projectId') projectId: string) {
    return this.materialRequestsService.findAllByProject(projectId);
  }

  // Get all material requests (for admin / procurement view)
  @Get()
  async findAll() {
    return this.materialRequestsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.materialRequestsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateMaterialRequestDto,
  ) {
    return this.materialRequestsService.update(id, updateDto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() statusDto: UpdateMaterialRequestStatusDto,
  ) {
    return this.materialRequestsService.updateStatus(id, statusDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.materialRequestsService.remove(id);
  }
}
