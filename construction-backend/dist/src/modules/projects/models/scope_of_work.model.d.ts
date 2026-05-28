import { Model } from 'sequelize-typescript';
import { Project } from './project.model';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
export declare class ScopeOfWork extends Model<InferAttributes<ScopeOfWork>, InferCreationAttributes<ScopeOfWork>> {
    id: CreationOptional<string>;
    project_id: string;
    scope_summary: string | null;
    civil_works: any[] | null;
    mep_works: any[] | null;
    interior_works: any[] | null;
    finishes: any[] | null;
    area_summary: any[] | null;
    scope_pdf_url: string | null;
    project?: NonAttribute<Project>;
}
