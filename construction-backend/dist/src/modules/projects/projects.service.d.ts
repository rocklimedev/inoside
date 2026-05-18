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
    create(dto: any): Promise<Project>;
    findAll(): Promise<Project[]>;
    findOne(id: string): Promise<Project>;
    update(id: string, dto: any): Promise<Project>;
    remove(id: string): Promise<{
        message: string;
    }>;
    updateProgress(id: string, progress: number): Promise<Project>;
}
