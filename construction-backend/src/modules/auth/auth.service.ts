import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { User } from '../users/models/user.model';
import { Role } from '../rbac/models/role.model';
import { Permission } from '../rbac/models/permission.model';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

export interface AuthUserResponse {
  id: string;
  name: string;
  email: string;
  role: Role | null;

  is_active: boolean;
  is_email_verified: boolean;

  // Optional fields

  last_login?: Date | null;
}

export interface LoginResponse {
  access_token: string;
  user: AuthUserResponse;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,

    @InjectModel(Role)
    private readonly roleModel: typeof Role,

    private readonly jwtService: JwtService,
  ) {}

  // ================= REGISTER =================
  async register(createUserDto: CreateUserDto): Promise<AuthUserResponse> {
    const { email, password, role_id, ...rest } = createUserDto;

    const existingUser = await this.userModel.findOne({ where: { email } });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const role = await this.roleModel.findByPk(role_id);
    if (!role) {
      throw new BadRequestException('Invalid role_id provided');
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name: rest.name,

      email,
      role_id,
      password_hash,
      is_active: rest.is_active ?? true,
      is_email_verified: false, // Force email verification by default
    });

    // Fetch complete user with role
    const createdUser = await this.userModel.findByPk(user.id, {
      include: [{ model: Role }],
    });

    if (!createdUser) {
      throw new BadRequestException('Failed to create user');
    }

    return {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role ?? null,
      is_active: createdUser.is_active,
      is_email_verified: createdUser.is_email_verified,

      last_login: createdUser.last_login,
    };
  }

  // ================= LOGIN =================
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({
      where: { email },
      include: [
        {
          model: Role,
          attributes: ['id', 'name', 'display_name'],
        },
      ],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await user.update({ last_login: new Date() });

    // Permissions (for JWT payload)
    const permissions = await Permission.findAll({
      include: [
        {
          model: Role,
          where: { id: user.role_id },
          through: { attributes: [] },
        },
      ],
    });

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role?.name ?? null,
      permissions: permissions.map((p) => p.name),
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role ?? null,
        is_active: user.is_active,
        is_email_verified: user.is_email_verified,
        last_login: user.last_login,
      },
    };
  }

  // ================= VALIDATE USER (JWT Guard) =================
  async validateUser(userId: string): Promise<User> {
    const user = await this.userModel.findByPk(userId, {
      include: [{ model: Role }],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.is_active) {
      throw new UnauthorizedException(
        'Account is inactive. Contact administrator.',
      );
    }

    if (!user.is_email_verified) {
      throw new UnauthorizedException('Email is not verified');
    }

    if (!user.role_id || !user.role) {
      throw new UnauthorizedException('No role assigned to this account');
    }

    return user;
  }
}
