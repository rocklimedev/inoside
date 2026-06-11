import { ExecutionStage } from '../models/execution-stage.model';
import { CreateExecutionStageDto } from '../dto/create-stage.dto';
import { UpdateExecutionStageDto } from '../dto/update-stage.dto';
export declare class ExecutionStageService {
    private readonly stageModel;
    constructor(stageModel: typeof ExecutionStage);
    create(dto: CreateExecutionStageDto, userId?: string): Promise<ExecutionStage>;
    findAll(projectId: string): Promise<ExecutionStage[]>;
    findOne(id: string): Promise<ExecutionStage>;
    update(id: string, dto: UpdateExecutionStageDto, userId?: string): Promise<ExecutionStage>;
    remove(id: string, userId?: string): Promise<void>;
    reorderStages(projectId: string, stageIds: string[], userId?: string): Promise<void>;
    countByProject(projectId: string): Promise<number>;
}
