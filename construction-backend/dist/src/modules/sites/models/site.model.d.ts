import { Model } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
import { Project } from '../../projects/models/project.model';
export declare class Site extends Model<InferAttributes<Site>, InferCreationAttributes<Site>> {
    id: CreationOptional<string>;
    address: string;
    city: string;
    ownership_status: 'Owned' | 'Rented' | 'Under Process' | null;
    access_available: CreationOptional<boolean>;
    existing_structure: CreationOptional<boolean>;
    project?: NonAttribute<Project>;
}
