import { Model } from 'sequelize-typescript';
import type { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';
import { Role } from '../../rbac/models/role.model';
export declare class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    id: CreationOptional<string>;
    role_id: string;
    name: string;
    email: string;
    phone: CreationOptional<string | null>;
    password_hash: string;
    is_active: CreationOptional<boolean>;
    last_login: CreationOptional<Date | null>;
    role?: NonAttribute<Role>;
}
