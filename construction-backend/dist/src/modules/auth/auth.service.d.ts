import { JwtService } from '@nestjs/jwt';
import { User } from '../users/models/user.model';
import { Role } from '../rbac/models/role.model';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
export interface AuthUserResponse {
    id: string;
    name: string;
    email: string;
    role: Role | null;
    is_active: boolean;
    is_email_verified: boolean;
    last_login?: Date | null;
}
export interface LoginResponse {
    access_token: string;
    user: AuthUserResponse;
}
export declare class AuthService {
    private readonly userModel;
    private readonly roleModel;
    private readonly jwtService;
    constructor(userModel: typeof User, roleModel: typeof Role, jwtService: JwtService);
    register(createUserDto: CreateUserDto): Promise<AuthUserResponse>;
    login(loginDto: LoginDto): Promise<LoginResponse>;
    validateUser(userId: string): Promise<AuthUserResponse>;
    private formatUserResponse;
}
