import { ProjectDrawing } from '../models/project-drawings.model';
import { Project } from '../models/project.model';
import { User } from '@/modules/users/models/user.model';
import { DrawingApprovalLogService } from './drawing-approval-log.service';
export declare class ProjectDrawingService {
    private drawingModel;
    private projectModel;
    private userModel;
    private readonly approvalLogService;
    constructor(drawingModel: typeof ProjectDrawing, projectModel: typeof Project, userModel: typeof User, approvalLogService: DrawingApprovalLogService);
    upload(dto: any): Promise<ProjectDrawing>;
    findByProject(project_id: string): Promise<ProjectDrawing[]>;
    approve(id: string, user_id: string): Promise<ProjectDrawing>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
}
