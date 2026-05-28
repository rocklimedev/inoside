import type { Request } from 'express';
import { ProjectPitchService } from '../services/project-pitch.service';
import { CreateProjectPitchDto } from '../dto/create-project-pitch.dto';
import { UpdateProjectPitchDto } from '../dto/update-project-pitch.dto';
export declare class PitchesController {
    private readonly pitchService;
    constructor(pitchService: ProjectPitchService);
    create(projectId: string, dto: CreateProjectPitchDto, req: Request): Promise<import("../models/project_pitch.model").ProjectPitch>;
    get(projectId: string): Promise<import("../models/project_pitch.model").ProjectPitch>;
    update(projectId: string, dto: UpdateProjectPitchDto): Promise<import("../models/project_pitch.model").ProjectPitch>;
    remove(projectId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getAll(): Promise<import("../models/project_pitch.model").ProjectPitch[]>;
    getById(pitchId: string): Promise<import("../models/project_pitch.model").ProjectPitch>;
    deleteById(pitchId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    approve(pitchId: string): Promise<import("../models/project_pitch.model").ProjectPitch>;
    reject(pitchId: string): Promise<import("../models/project_pitch.model").ProjectPitch>;
}
