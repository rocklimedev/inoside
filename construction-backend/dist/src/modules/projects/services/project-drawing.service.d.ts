import { ProjectDrawing } from '../models/project-drawings.model';
import { Project } from '../models/project.model';
import { User } from '@/modules/users/models/user.model';
export declare class ProjectDrawingService {
    private drawingModel;
    private projectModel;
    private userModel;
    constructor(drawingModel: typeof ProjectDrawing, projectModel: typeof Project, userModel: typeof User);
    upload(dto: any): Promise<ProjectDrawing>;
    findByProject(project_id: string): Promise<ProjectDrawing[]>;
    approve(id: string, user_id: string): Promise<ProjectDrawing>;
    delete(id: string): Promise<number>;
}
