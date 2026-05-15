import { Model } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
import { Role } from './role.model';
export declare class Permission extends Model<InferAttributes<Permission>, InferCreationAttributes<Permission>> {
    id: CreationOptional<string>;
    name: string;
    module: string;
    action: string;
    description: CreationOptional<string | null>;
    roles?: NonAttribute<Role[]>;
}
