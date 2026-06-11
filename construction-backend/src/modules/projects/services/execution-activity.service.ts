import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuidv4 } from 'uuid';

import { ExecutionActivity } from '../models/execution-activity.model';
import { ExecutionStage } from '../models/execution-stage.model';
import { User } from '../../users/models/user.model';

import { CreateExecutionActivityDto } from '../dto/create-activity.dto';
import { UpdateExecutionActivityDto } from '../dto/update-activity.dto';

@Injectable()
export class ExecutionActivityService {
  constructor(
    @InjectModel(ExecutionActivity)
    private readonly activityModel: typeof ExecutionActivity,
  ) {}

  async create(
    dto: CreateExecutionActivityDto,
    userId: string,
  ): Promise<ExecutionActivity> {
    return await this.activityModel.create({
      id: uuidv4(),
      created_by: userId,
      ...dto,
    } as any);
  }

  async findAll(projectId: string): Promise<ExecutionActivity[]> {
    return await this.activityModel.findAll({
      where: {
        project_id: projectId,
      },
      include: [
        {
          model: ExecutionStage,
        },
        {
          model: User,
          as: 'createdBy',
          attributes: ['id', 'first_name', 'last_name', 'email'],
        },
      ],
      order: [['activity_date', 'DESC']],
    });
  }

  async findOne(id: string): Promise<ExecutionActivity> {
    const activity = await this.activityModel.findByPk(id, {
      include: [
        {
          model: ExecutionStage,
        },
        {
          model: User,
          as: 'createdBy',
          attributes: ['id', 'first_name', 'last_name', 'email'],
        },
      ],
    });

    if (!activity) {
      throw new NotFoundException(`Execution activity with ID ${id} not found`);
    }

    return activity;
  }

  async update(
    id: string,
    dto: UpdateExecutionActivityDto,
  ): Promise<ExecutionActivity> {
    const activity = await this.findOne(id);

    await activity.update(dto as any);

    return activity;
  }

  async remove(id: string): Promise<void> {
    const activity = await this.findOne(id);

    await activity.destroy();
  }
}
