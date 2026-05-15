import { Model } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
import { User } from '@/modules/users/models/user.model';
import { Permission } from './permission.model';
export declare class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
    id: CreationOptional<string>;
    name: string;
    display_name: string;
    description: CreationOptional<string | null>;
    users?: NonAttribute<User[]>;
    permissions?: NonAttribute<Permission[]>;
}
