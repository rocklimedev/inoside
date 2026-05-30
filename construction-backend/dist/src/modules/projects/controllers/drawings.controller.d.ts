import { ProjectDrawingService } from '../services/project-drawing.service';
export declare class DrawingsController {
    private readonly drawingService;
    constructor(drawingService: ProjectDrawingService);
    uploadDrawing(projectId: string, dto: any): Promise<import("../models/project-drawings.model").ProjectDrawing>;
    getDrawings(projectId: string): Promise<import("../models/project-drawings.model").ProjectDrawing[]>;
    approveDrawing(drawingId: string, userId: string): Promise<import("../models/project-drawings.model").ProjectDrawing>;
    deleteDrawing(drawingId: string): Promise<{
        success: boolean;
    }>;
}
