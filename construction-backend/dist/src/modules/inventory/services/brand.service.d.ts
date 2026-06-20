import { Brand } from '../models/brand.model';
import { InventoryMaster } from '../models/inventory-master.model';
export declare class BrandService {
    private brandModel;
    private masterModel;
    constructor(brandModel: typeof Brand, masterModel: typeof InventoryMaster);
    findAllBrands(): Promise<Brand[]>;
    createBrand(name: string): Promise<Brand>;
    countTotal(): Promise<number>;
    deleteBrand(id: string): Promise<{
        message: string;
    }>;
}
