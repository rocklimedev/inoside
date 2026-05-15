import { Model } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
import { Unit } from '@/modules/boq/models/unit.model';
import { BoqItem } from '@/modules/boq/models/boq-item.model';
export declare class InventoryItem extends Model<InferAttributes<InventoryItem>, InferCreationAttributes<InventoryItem>> {
    id: CreationOptional<string>;
    item_code: string;
    item_name: string;
    description: CreationOptional<string | null>;
    unit_id: CreationOptional<string | null>;
    default_rate: CreationOptional<number>;
    brand: CreationOptional<string | null>;
    specification: CreationOptional<string | null>;
    is_active: CreationOptional<boolean>;
    unit?: NonAttribute<Unit>;
    boq_items?: NonAttribute<BoqItem[]>;
}
