import { User } from './models/user.model';
import { Role } from '../rbac/models/role.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private userModel;
    private roleModel;
    constructor(userModel: typeof User, roleModel: typeof Role);
    create(createUserDto: CreateUserDto): Promise<{
        message: string;
        data: {
            id: import("sequelize").CreationOptional<string>;
            role_id: string;
            name: string;
            email: string;
            phone: import("sequelize").CreationOptional<string | null>;
            is_active: import("sequelize").CreationOptional<boolean>;
            last_login: import("sequelize").CreationOptional<Date | null>;
            createdAt?: Date | any;
            updatedAt?: Date | any;
            deletedAt?: Date | any;
            version?: number | any;
        };
    }>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        message: string;
        data: User;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    toggleActive(id: string): Promise<{
        message: string;
        data: User;
    }>;
}
