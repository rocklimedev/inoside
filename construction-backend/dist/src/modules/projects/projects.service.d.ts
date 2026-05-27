import { Project } from './models/project.model';
import { Client } from '../clients/models/client.model';
import { Site } from '../sites/models/site.model';
import { User } from '../users/models/user.model';
export declare class ProjectsService {
    private projectModel;
    private clientModel;
    private siteModel;
    private userModel;
    constructor(projectModel: typeof Project, clientModel: typeof Client, siteModel: typeof Site, userModel: typeof User);
    private getFullIncludes;
    create(dto: any): Promise<Project>;
    findAll(): Promise<Project[]>;
    findOne(id: string): Promise<Project>;
    update(id: string, dto: any): Promise<Project>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateProgress(id: string, progress: number): Promise<Project>;
    assignProject(id: string, dto: {
        assigned_to: string;
    }): Promise<Project>;
    archiveProject(id: string): Promise<Project>;
    unarchiveProject(id: string): Promise<Project>;
    getProjectsByClient(clientId: string): Promise<Project[]>;
    getProjectsByStatus(status: string): Promise<Project[]>;
    getProjectsByUser(userId: string): Promise<Project[]>;
    searchProjects(query: string): Promise<Project[]>;
    getActiveProjects(): Promise<Project[]>;
    getArchivedProjects(): Promise<Project[]>;
    getProjectStats(): Promise<{
        total: number;
        active: number;
        archived: number;
        completed: number;
        inProgress: number;
    }>;
}
