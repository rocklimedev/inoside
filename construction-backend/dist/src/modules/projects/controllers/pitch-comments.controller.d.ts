import type { Request } from 'express';
import { ProjectPitchService } from '../services/project-pitch.service';
export declare class PitchCommentsController {
    private readonly pitchService;
    constructor(pitchService: ProjectPitchService);
    getComments(pitchId: string): Promise<import("../models/pitch-comment.model").PitchComment[]>;
    addComment(pitchId: string, content: string, req: Request): Promise<import("../models/pitch-comment.model").PitchComment>;
    updateComment(commentId: string, dto: any): Promise<import("../models/pitch-comment.model").PitchComment | null>;
    deleteComment(commentId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
