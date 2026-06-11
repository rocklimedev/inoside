import { ExecutionActivityService } from '../services/execution-activity.service';
import { CreateExecutionActivityDto } from '../dto/create-activity.dto';
import { UpdateExecutionActivityDto } from '../dto/update-activity.dto';
export declare class ExecutionActivityController {
    private readonly service;
    constructor(service: ExecutionActivityService);
    create(dto: CreateExecutionActivityDto, req: any): Promise<import("../models/execution-activity.model").ExecutionActivity>;
    findAll(projectId: string): Promise<import("../models/execution-activity.model").ExecutionActivity[]>;
    findOne(id: string): Promise<import("../models/execution-activity.model").ExecutionActivity>;
    update(id: string, dto: UpdateExecutionActivityDto): Promise<import("../models/execution-activity.model").ExecutionActivity>;
    remove(id: string): Promise<void>;
}
