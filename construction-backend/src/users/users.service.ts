import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from './entities/user.entity';
import { Address } from './entities/address.entity';
import { Role } from '@/rbac/entities/role.entity';
import { UserRole } from '../common/enums';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Address) private addressRepo: Repository<Address>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
  ) {}

  // ====================== CREATE (FIXED) ======================
  async create(dto: CreateUserDto): Promise<User> {
    // ✅ Check duplicate email
    const exists = await this.usersRepo.findOne({
      where: { email: dto.email },
    });

    if (exists) {
      throw new ConflictException('Email already in use');
    }

    // ✅ FETCH ROLE (🔥 MAIN FIX)
    const role = await this.roleRepo.findOne({
      where: { id: dto.roleId },
    });

    if (!role) {
      throw new BadRequestException(`Invalid roleId: ${dto.roleId}`);
    }

    // ✅ HASH PASSWORD
    const password_hash = await bcrypt.hash(dto.password, 10);

    // ✅ CREATE USER (🔥 DO NOT SPREAD DTO)
    const user = this.usersRepo.create({
      full_name: dto.full_name,
      email: dto.email,
      phone: dto.phone,
      role, // 🔥 REQUIRED
      password_hash,
      preferred_comm: dto.preferred_comm,
    });

    return this.usersRepo.save(user);
  }

  // ====================== READ ======================
  async findAll(): Promise<User[]> {
    return this.usersRepo.find({
      relations: ['primary_address', 'role'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepo.findOne({
      where: { id },
      relations: ['primary_address', 'role'],
    });

    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  // ====================== ROLE QUERIES ======================
  async findByRoleId(roleId: number): Promise<User[]> {
    return this.usersRepo.find({
      where: { role: { id: roleId } },
      relations: ['role', 'primary_address'],
      order: { full_name: 'ASC' },
    });
  }

  async findByRole(role: UserRole): Promise<User[]> {
    const roleEntity = await this.roleRepo.findOne({
      where: { name: role },
    });

    if (!roleEntity) {
      throw new BadRequestException(`Role "${role}" not found`);
    }

    return this.findByRoleId(roleEntity.id);
  }

  async findByRoleName(roleName: string): Promise<User[]> {
    return this.usersRepo.find({
      where: { role: { name: roleName } },
      relations: ['role', 'primary_address'],
      order: { full_name: 'ASC' },
    });
  }

  // ====================== COUNTS ======================
  async countByRoleId(roleId: number): Promise<number> {
    return this.usersRepo.count({
      where: { role: { id: roleId } },
    });
  }

  async countActiveByRoleId(roleId: number): Promise<number> {
    return this.usersRepo.count({
      where: {
        role: { id: roleId },
        is_active: true,
      },
    });
  }

  async countAdmins(): Promise<number> {
    return this.usersRepo.count({
      where: { role: { name: 'admin' } },
    });
  }

  // ====================== ROLE MANAGEMENT ======================
  async findAllRoles(): Promise<Role[]> {
    return this.roleRepo.find({ order: { id: 'ASC' } });
  }

  async findRoleById(id: number): Promise<Role | null> {
    return this.roleRepo.findOne({ where: { id } });
  }

  // ====================== UPDATE ======================
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (dto.email && dto.email !== user.email) {
      const exists = await this.usersRepo.findOne({
        where: { email: dto.email },
      });

      if (exists) {
        throw new ConflictException('Email already in use');
      }
    }

    // ✅ HANDLE ROLE UPDATE
    if (dto.roleId) {
      const role = await this.roleRepo.findOne({
        where: { id: dto.roleId },
      });

      if (!role) {
        throw new BadRequestException(`Invalid roleId: ${dto.roleId}`);
      }

      user.role = role;
    }

    // ✅ HANDLE PASSWORD
    if (dto.password) {
      user.password_hash = await bcrypt.hash(dto.password, 10);
    }

    // ✅ ASSIGN OTHER FIELDS
    if (dto.full_name) user.full_name = dto.full_name;
    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.preferred_comm) user.preferred_comm = dto.preferred_comm;

    return this.usersRepo.save(user);
  }

  async updateUserRole(userId: string, roleId: number): Promise<User> {
    const user = await this.findOne(userId);

    const role = await this.roleRepo.findOne({
      where: { id: roleId },
    });

    if (!role) {
      throw new BadRequestException(`Invalid roleId: ${roleId}`);
    }

    if (user.role?.name === 'admin' && role.name !== 'admin') {
      const adminCount = await this.countAdmins();
      if (adminCount <= 1) {
        throw new BadRequestException('Cannot remove the last admin');
      }
    }

    user.role = role;
    return this.usersRepo.save(user);
  }

  // ====================== SOFT DELETE ======================
  async softDelete(id: string): Promise<void> {
    const user = await this.findOne(id);

    if (!user.is_active) {
      throw new BadRequestException('User already inactive');
    }

    user.is_active = false;
    await this.usersRepo.save(user);
  }

  async activateUser(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.is_active = true;
    return this.usersRepo.save(user);
  }

  async deactivateUser(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.is_active = false;
    return this.usersRepo.save(user);
  }

  async findActiveUsers(): Promise<User[]> {
    return this.usersRepo.find({
      where: { is_active: true },
      relations: ['role'],
    });
  }

  // ====================== ADDRESS ======================
  async assignPrimaryAddress(userId: string, addressId: string): Promise<User> {
    const user = await this.findOne(userId);

    const address = await this.addressRepo.findOne({
      where: { id: addressId, entity_id: userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found for user');
    }

    user.primary_address_id = addressId;
    return this.usersRepo.save(user);
  }

  // ====================== PASSWORD ======================
  async changePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.usersRepo.findOne({ where: { id } });

    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);

    if (!isMatch) {
      throw new BadRequestException('Old password incorrect');
    }

    user.password_hash = await bcrypt.hash(newPassword, 10);
    await this.usersRepo.save(user);
  }

  // ====================== AUTH ======================
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepo.findOne({
      where: { email },
      relations: ['role'],
    });

    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return null;

    const { password_hash, ...result } = user;
    return result;
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    const user = await this.usersRepo.findOne({ where: { email } });
    return !user;
  }
}
