import { Model } from 'sequelize-typescript';
import { Project } from '../../projects/models/project.model';
import { ProjectMaterial } from './project-materials.model';
import { Vendor } from '../../vendors/models/vendor.model';
import { User } from '../../users/models/user.model';
export declare class InventoryRequest extends Model {
    id: string;
    project_id: string;
    project: Project;
    project_material_id: string;
    projectMaterial: ProjectMaterial;
    quantity_required: number | null;
    required_date: string | null;
    vendor_id: string | null;
    vendor?: Vendor;
    source_type: 'Vendor' | 'Warehouse' | 'Site Stock';
    status: string;
    remarks: string | null;
    requested_by: string | null;
    requester?: User;
    approved_by: string | null;
    approver?: User;
    created_at: Date;
    updated_at: Date;
}
