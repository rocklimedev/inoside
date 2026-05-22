import { Model } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
import { Project } from '../../projects/models/project.model';
import { Address } from '@/modules/address/models/address.model';
export declare class Site extends Model<InferAttributes<Site>, InferCreationAttributes<Site>> {
    id: CreationOptional<string>;
    address_id: string;
    address?: NonAttribute<Address>;
    ownership_status: 'Owned' | 'Rented' | 'Under Process' | null;
    access_available: CreationOptional<boolean>;
    existing_structure: CreationOptional<boolean>;
    created_at: CreationOptional<Date>;
    updated_at: CreationOptional<Date>;
    project?: NonAttribute<Project>;
}
