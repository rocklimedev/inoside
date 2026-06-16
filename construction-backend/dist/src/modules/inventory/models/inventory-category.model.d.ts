import { Model } from 'sequelize-typescript';
export declare class InventoryCategory extends Model {
    id: string;
    name: string;
    code: string;
    parent_id: string | null;
    parent?: InventoryCategory;
    children?: InventoryCategory[];
    sort_order: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
