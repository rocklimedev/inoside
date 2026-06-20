import { Boq } from './models/boq.model';
import { BoqCategory } from './models/boq-category.model';
import { BoqSection } from './models/boq-section.model';
import { BoqSubHeading } from './models/boq-subheading.model';
import { BoqItem } from './models/boq-item.model';
import { CreateBoqDto } from './dto/create-boq.dto';
import { CreateBoqSectionDto } from './dto/create-boq-section.dto';
import { CreateBoqSubHeadingDto } from './dto/create-boq-subheading.dto';
import { CreateBoqItemDto } from './dto/create-boq-item.dto';
import { CreateBoqCategoryDto } from './dto/create-boq-category.dto';
import { BoqCategoryService } from './services/boq-category.service';
import { BoqSectionService } from './services/boq-section.service';
import { BoqSubHeadingService } from './services/boq-subheading.service';
import { BoqItemService } from './services/boq-item.service';
export declare class BoqService {
    private boqModel;
    private readonly categoryService;
    private readonly sectionService;
    private readonly subHeadingService;
    private readonly itemService;
    constructor(boqModel: typeof Boq, categoryService: BoqCategoryService, sectionService: BoqSectionService, subHeadingService: BoqSubHeadingService, itemService: BoqItemService);
    findAllCategories(): Promise<BoqCategory[]>;
    createCategory(data: CreateBoqCategoryDto): Promise<BoqCategory>;
    createBoq(dto: CreateBoqDto): Promise<Boq>;
    updateBoq(id: string, dto: Partial<CreateBoqDto>): Promise<Boq>;
    findAllBoqs(projectId?: string, clientId?: string): Promise<Boq[]>;
    updateBoqStatus(id: string, data: {
        status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'revised';
        approved_by?: string;
    }): Promise<Boq>;
    getBoqWithDetails(id: string): Promise<Boq>;
    getBoqsByClient(clientId: string): Promise<Boq[]>;
    deleteBoq(id: string): Promise<{
        message: string;
    }>;
    validateBoqExists(id: string): Promise<Boq>;
    calculateBoqTotal(boqId: string): Promise<{
        subtotal: number;
        grand_total: number;
    }>;
    createSection(dto: CreateBoqSectionDto): Promise<BoqSection>;
    updateSection(id: string, dto: Partial<CreateBoqSectionDto>): Promise<BoqSection>;
    deleteSection(id: string): Promise<{
        message: string;
    }>;
    findSectionsByBoq(boqId: string): Promise<BoqSection[]>;
    createSubHeading(data: CreateBoqSubHeadingDto): Promise<BoqSubHeading>;
    updateSubHeading(id: string, dto: Partial<CreateBoqSubHeadingDto>): Promise<BoqSubHeading>;
    deleteSubHeading(id: string): Promise<{
        message: string;
    }>;
    findSubHeadingsBySection(sectionId: string): Promise<BoqSubHeading[]>;
    createItem(dto: CreateBoqItemDto): Promise<BoqItem>;
    updateItem(id: string, updateData: Partial<CreateBoqItemDto>): Promise<BoqItem | null>;
    deleteItem(id: string): Promise<{
        message: string;
    }>;
    private boqIncludes;
}
