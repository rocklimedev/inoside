import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import * as bcrypt from 'bcryptjs';

import { User } from './models/user.model';
import { Role } from '../rbac/models/role.model';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { USER_MESSAGES } from '@/common/messages/user.messages';

import { CdnService } from '../cdn/services/cdn.service';
import { UserEngagementService } from '@/modules/engagement/services/user-engagement.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,

    @InjectModel(Role)
    private roleModel: typeof Role,

    private readonly cdnService: CdnService,

    private readonly userEngagementService: UserEngagementService,
  ) {}

  // ================= CREATE =================

  async create(
    createUserDto: CreateUserDto,
    actor: {
      id: string;
      name: string;
    },
  ) {
    const { email, password, ...rest } = createUserDto;

    const existingUser = await this.userModel.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(USER_MESSAGES.EMAIL_EXISTS);
    }

    const defaultRole = await this.roleModel.findOne({
      where: {
        name: 'employee',
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

      is_active: false,

      is_email_verified: false,
    });

    await this.userEngagementService.userCreated(actor, {
      id: user.id,
      name: user.name,
      email: user.email,
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
      attributes: {
        exclude: ['password_hash'],
      },

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
      attributes: {
        exclude: ['password_hash'],
      },

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

  // ================= UPDATE =================

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    actor: {
      id: string;
      name: string;
    },
    file?: Express.Multer.File,
  ) {
    const user = await this.findOne(id);

    const oldValues = user.toJSON();

    const updatePayload: any = {
      ...updateUserDto,
    };

    if (file) {
      const uploaded = await this.cdnService.uploadFile(file);

      updatePayload.avatar_url = uploaded.url;
      updatePayload.avatar_thumbnail = uploaded.url;
    }

    Object.keys(updatePayload).forEach((key) => {
      if (updatePayload[key] === undefined) {
        delete updatePayload[key];
      }
    });

    await user.update(updatePayload);

    const updatedUser = await this.findOne(id);

    await this.userEngagementService.userUpdated(
      actor,
      {
        id: user.id,
        name: user.name,
      },
      oldValues,
      updatedUser.toJSON(),
    );

    return {
      message: USER_MESSAGES.UPDATED,
      data: updatedUser,
    };
  }

  // ================= DELETE =================

  async remove(
    id: string,
    actor: {
      id: string;
      name: string;
    },
  ) {
    const user = await this.findOne(id);

    await this.userEngagementService.userDeleted(actor, {
      id: user.id,
      name: user.name,
    });

    await user.destroy();

    return {
      message: USER_MESSAGES.DELETED,
    };
  }

  // ================= TOGGLE ACTIVE =================

  async toggleActive(
    id: string,
    actor: {
      id: string;
      name: string;
    },
  ) {
    const user = await this.findOne(id);

    const newStatus = !user.is_active;

    await user.update({
      is_active: newStatus,
    });

    await this.userEngagementService.userStatusChanged(actor, {
      id: user.id,
      name: user.name,
      isActive: newStatus,
    });

    return {
      message: USER_MESSAGES.TOGGLED,
      data: await this.findOne(id),
    };
  }
}
