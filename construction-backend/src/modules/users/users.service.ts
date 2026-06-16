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

import { USER_MESSAGES } from '@/common/messages/user.messages';
import { CdnService } from '../cdn/services/cdn.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,

    @InjectModel(Role)
    private roleModel: typeof Role,

    private readonly cdnService: CdnService,
  ) {}

  // ================= CREATE =================
  // ================= CREATE =================
  async create(createUserDto: CreateUserDto) {
    const { email, password, ...rest } = createUserDto;

    const existingUser = await this.userModel.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(USER_MESSAGES.EMAIL_EXISTS);
    }

    // Default role assigned automatically
    const defaultRole = await this.roleModel.findOne({
      where: {
        name: 'employee', // change according to your seed data
      },
    });

    if (!defaultRole) {
      throw new BadRequestException('Default role not configured in system');
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      ...rest,
      email,

      role_id: defaultRole.id,

      password_hash,

      // Requires admin approval
      is_active: false,

      // Requires email verification
      is_email_verified: false,
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

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    file?: Express.Multer.File,
  ) {
    const user = await this.findOne(id);

    const updatePayload: any = { ...updateUserDto };

    if (file) {
      const uploaded = await this.cdnService.uploadFile(file);
      updatePayload.avatar_url = uploaded.url;
      updatePayload.avatar_thumbnail = uploaded.url; // TODO: generate real thumbnail
    }

    // Remove undefined values
    Object.keys(updatePayload).forEach((key) => {
      if (updatePayload[key] === undefined) delete updatePayload[key];
    });

    await user.update(updatePayload);

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
