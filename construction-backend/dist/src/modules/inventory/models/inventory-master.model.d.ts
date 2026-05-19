import { Model } from 'sequelize-typescript';
import { Unit } from '@/modules/boq/models/unit.model';
import { Brand } from './brand.model';
export declare class InventoryMaster extends Model<InventoryMaster> {
    id: string;
    item_code: string;
    item_name: string;
    description: string;
    unit_id: string;
    unit?: Unit;
    brand_id: string;
    brand?: Brand;
    default_rate: number;
    specification: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
