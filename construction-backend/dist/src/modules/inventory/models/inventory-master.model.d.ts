import { Model } from 'sequelize-typescript';
import { Unit } from '@/modules/boq/models/unit.model';
import { Brand } from './brand.model';
export declare class InventoryMaster extends Model<InventoryMaster> {
    id: string;
    item_code: string;
    item_name: string;
    description: string | null;
    unit_id: string | null;
    unit?: Unit;
    brand_id: string | null;
    brand?: Brand;
    default_rate: number;
    specification: string | null;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
