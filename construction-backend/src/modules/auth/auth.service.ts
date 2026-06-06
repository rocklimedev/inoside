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
import { AuthEngagementService } from '../engagement/services/auth-engagement.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthUserResponse } from './interface/auth-user.interface';
import { LoginResponse } from './interface/login-user.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,

    @InjectModel(Role)
    private readonly roleModel: typeof Role,

    private readonly jwtService: JwtService,
    private readonly authEngagement: AuthEngagementService,
  ) {}

  // ================= REGISTER =================
  async register(createUserDto: CreateUserDto): Promise<AuthUserResponse> {
    const { email, password, role_id, avatar_url, avatar_thumbnail, ...rest } =
      createUserDto;

    const existingUser = await this.userModel.findOne({
      where: { email },
    });

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

      // Avatar fields
      avatar_url: avatar_url ?? null,
      avatar_thumbnail: avatar_thumbnail ?? null,

      is_active: rest.is_active ?? true,
      is_email_verified: false,
    });

    const createdUser = await this.userModel.findByPk(user.id, {
      include: [
        {
          model: Role,
          attributes: ['id', 'name', 'display_name'],
        },
      ],
    });

    if (!createdUser) {
      throw new BadRequestException('Failed to create user');
    }
    await this.authEngagement.userRegistered({
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role?.name,
    });
    return this.formatUserResponse(createdUser);
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

    // User not found
    if (!user) {
      await this.authEngagement.loginFailed(email);

      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    // Invalid password
    if (!isPasswordValid) {
      await this.authEngagement.loginFailed(email);

      throw new UnauthorizedException('Invalid credentials');
    }

    // Account inactive
    if (!user.is_active) {
      await this.authEngagement.loginBlocked({
        id: user.id,
        name: user.name,
        email: user.email,
      });

      throw new UnauthorizedException(
        'Account is inactive. Contact administrator.',
      );
    }

    // Update last login
    await user.update({
      last_login: new Date(),
    });

    // Fetch permissions
    const permissions = await Permission.findAll({
      include: [
        {
          model: Role,
          where: { id: user.role_id },
          through: { attributes: [] },
        },
      ],
    });

    // JWT Payload
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,

      avatar_url: user.avatar_url,
      avatar_thumbnail: user.avatar_thumbnail,

      role: user.role?.name ?? null,
      permissions: permissions.map((p) => p.name),
    };

    const access_token = this.jwtService.sign(payload);

    // Successful login audit
    await this.authEngagement.loginSuccess({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role?.name,
    });

    return {
      access_token,
      user: this.formatUserResponse(user),
    };
  }
  // ================= VALIDATE USER =================
  async validateUser(userId: string): Promise<AuthUserResponse> {
    const user = await this.userModel.findByPk(userId, {
      include: [
        {
          model: Role,
          attributes: ['id', 'name', 'display_name'],
        },
      ],
    });

    // User deleted
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // User inactive
    if (!user.is_active) {
      throw new UnauthorizedException('Account is inactive');
    }

    // No role assigned
    if (!user.role_id || !user.role) {
      throw new UnauthorizedException('No role assigned to this account');
    }

    return this.formatUserResponse(user);
  }

  // ================= FORMAT USER RESPONSE =================
  private formatUserResponse(user: User): AuthUserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,

      role: user.role ?? null,

      is_active: user.is_active,
      is_email_verified: user.is_email_verified,

      // Avatar fields
      avatar_url: user.avatar_url,
      avatar_thumbnail: user.avatar_thumbnail,

      last_login: user.last_login,
    };
  }
}
