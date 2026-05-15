import { Model } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
import { Boq } from './boq.model';
export declare class BoqCategory extends Model<InferAttributes<BoqCategory>, InferCreationAttributes<BoqCategory>> {
    id: CreationOptional<string>;
    name: string;
    code: CreationOptional<string | null>;
    description: CreationOptional<string | null>;
    sort_order: CreationOptional<number>;
    is_active: CreationOptional<boolean>;
    boqs?: NonAttribute<Boq[]>;
}
