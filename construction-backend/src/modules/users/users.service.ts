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

// ================= CENTRAL MESSAGES =================

import { USER_MESSAGES } from '@/common/messages/user.messages';

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
      throw new ConflictException(USER_MESSAGES.EMAIL_EXISTS);
    }

    const role = await this.roleModel.findByPk(role_id);

    if (!role) {
      throw new BadRequestException(USER_MESSAGES.INVALID_ROLE);
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      ...rest,
      email,
      role_id,
      password_hash,
    });

    const { password_hash: _, ...result } = user.toJSON();

    return {
      message: USER_MESSAGES.CREATED,
      data: result,
    };
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
      throw new NotFoundException(USER_MESSAGES.NOT_FOUND(id));
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
        throw new ConflictException(USER_MESSAGES.EMAIL_IN_USE);
      }
    }

    if (updateUserDto.role_id) {
      const role = await this.roleModel.findByPk(updateUserDto.role_id);

      if (!role) {
        throw new BadRequestException(USER_MESSAGES.INVALID_ROLE);
      }
    }

    await user.update(updateUserDto);

    return {
      message: USER_MESSAGES.UPDATED,
      data: await this.findOne(id),
    };
  }

  // ================= DELETE =================

  async remove(id: string) {
    const user = await this.findOne(id);

    await user.destroy();

    return {
      message: USER_MESSAGES.DELETED,
    };
  }

  // ================= TOGGLE ACTIVE =================

  async toggleActive(id: string) {
    const user = await this.findOne(id);

    await user.update({
      is_active: !user.is_active,
    });

    return {
      message: USER_MESSAGES.TOGGLED,
      data: await this.findOne(id),
    };
  }
}
