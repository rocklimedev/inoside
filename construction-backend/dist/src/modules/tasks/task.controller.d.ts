import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TaskController {
    private readonly taskService;
    constructor(taskService: TaskService);
    findAll(projectId?: string): Promise<import("./models/task.model").Task[]>;
    findOne(taskId: string, projectId?: string): Promise<import("./models/task.model").Task>;
    create(dto: CreateTaskDto, req: any): Promise<import("./models/task.model").Task>;
    update(taskId: string, dto: UpdateTaskDto, projectId?: string): Promise<import("./models/task.model").Task>;
    remove(taskId: string, projectId?: string): Promise<{
        message: string;
    }>;
}
