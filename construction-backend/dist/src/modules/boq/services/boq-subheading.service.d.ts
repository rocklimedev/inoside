import { BoqSubHeading } from '../models/boq-subheading.model';
import { CreateBoqSubHeadingDto } from '../dto/create-boq-subheading.dto';
export declare class BoqSubHeadingService {
    private boqSubHeadingModel;
    constructor(boqSubHeadingModel: typeof BoqSubHeading);
    createSubHeading(data: CreateBoqSubHeadingDto): Promise<BoqSubHeading>;
    updateSubHeading(id: string, dto: Partial<CreateBoqSubHeadingDto>): Promise<BoqSubHeading>;
    deleteSubHeading(id: string): Promise<{
        message: string;
    }>;
    findSubHeadingsBySection(sectionId: string): Promise<BoqSubHeading[]>;
    findById(id: string): Promise<BoqSubHeading | null>;
}
