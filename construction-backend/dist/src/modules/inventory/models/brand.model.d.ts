import { Model } from 'sequelize-typescript';
import { InventoryMaster } from './inventory-master.model';
export declare class Brand extends Model<Brand> {
    id: string;
    name: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    items?: InventoryMaster[];
}
