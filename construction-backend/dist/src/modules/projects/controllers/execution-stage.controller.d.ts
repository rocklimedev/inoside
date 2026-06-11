import { ExecutionStageService } from '../services/execution-stage.service';
import { CreateExecutionStageDto } from '../dto/create-stage.dto';
import { UpdateExecutionStageDto } from '../dto/update-stage.dto';
export declare class ExecutionStageController {
    private readonly service;
    constructor(service: ExecutionStageService);
    create(dto: CreateExecutionStageDto, req: any): Promise<import("../models/execution-stage.model").ExecutionStage>;
    findAll(projectId: string): Promise<import("../models/execution-stage.model").ExecutionStage[]>;
    findOne(id: string): Promise<import("../models/execution-stage.model").ExecutionStage>;
    update(id: string, dto: UpdateExecutionStageDto, req: any): Promise<import("../models/execution-stage.model").ExecutionStage>;
    reorderStages(projectId: string, body: {
        stageIds: string[];
    }, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    remove(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
