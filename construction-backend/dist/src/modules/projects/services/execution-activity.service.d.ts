import { ExecutionActivity } from '../models/execution-activity.model';
import { CreateExecutionActivityDto } from '../dto/create-activity.dto';
import { UpdateExecutionActivityDto } from '../dto/update-activity.dto';
export declare class ExecutionActivityService {
    private readonly activityModel;
    constructor(activityModel: typeof ExecutionActivity);
    create(dto: CreateExecutionActivityDto, userId?: string): Promise<ExecutionActivity>;
    findAll(projectId: string): Promise<ExecutionActivity[]>;
    findByStage(stageId: string): Promise<ExecutionActivity[]>;
    findOne(id: string): Promise<ExecutionActivity>;
    update(id: string, dto: UpdateExecutionActivityDto, userId?: string): Promise<ExecutionActivity>;
    remove(id: string, userId?: string): Promise<void>;
    reorderActivities(stageId: string, activityIds: string[], userId?: string): Promise<void>;
    countByProject(projectId: string): Promise<number>;
}
