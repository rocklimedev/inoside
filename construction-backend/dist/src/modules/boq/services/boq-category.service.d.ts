import { BoqCategory } from '../models/boq-category.model';
import { CreateBoqCategoryDto } from '../dto/create-boq-category.dto';
export declare class BoqCategoryService {
    private boqCategoryModel;
    constructor(boqCategoryModel: typeof BoqCategory);
    findAllCategories(): Promise<BoqCategory[]>;
    createCategory(data: CreateBoqCategoryDto): Promise<BoqCategory>;
    findById(id: string): Promise<BoqCategory | null>;
}
