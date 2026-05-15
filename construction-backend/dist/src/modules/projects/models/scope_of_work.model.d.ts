import { Model } from 'sequelize-typescript';
import { Project } from './project.model';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
export declare class ScopeOfWork extends Model<InferAttributes<ScopeOfWork>, InferCreationAttributes<ScopeOfWork>> {
    id: CreationOptional<string>;
    project_id: string;
    scope_summary: string;
    civil_works: any;
    mep_works: any;
    interior_works: any;
    finishes: any;
    area_summary: any;
    scope_pdf_url: string;
    project?: NonAttribute<Project>;
}
