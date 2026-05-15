import { Model } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
import { BoqSubHeading } from './boq-subheading.model';
import { Boq } from './boq.model';
export declare class BoqSection extends Model<InferAttributes<BoqSection>, InferCreationAttributes<BoqSection>> {
    id: CreationOptional<string>;
    boq_id: string;
    title: string;
    description: CreationOptional<string | null>;
    sort_order: CreationOptional<number>;
    subheadings?: NonAttribute<BoqSubHeading[]>;
    boq?: NonAttribute<Boq>;
}
