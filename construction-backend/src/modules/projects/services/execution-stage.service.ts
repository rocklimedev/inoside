import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuidv4 } from 'uuid';

import { ExecutionStage } from '../models/execution-stage.model';
import { CreateExecutionStageDto } from '../dto/create-stage.dto';
import { UpdateExecutionStageDto } from '../dto/update-stage.dto';

@Injectable()
export class ExecutionStageService {
  constructor(
    @InjectModel(ExecutionStage)
    private readonly stageModel: typeof ExecutionStage,
  ) {}

  async create(dto: CreateExecutionStageDto): Promise<ExecutionStage> {
    return await this.stageModel.create({
      id: uuidv4(),
      ...dto,
    } as any);
  }

  async findAll(projectId: string): Promise<ExecutionStage[]> {
    return await this.stageModel.findAll({
      where: {
        project_id: projectId,
      },
      order: [['created_at', 'ASC']],
    });
  }

  async findOne(id: string): Promise<ExecutionStage> {
    const stage = await this.stageModel.findByPk(id);

    if (!stage) {
      throw new NotFoundException(`Execution stage with ID ${id} not found`);
    }

    return stage;
  }

  async update(
    id: string,
    dto: UpdateExecutionStageDto,
  ): Promise<ExecutionStage> {
    const stage = await this.findOne(id);

    await stage.update(dto as any);

    return stage;
  }

  async remove(id: string): Promise<void> {
    const stage = await this.findOne(id);

    await stage.destroy();
  }
}
