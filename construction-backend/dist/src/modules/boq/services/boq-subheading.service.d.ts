import { BoqSubHeading } from '../models/boq-subheading.model';
import { CreateBoqSubHeadingDto } from '../dto/create-boq-subheading.dto';
export declare class BoqSubHeadingService {
    private boqSubHeadingModel;
    constructor(boqSubHeadingModel: typeof BoqSubHeading);
    create(data: CreateBoqSubHeadingDto): Promise<BoqSubHeading>;
    update(id: string, dto: Partial<CreateBoqSubHeadingDto>): Promise<BoqSubHeading>;
    delete(id: string): Promise<{
        message: string;
    }>;
    findBySection(sectionId: string): Promise<BoqSubHeading[]>;
}
