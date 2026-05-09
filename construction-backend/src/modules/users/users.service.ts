import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { User } from './models/user.model';
import { Role } from '../rbac/models/role.model';

import * as bcrypt from 'bcryptjs';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Role)
    private roleModel: typeof Role,
  ) {}

  // ================= CREATE =================

  async create(createUserDto: CreateUserDto) {
    const { email, password, role_id, ...rest } = createUserDto;

    const existingUser = await this.userModel.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const role = await this.roleModel.findByPk(role_id);

    if (!role) {
      throw new BadRequestException('Invalid role_id');
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      ...rest,
      email,
      role_id,
      password_hash,
    });

    const { password_hash: _, ...result } = user.toJSON();

    return result;
  }

  // ================= READ ALL =================

  async findAll() {
    return this.userModel.findAll({
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          model: Role,
          attributes: ['id', 'name', 'display_name'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  // ================= READ ONE =================

  async findOne(id: string) {
    const user = await this.userModel.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          model: Role,
          attributes: ['id', 'name', 'display_name', 'description'],
        },
      ],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  // ================= FIND BY EMAIL =================

  async findByEmail(email: string) {
    return this.userModel.findOne({
      where: { email },
      include: [{ model: Role }],
    });
  }

  // ================= UPDATE =================

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (updateUserDto.email) {
      const existing = await this.userModel.findOne({
        where: { email: updateUserDto.email },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Email already in use');
      }
    }

    if (updateUserDto.role_id) {
      const role = await this.roleModel.findByPk(updateUserDto.role_id);

      if (!role) {
        throw new BadRequestException('Invalid role_id');
      }
    }

    await user.update(updateUserDto);

    return this.findOne(id);
  }

  // ================= DELETE =================

  async remove(id: string) {
    const user = await this.findOne(id);

    await user.destroy();

    return {
      message: 'User deleted successfully',
    };
  }

  // ================= TOGGLE ACTIVE =================

  async toggleActive(id: string) {
    const user = await this.findOne(id);

    await user.update({
      is_active: !user.is_active,
    });

    return this.findOne(id);
  }
}
