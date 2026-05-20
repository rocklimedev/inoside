import type { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<import("./auth.service").AuthUserResponse>;
    login(loginDto: LoginDto, res: Response): Promise<void>;
    getProfile(req: any): Promise<{
        message: string;
        user: any;
    }>;
    adminOnly(): Promise<{
        message: string;
    }>;
    logout(res: Response): Promise<Response<any, Record<string, any>>>;
}
