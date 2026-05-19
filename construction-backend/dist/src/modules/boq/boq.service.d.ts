import { Boq } from './models/boq.model';
import { BoqCategory } from './models/boq-category.model';
import { BoqSection } from './models/boq-section.model';
import { BoqSubHeading } from './models/boq-subheading.model';
import { BoqItem } from './models/boq-item.model';
import { Unit } from './models/unit.model';
import { InventoryMaster } from '../inventory/models/inventory-master.model';
import { CreateBoqDto } from './dto/create-boq.dto';
import { CreateBoqSectionDto } from './dto/create-boq-section.dto';
import { CreateBoqItemDto } from './dto/create-boq-item.dto';
import { CreateBoqSubHeadingDto } from './dto/create-boq-subheading.dto';
import { CreateBoqCategoryDto } from './dto/create-boq-category.dto';
export declare class BoqService {
    private boqModel;
    private boqCategoryModel;
    private boqSectionModel;
    private boqSubHeadingModel;
    private boqItemModel;
    private unitModel;
    private inventoryMasterModel;
    constructor(boqModel: typeof Boq, boqCategoryModel: typeof BoqCategory, boqSectionModel: typeof BoqSection, boqSubHeadingModel: typeof BoqSubHeading, boqItemModel: typeof BoqItem, unitModel: typeof Unit, inventoryMasterModel: typeof InventoryMaster);
    findAllCategories(): Promise<BoqCategory[]>;
    createCategory(data: CreateBoqCategoryDto): Promise<BoqCategory>;
    createBoq(dto: CreateBoqDto): Promise<Boq>;
    findAllBoqs(projectId?: string): Promise<Boq[]>;
    getBoqWithDetails(id: string): Promise<Boq>;
    validateBoqExists(id: string): Promise<Boq>;
    createSection(dto: CreateBoqSectionDto): Promise<BoqSection>;
    findSectionsByBoq(boqId: string): Promise<BoqSection[]>;
    createSubHeading(data: CreateBoqSubHeadingDto): Promise<BoqSubHeading>;
    findSubHeadingsBySection(sectionId: string): Promise<BoqSubHeading[]>;
    createItem(dto: CreateBoqItemDto): Promise<BoqItem | null>;
    updateItem(id: string, updateData: Partial<CreateBoqItemDto>): Promise<BoqItem | null>;
    deleteItem(id: string): Promise<{
        message: string;
    }>;
    calculateBoqTotal(boqId: string): Promise<{
        subtotal: number;
        grand_total: number;
    }>;
    recalculateSectionTotal(sectionId: string): Promise<number>;
}
