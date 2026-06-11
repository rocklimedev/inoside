import { ExecutionStageService } from '../services/execution-stage.service';
import { CreateExecutionStageDto } from '../dto/create-stage.dto';
import { UpdateExecutionStageDto } from '../dto/update-stage.dto';
export declare class ExecutionStageController {
    private readonly service;
    constructor(service: ExecutionStageService);
    create(dto: CreateExecutionStageDto): Promise<import("../models/execution-stage.model").ExecutionStage>;
    findAll(projectId: string): Promise<import("../models/execution-stage.model").ExecutionStage[]>;
    findOne(id: string): Promise<import("../models/execution-stage.model").ExecutionStage>;
    update(id: string, dto: UpdateExecutionStageDto): Promise<import("../models/execution-stage.model").ExecutionStage>;
    remove(id: string): Promise<void>;
}
