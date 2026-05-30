import { Task } from './models/task.model';
import { Project } from '@/modules/projects/models/project.model';
import { User } from '@/modules/users/models/user.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TaskService {
    private readonly taskModel;
    private readonly projectModel;
    private readonly userModel;
    constructor(taskModel: typeof Task, projectModel: typeof Project, userModel: typeof User);
    findAll(): Promise<Task[]>;
    findByProject(projectId: string): Promise<Task[]>;
    findOne(id: string, projectId?: string): Promise<Task>;
    create(dto: CreateTaskDto, createdByUserId: string): Promise<Task>;
    update(id: string, dto: UpdateTaskDto, projectId?: string): Promise<Task>;
    remove(id: string, projectId?: string): Promise<{
        message: string;
    }>;
}
