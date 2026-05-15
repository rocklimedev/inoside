import { Model } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
import { BoqSection } from './boq-section.model';
import { BoqItem } from './boq-item.model';
export declare class BoqSubHeading extends Model<InferAttributes<BoqSubHeading>, InferCreationAttributes<BoqSubHeading>> {
    id: CreationOptional<string>;
    section_id: string;
    title: string;
    description: CreationOptional<string | null>;
    sort_order: CreationOptional<number>;
    boq_id?: string;
    section?: NonAttribute<BoqSection>;
    items?: NonAttribute<BoqItem[]>;
}
