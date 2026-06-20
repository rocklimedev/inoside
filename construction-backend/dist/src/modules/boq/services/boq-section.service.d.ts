import { BoqSection } from '../models/boq-section.model';
import { CreateBoqSectionDto } from '../dto/create-boq-section.dto';
export declare class BoqSectionService {
    private boqSectionModel;
    constructor(boqSectionModel: typeof BoqSection);
    createSection(dto: CreateBoqSectionDto): Promise<BoqSection>;
    updateSection(id: string, dto: Partial<CreateBoqSectionDto>): Promise<BoqSection>;
    deleteSection(id: string): Promise<{
        message: string;
    }>;
    findSectionsByBoq(boqId: string): Promise<BoqSection[]>;
    findById(id: string): Promise<BoqSection | null>;
}
