import { Model } from 'sequelize-typescript';
import { InventoryCategory } from './inventory-category.model';
import { Unit } from '@/modules/boq/models/unit.model';
import { Brand } from './brand.model';
export declare class InventoryMaster extends Model {
    id: string;
    item_code: string;
    item_name: string;
    category_id: string | null;
    category?: InventoryCategory;
    description: string | null;
    unit_id: string | null;
    unit?: Unit;
    default_rate: number;
    gst_percent: number;
    hsn_code: string | null;
    min_stock_level: number;
    specification: string | null;
    is_active: boolean;
    is_serialized: boolean;
    created_at: Date;
    updated_at: Date;
    created_by: string | null;
    updated_by: string | null;
    brand_id: string | null;
    brand?: Brand;
}
