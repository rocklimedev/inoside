import { RekiReport } from '../models/reki_reports.model';
import { Project } from '../models/project.model';
export declare class RekiReportService {
    private rekiModel;
    private projectModel;
    constructor(rekiModel: typeof RekiReport, projectModel: typeof Project);
    create(dto: any): Promise<RekiReport>;
    findOne(project_id: string): Promise<RekiReport>;
    update(project_id: string, dto: any): Promise<RekiReport>;
}
