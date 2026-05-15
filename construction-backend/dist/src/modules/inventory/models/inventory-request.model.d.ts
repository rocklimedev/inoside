import { Model } from 'sequelize-typescript';
import { Project } from '../../projects/models/project.model';
import { Material } from './materials.model';
import { Vendor } from '../../vendors/models/vendor.model';
import { User } from '../../users/models/user.model';
export declare class InventoryRequest extends Model<InventoryRequest> {
    id: string;
    project_id: string;
    project: Project;
    material_id: string;
    material: Material;
    quantity_required: number;
    required_date: Date;
    vendor_id: string;
    vendor: Vendor;
    source_type: string;
    status: string;
    requested_by: string;
    requester: User;
    approved_by: string;
    approver: User;
    created_at: Date;
}
