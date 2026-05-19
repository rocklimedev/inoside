import { Model } from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import type { CreationOptional } from 'sequelize';
import { Project } from '../../projects/models/project.model';
import { Material } from './materials.model';
import { Vendor } from '../../vendors/models/vendor.model';
import { User } from '../../users/models/user.model';
export declare class InventoryRequest extends Model<InferAttributes<InventoryRequest>, InferCreationAttributes<InventoryRequest>> {
    id: CreationOptional<string>;
    project_id: string;
    project?: Project;
    material_id?: string;
    material?: Material;
    quantity_required: number;
    required_date?: string;
    vendor_id?: string;
    vendor?: Vendor;
    source_type: 'Vendor' | 'Warehouse';
    status: 'requested' | 'approved' | 'dispatched' | 'delivered';
    requested_by?: string;
    requester?: User;
    approved_by?: string;
    approver?: User;
    created_at: CreationOptional<Date>;
}
