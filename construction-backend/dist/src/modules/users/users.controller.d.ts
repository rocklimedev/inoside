import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto): Promise<{
        message: string;
        data: {
            id: import("sequelize").CreationOptional<string>;
            role_id: string;
            name: string;
            email: string;
            phone: import("sequelize").CreationOptional<string | null>;
            avatar_url: import("sequelize").CreationOptional<string | null>;
            avatar_thumbnail: import("sequelize").CreationOptional<string | null>;
            is_active: import("sequelize").CreationOptional<boolean>;
            is_email_verified: import("sequelize").CreationOptional<boolean>;
            last_login: import("sequelize").CreationOptional<Date | null>;
            createdAt?: Date | any;
            updatedAt?: Date | any;
            deletedAt?: Date | any;
            version?: number | any;
        };
    }>;
    update(id: string, dto: UpdateUserDto, file: Express.Multer.File): Promise<{
        message: string;
        data: import("./models/user.model").User;
    }>;
    findAll(): Promise<import("./models/user.model").User[]>;
    findOne(id: string): Promise<import("./models/user.model").User>;
    remove(id: string): Promise<{
        message: string;
    }>;
    toggleActive(id: string): Promise<{
        message: string;
        data: import("./models/user.model").User;
    }>;
}
