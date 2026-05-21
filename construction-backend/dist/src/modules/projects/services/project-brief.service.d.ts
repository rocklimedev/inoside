import { ProjectBrief } from '../models/project_brief.model';
import { Project } from '../models/project.model';
import { User } from '@/modules/users/models/user.model';
export declare class ProjectBriefService {
    private briefModel;
    private projectModel;
    private userModel;
    constructor(briefModel: typeof ProjectBrief, projectModel: typeof Project, userModel: typeof User);
    create(dto: any): Promise<ProjectBrief>;
    getBrief(briefId: string): Promise<any>;
    updateBrief(project_id: string, dto: any): Promise<any>;
    approveBrief(briefId: string, user_id: string): Promise<any>;
    unapproveBrief(briefId: string): Promise<any>;
    requestBriefChanges(briefId: string, dto: {
        note?: string;
        requested_by?: string;
    }): Promise<any>;
    sendBriefToClient(briefId: string): Promise<any>;
    markBriefAsDraft(briefId: string): Promise<any>;
    getAllBriefs(): Promise<ProjectBrief[]>;
    getBriefById(id: string): Promise<any>;
}
