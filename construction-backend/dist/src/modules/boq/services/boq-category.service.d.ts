import { BoqCategory } from '../models/boq-category.model';
import { CreateBoqCategoryDto } from '../dto/create-boq-category.dto';
export declare class BoqCategoryService {
    private boqCategoryModel;
    constructor(boqCategoryModel: typeof BoqCategory);
    findAll(): Promise<BoqCategory[]>;
    create(data: CreateBoqCategoryDto): Promise<BoqCategory>;
}
