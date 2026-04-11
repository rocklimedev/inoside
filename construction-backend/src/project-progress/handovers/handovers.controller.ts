import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { HandoversService } from './handovers.service';
import { CreateHandoverDto } from './dto/create-handover.dto';
import { UpdateHandoverDto } from './dto/udpate-handover.dto';
// import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
// import { RolesGuard } from '../../common/guards/roles.guard';
// import { Roles } from '../../common/decorators/roles.decorator';

@Controller('projects/:projectId/handovers')
export class HandoversController {
  constructor(private readonly handoversService: HandoversService) {}

  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('PROJECT_MANAGER', 'ADMIN')
  async create(
    @Param('projectId') projectId: string,
    @Body() createHandoverDto: CreateHandoverDto,
  ) {
    createHandoverDto.project_id = projectId;
    return this.handoversService.create(createHandoverDto);
  }

  @Get()
  async findByProject(@Param('projectId') projectId: string) {
    return this.handoversService.findByProject(projectId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.handoversService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateHandoverDto: UpdateHandoverDto,
  ) {
    return this.handoversService.update(id, updateHandoverDto);
  }

  @Patch(':id/sign/:signer')
  async sign(
    @Param('id') id: string,
    @Param('signer') signer: 'client' | 'firm',
  ) {
    return this.handoversService.signHandover(id, signer);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.handoversService.remove(id);
  }
}
