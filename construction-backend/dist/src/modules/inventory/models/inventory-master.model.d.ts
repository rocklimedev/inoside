import { Model } from 'sequelize-typescript';
import { Unit } from '@/modules/boq/models/unit.model';
export declare class InventoryMaster extends Model<InventoryMaster> {
    id: string;
    item_code: string;
    item_name: string;
    description: string;
    unit_id: string;
    unit: Unit;
    default_rate: number;
    brand: string;
    specification: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
