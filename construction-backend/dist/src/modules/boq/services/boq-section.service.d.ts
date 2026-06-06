import { BoqSection } from '../models/boq-section.model';
import { CreateBoqSectionDto } from '../dto/create-boq-section.dto';
export declare class BoqSectionService {
    private boqSectionModel;
    constructor(boqSectionModel: typeof BoqSection);
    create(dto: CreateBoqSectionDto): Promise<BoqSection>;
    update(id: string, dto: Partial<CreateBoqSectionDto>): Promise<BoqSection>;
    delete(id: string): Promise<{
        message: string;
    }>;
    findByBoq(boqId: string): Promise<BoqSection[]>;
}
