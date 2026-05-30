import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { TaskService } from './task.service';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // ======================================================
  // GET ALL TASKS
  // ======================================================

  @Get()
  findAll(@Query('projectId') projectId?: string) {
    if (projectId) {
      return this.taskService.findByProject(projectId);
    }

    return this.taskService.findAll();
  }

  // ======================================================
  // GET SINGLE TASK
  // ======================================================

  @Get(':taskId')
  findOne(
    @Param('taskId') taskId: string,
    @Query('projectId') projectId?: string,
  ) {
    return this.taskService.findOne(taskId, projectId);
  }

  // ======================================================
  // CREATE TASK
  // ======================================================

  @Post()
  create(@Body() dto: CreateTaskDto, @Req() req: any) {
    return this.taskService.create(dto, req.user.id);
  }

  // ======================================================
  // UPDATE TASK
  // ======================================================

  @Put(':taskId')
  update(
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskDto,
    @Query('projectId') projectId?: string,
  ) {
    return this.taskService.update(taskId, dto, projectId);
  }

  // ======================================================
  // DELETE TASK
  // ======================================================

  @Delete(':taskId')
  @HttpCode(204)
  remove(
    @Param('taskId') taskId: string,
    @Query('projectId') projectId?: string,
  ) {
    return this.taskService.remove(taskId, projectId);
  }
}
