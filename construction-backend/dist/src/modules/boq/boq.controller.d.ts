import { BoqService } from './boq.service';
import { CreateBoqDto } from './dto/create-boq.dto';
import { CreateBoqSectionDto } from './dto/create-boq-section.dto';
import { CreateBoqItemDto } from './dto/create-boq-item.dto';
import { CreateBoqSubHeadingDto } from './dto/create-boq-subheading.dto';
import { CreateBoqCategoryDto } from './dto/create-boq-category.dto';
import { UpdateBoqStatusDto } from './dto/update-boq-status.dto';
export declare class BoqController {
    private readonly boqService;
    constructor(boqService: BoqService);
    findCategories(): Promise<import("./models/boq-category.model").BoqCategory[]>;
    createCategory(dto: CreateBoqCategoryDto): Promise<import("./models/boq-category.model").BoqCategory>;
    createBoq(dto: CreateBoqDto): Promise<import("./models/boq.model").Boq>;
    updateBoq(id: string, dto: Partial<CreateBoqDto>): Promise<import("./models/boq.model").Boq>;
    findAllBoqs(projectId?: string, clientId?: string): Promise<import("./models/boq.model").Boq[]>;
    updateStatus(id: string, dto: UpdateBoqStatusDto): Promise<import("./models/boq.model").Boq>;
    getBoqsByClient(clientId: string): Promise<import("./models/boq.model").Boq[]>;
    createSection(dto: CreateBoqSectionDto): Promise<import("./models/boq-section.model").BoqSection>;
    updateSection(id: string, dto: Partial<CreateBoqSectionDto>): Promise<import("./models/boq-section.model").BoqSection>;
    deleteSection(id: string): Promise<{
        message: string;
    }>;
    findSections(boqId: string): Promise<import("./models/boq-section.model").BoqSection[]>;
    createSubHeading(dto: CreateBoqSubHeadingDto): Promise<import("./models/boq-subheading.model").BoqSubHeading>;
    updateSubHeading(id: string, dto: Partial<CreateBoqSubHeadingDto>): Promise<import("./models/boq-subheading.model").BoqSubHeading>;
    deleteSubHeading(id: string): Promise<{
        message: string;
    }>;
    findSubHeadings(sectionId: string): Promise<import("./models/boq-subheading.model").BoqSubHeading[]>;
    createItem(dto: CreateBoqItemDto): Promise<import("./models/boq-item.model").BoqItem>;
    updateItem(id: string, dto: Partial<CreateBoqItemDto>): Promise<import("./models/boq-item.model").BoqItem | null>;
    deleteItem(id: string): Promise<{
        message: string;
    }>;
    calculateTotal(id: string): Promise<{
        subtotal: number;
        grand_total: number;
    }>;
    findBoq(id: string): Promise<import("./models/boq.model").Boq>;
    deleteBoq(id: string): Promise<{
        message: string;
    }>;
}
