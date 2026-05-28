import type { Request } from 'express';
import { ProjectBriefService } from '../services/project-brief.service';
import { CreateProjectBriefDto } from '../dto/create-project-brief.dto';
import { UpdateProjectBriefDto } from '../dto/update-project-brief.dto';
import { RequestBriefChangesDto } from '../dto/request-brief-changes.dto';
export declare class BriefsController {
    private readonly briefService;
    constructor(briefService: ProjectBriefService);
    createBrief(id: string, dto: CreateProjectBriefDto): Promise<import("../models/project_brief.model").ProjectBrief>;
    getBrief(id: string): Promise<any>;
    updateBrief(id: string, dto: UpdateProjectBriefDto): Promise<any>;
    getAllBriefs(): Promise<import("../models/project_brief.model").ProjectBrief[]>;
    approveBrief(briefId: string, req: Request): Promise<any>;
    unapproveBrief(briefId: string): Promise<any>;
    requestChanges(briefId: string, dto: RequestBriefChangesDto, req: Request): Promise<any>;
    sendToClient(briefId: string): Promise<any>;
    markDraft(briefId: string): Promise<any>;
}
