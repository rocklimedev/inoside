import { Model } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
import { BoqItem } from './boq-item.model';
export declare class Unit extends Model<InferAttributes<Unit>, InferCreationAttributes<Unit>> {
    id: CreationOptional<string>;
    name: string;
    short_name: string;
    boqItems?: NonAttribute<BoqItem[]>;
}
