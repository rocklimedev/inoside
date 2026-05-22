import { RekiPhoto } from '../models/reki_photos.model';
import { Project } from '../models/project.model';
import { RekiReport } from '../models/reki_reports.model';
export declare class RekiPhotoService {
    private rekiPhotoModel;
    private projectModel;
    private rekiModel;
    constructor(rekiPhotoModel: typeof RekiPhoto, projectModel: typeof Project, rekiModel: typeof RekiReport);
    private getIncludes;
    add(dto: any): Promise<RekiPhoto>;
    findById(id: string): Promise<RekiPhoto>;
    findByReki(rekiReportId: string): Promise<RekiPhoto[]>;
    update(id: string, dto: any): Promise<RekiPhoto>;
    delete(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    bulkDelete(ids: string[]): Promise<{
        success: boolean;
        message: string;
    }>;
}
