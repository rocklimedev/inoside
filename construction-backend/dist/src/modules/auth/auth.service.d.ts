import { JwtService } from '@nestjs/jwt';
import { User } from '../users/models/user.model';
import { Role } from '../rbac/models/role.model';
import { AuthEngagementService } from '../engagement/services/auth-engagement.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthUserResponse } from './interface/auth-user.interface';
import { LoginResponse } from './interface/login-user.interface';
export declare class AuthService {
    private readonly userModel;
    private readonly roleModel;
    private readonly jwtService;
    private readonly authEngagement;
    constructor(userModel: typeof User, roleModel: typeof Role, jwtService: JwtService, authEngagement: AuthEngagementService);
    register(createUserDto: CreateUserDto): Promise<AuthUserResponse>;
    login(loginDto: LoginDto): Promise<LoginResponse>;
    validateUser(userId: string): Promise<AuthUserResponse>;
    private formatUserResponse;
}
