import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(dto: CreateProjectDto): Promise<import("./models/project.model").Project>;
    findAll(): Promise<import("./models/project.model").Project[]>;
    findOne(id: string): Promise<import("./models/project.model").Project>;
    update(id: string, dto: UpdateProjectDto): Promise<import("./models/project.model").Project>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateProgress(id: string, progress: number): Promise<import("./models/project.model").Project>;
}
