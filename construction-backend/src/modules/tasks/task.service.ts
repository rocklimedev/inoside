import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Task } from './models/task.model';
import { Project } from '@/modules/projects/models/project.model';
import { User } from '@/modules/users/models/user.model';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

import { TaskEngagementService } from '@/modules/engagement/services/task-engagement.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task)
    private readonly taskModel: typeof Task,

    @InjectModel(Project)
    private readonly projectModel: typeof Project,

    @InjectModel(User)
    private readonly userModel: typeof User,

    private readonly taskEngagementService: TaskEngagementService,
  ) {}

  // ======================================================
  // GET ALL TASKS
  // ======================================================

  async findAll(): Promise<Task[]> {
    return this.taskModel.findAll({
      include: [
        Project,
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'name', 'email', 'avatar_url', 'avatar_thumbnail'],
        },
        {
          model: User,
          as: 'createdBy',
          attributes: ['id', 'name', 'email', 'avatar_url', 'avatar_thumbnail'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  // ======================================================
  // GET TASKS BY PROJECT
  // ======================================================

  async findByProject(projectId: string): Promise<Task[]> {
    return this.taskModel.findAll({
      where: {
        project_id: projectId,
      },
      include: [
        Project,
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'name', 'email', 'avatar_url', 'avatar_thumbnail'],
        },
        {
          model: User,
          as: 'createdBy',
          attributes: ['id', 'name', 'email', 'avatar_url', 'avatar_thumbnail'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  // ======================================================
  // GET SINGLE TASK
  // ======================================================

  async findOne(id: string, projectId?: string): Promise<Task> {
    const whereClause: any = {
      id,
    };

    if (projectId) {
      whereClause.project_id = projectId;
    }

    const task = await this.taskModel.findOne({
      where: whereClause,
      include: [
        Project,
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'name', 'email', 'avatar_url', 'avatar_thumbnail'],
        },
        {
          model: User,
          as: 'createdBy',
          attributes: ['id', 'name', 'email', 'avatar_url', 'avatar_thumbnail'],
        },
      ],
    });

    if (!task) {
      throw new NotFoundException(
        projectId ? 'Task not found for this project' : 'Task not found',
      );
    }

    return task;
  }

  // ======================================================
  // CREATE TASK
  // ======================================================

  async create(
    dto: CreateTaskDto,
    createdByUserId: string,
    actor: {
      id: string;
      name: string;
    },
  ): Promise<Task> {
    const project = await this.projectModel.findByPk(dto.project_id);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const createdBy = await this.userModel.findByPk(createdByUserId);

    if (!createdBy) {
      throw new NotFoundException('Creator user not found');
    }

    if (dto.assigned_to_user_id) {
      const assignedUser = await this.userModel.findByPk(
        dto.assigned_to_user_id,
      );

      if (!assignedUser) {
        throw new NotFoundException('Assigned user not found');
      }
    }

    const task = await this.taskModel.create({
      ...dto,
      created_by_user_id: createdByUserId,
    });

    const createdTask = await this.findOne(task.id);

    await this.taskEngagementService.taskCreated(actor, {
      id: task.id,
      title: task.title,
      projectId: task.project_id,
      assignedToUserId: task.assigned_to_user_id,
    });

    return createdTask;
  }

  // ======================================================
  // UPDATE TASK
  // ======================================================

  async update(
    id: string,
    dto: UpdateTaskDto,
    actor: {
      id: string;
      name: string;
    },
    projectId?: string,
  ): Promise<Task> {
    const task = await this.findOne(id, projectId);

    const oldValues = task.toJSON();

    if (dto.assigned_to_user_id) {
      const assignedUser = await this.userModel.findByPk(
        dto.assigned_to_user_id,
      );

      if (!assignedUser) {
        throw new NotFoundException('Assigned user not found');
      }
    }

    await task.update(dto);

    const updatedTask = await this.findOne(id, projectId);

    await this.taskEngagementService.taskUpdated(
      actor,
      {
        id: task.id,
        title: task.title,
      },
      oldValues,
      updatedTask.toJSON(),
    );

    return updatedTask;
  }

  // ======================================================
  // DELETE TASK
  // ======================================================

  async remove(
    id: string,
    actor: {
      id: string;
      name: string;
    },
    projectId?: string,
  ): Promise<{
    message: string;
  }> {
    const task = await this.findOne(id, projectId);

    await this.taskEngagementService.taskDeleted(actor, {
      id: task.id,
      title: task.title,
    });

    await task.destroy();

    return {
      message: 'Task deleted successfully',
    };
  }
}
