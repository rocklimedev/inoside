import { Model } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
export declare class RolePermission extends Model<InferAttributes<RolePermission>, InferCreationAttributes<RolePermission>> {
    id: CreationOptional<string>;
    role_id: string;
    permission_id: string;
}
