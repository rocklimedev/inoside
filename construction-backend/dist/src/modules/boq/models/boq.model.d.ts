import { Model } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
import { Project } from '@/modules/projects/models/project.model';
import { Client } from '@/modules/clients/models/client.model';
import { BoqCategory } from './boq-category.model';
import { BoqSection } from './boq-section.model';
export declare class Boq extends Model<InferAttributes<Boq>, InferCreationAttributes<Boq>> {
    id: CreationOptional<string>;
    project_id: CreationOptional<string | null>;
    client_id: CreationOptional<string | null>;
    boq_category_id: string;
    title: string;
    code: CreationOptional<string | null>;
    revision_no: CreationOptional<string>;
    status: CreationOptional<'draft' | 'submitted' | 'approved' | 'rejected' | 'revised'>;
    notes: CreationOptional<string | null>;
    subtotal: CreationOptional<number>;
    tax_amount: CreationOptional<number>;
    grand_total: CreationOptional<number>;
    prepared_by: CreationOptional<string | null>;
    approved_by: CreationOptional<string | null>;
    project?: NonAttribute<Project>;
    client?: NonAttribute<Client>;
    category?: NonAttribute<BoqCategory>;
    sections?: NonAttribute<BoqSection[]>;
}
