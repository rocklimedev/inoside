import { ProjectDrawingService } from '../services/project-drawing.service';
import { CdnService } from '@/modules/cdn/services/cdn.service';
export declare class DrawingsController {
    private readonly drawingService;
    private readonly cdnService;
    constructor(drawingService: ProjectDrawingService, cdnService: CdnService);
    uploadDrawing(projectId: string, file: Express.Multer.File, body: any): Promise<import("../models/project-drawings.model").ProjectDrawing>;
    getAllDrawings(): Promise<import("../models/project-drawings.model").ProjectDrawing[]>;
    getDrawings(projectId: string): Promise<import("../models/project-drawings.model").ProjectDrawing[]>;
    approveDrawing(drawingId: string, userId: string): Promise<import("../models/project-drawings.model").ProjectDrawing>;
    deleteDrawing(drawingId: string): Promise<{
        success: boolean;
    }>;
}
