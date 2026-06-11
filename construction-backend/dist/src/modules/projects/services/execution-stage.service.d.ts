import { ExecutionStage } from '../models/execution-stage.model';
import { CreateExecutionStageDto } from '../dto/create-stage.dto';
import { UpdateExecutionStageDto } from '../dto/update-stage.dto';
export declare class ExecutionStageService {
    private readonly stageModel;
    constructor(stageModel: typeof ExecutionStage);
    create(dto: CreateExecutionStageDto): Promise<ExecutionStage>;
    findAll(projectId: string): Promise<ExecutionStage[]>;
    findOne(id: string): Promise<ExecutionStage>;
    update(id: string, dto: UpdateExecutionStageDto): Promise<ExecutionStage>;
    remove(id: string): Promise<void>;
}
