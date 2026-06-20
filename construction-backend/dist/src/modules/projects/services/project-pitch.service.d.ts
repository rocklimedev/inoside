import { CreateProjectPitchDto } from '../dto/create-project-pitch.dto';
import { CdnService } from '@/modules/cdn/services/cdn.service';
import { ProjectPitch } from '../models/project_pitch.model';
import { Project } from '../models/project.model';
import { User } from '@/modules/users/models/user.model';
import { PitchComment } from '../models/pitch-comment.model';
export declare class ProjectPitchService {
    private pitchModel;
    private projectModel;
    private userModel;
    private commentModel;
    private readonly cdnService;
    constructor(pitchModel: typeof ProjectPitch, projectModel: typeof Project, userModel: typeof User, commentModel: typeof PitchComment, cdnService: CdnService);
    createPitch(projectId: string, dto: CreateProjectPitchDto, file: Express.Multer.File | null, createdBy: string): Promise<ProjectPitch>;
    getPitch(projectId: string): Promise<ProjectPitch>;
    updatePitch(projectId: string, dto: any): Promise<ProjectPitch>;
    deletePitch(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getAllPitches(): Promise<ProjectPitch[]>;
    getPitchById(id: string): Promise<ProjectPitch>;
    addComment(pitchId: string, dto: {
        content: string;
        user_id?: string;
    }): Promise<PitchComment>;
    replacePitchFile(pitchId: string, dto: {
        pitch_pdf_url?: string;
        moodboard_pdf_url?: string;
    }): Promise<ProjectPitch>;
    approvePitch(id: string): Promise<ProjectPitch>;
    rejectPitch(id: string): Promise<ProjectPitch>;
    getComments(pitchId: string): Promise<PitchComment[]>;
    updateComment(commentId: string, dto: {
        content?: string;
    }): Promise<PitchComment | null>;
    deleteComment(commentId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteByProject(projectId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private getIncludes;
}
