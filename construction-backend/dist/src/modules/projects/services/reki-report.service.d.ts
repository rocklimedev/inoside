import { RekiReport } from '../models/reki_reports.model';
import { Project } from '../models/project.model';
export declare class RekiReportService {
    private rekiModel;
    private projectModel;
    constructor(rekiModel: typeof RekiReport, projectModel: typeof Project);
    private getIncludes;
    create(dto: any): Promise<RekiReport>;
    findByProject(projectId: string): Promise<RekiReport>;
    findById(id: string): Promise<RekiReport>;
    findAll(): Promise<RekiReport[]>;
    update(projectId: string, dto: any): Promise<RekiReport>;
    delete(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    markAsDone(projectId: string): Promise<RekiReport>;
    markAsPending(projectId: string): Promise<RekiReport>;
}
