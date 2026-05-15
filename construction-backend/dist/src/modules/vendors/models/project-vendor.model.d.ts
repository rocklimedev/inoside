import { Model } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
import { Project } from '../../projects/models/project.model';
import { Vendor } from './vendor.model';
export declare class ProjectVendor extends Model<InferAttributes<ProjectVendor>, InferCreationAttributes<ProjectVendor>> {
    id: CreationOptional<string>;
    project_id: string;
    vendor_id: CreationOptional<string | null>;
    selected: CreationOptional<boolean>;
    selection_reason: CreationOptional<string | null>;
    approved_estimate_value: CreationOptional<number | null>;
    scope_summary: CreationOptional<string | null>;
    final_estimate_url: CreationOptional<string | null>;
    project?: NonAttribute<Project>;
    vendor?: NonAttribute<Vendor>;
}
