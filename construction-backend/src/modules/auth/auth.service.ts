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
  id: number;
  name: string;
  email: string;
  role: Role | null;
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

  async register(createUserDto: CreateUserDto): Promise<AuthUserResponse> {
    const { email, password, role_id, ...rest } = createUserDto;

    // Check existing user
    const existingUser = await this.userModel.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Validate role
    const role = await this.roleModel.findByPk(role_id);

    if (!role) {
      throw new BadRequestException('Invalid role_id provided');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);

    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    const user = await this.userModel.create({
      name: rest.name,
      phone: rest.phone,
      is_active: rest.is_active,
      email,
      role_id,
      password_hash,
    });

    // Reload user with role
    const createdUser = await this.userModel.findByPk(user.id, {
      include: [
        {
          model: Role,
        },
      ],
    });

    if (!createdUser) {
      throw new BadRequestException('Failed to create user');
    }

    return {
      id: Number(createdUser.id),
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role ?? null,
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({
      where: {
        email,
        is_active: true,
      },

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

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await user.update({
      last_login: new Date(),
    });

    // Load permissions
    const permissions = await Permission.findAll({
      include: [
        {
          model: Role,
          where: {
            id: user.role_id,
          },

          through: {
            attributes: [],
          },
        },
      ],
    });

    const payload = {
      sub: Number(user.id),
      email: user.email,
      name: user.name,
      role: user.role?.name ?? null,

      permissions: permissions.map((permission) => permission.name),
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,

      user: {
        id: Number(user.id),
        name: user.name,
        email: user.email,
        role: user.role ?? null,
      },
    };
  }

  async validateUser(userId: number): Promise<User> {
    const user = await this.userModel.findByPk(userId, {
      include: [
        {
          model: Role,
        },
      ],
    });

    if (!user || !user.is_active) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
