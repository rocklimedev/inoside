import { Model } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
import { Vendor } from './vendor.model';
export declare class VendorType extends Model<InferAttributes<VendorType>, InferCreationAttributes<VendorType>> {
    id: CreationOptional<string>;
    name: string;
    vendors?: NonAttribute<Vendor[]>;
}
