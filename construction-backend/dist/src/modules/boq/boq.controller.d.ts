import { BoqService } from './boq.service';
import { CreateBoqDto } from './dto/create-boq.dto';
import { CreateBoqSectionDto } from './dto/create-boq-section.dto';
import { CreateBoqItemDto } from './dto/create-boq-item.dto';
import { CreateBoqSubHeadingDto } from './dto/create-boq-subheading.dto';
import { CreateBoqCategoryDto } from './dto/create-boq-category.dto';
export declare class BoqController {
    private readonly boqService;
    constructor(boqService: BoqService);
    findCategories(): Promise<import("./models/boq-category.model").BoqCategory[]>;
    createCategory(dto: CreateBoqCategoryDto): Promise<import("./models/boq-category.model").BoqCategory>;
    createBoq(dto: CreateBoqDto): Promise<import("./models/boq.model").Boq>;
    findAllBoqs(projectId?: string): Promise<import("./models/boq.model").Boq[]>;
    findBoq(id: string): Promise<import("./models/boq.model").Boq>;
    calculateTotal(id: string): Promise<{
        subtotal: number;
        grand_total: number;
    }>;
    createSection(dto: CreateBoqSectionDto): Promise<import("./models/boq-section.model").BoqSection>;
    findSections(boqId: string): Promise<import("./models/boq-section.model").BoqSection[]>;
    createSubHeading(dto: CreateBoqSubHeadingDto): Promise<import("./models/boq-subheading.model").BoqSubHeading>;
    findSubHeadings(sectionId: string): Promise<import("./models/boq-subheading.model").BoqSubHeading[]>;
    createItem(dto: CreateBoqItemDto): Promise<import("./models/boq-item.model").BoqItem | null>;
    updateItem(id: string, dto: Partial<CreateBoqItemDto>): Promise<import("./models/boq-item.model").BoqItem | null>;
    deleteItem(id: string): Promise<{
        message: string;
    }>;
}
