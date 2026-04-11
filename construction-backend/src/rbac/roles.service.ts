import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  // =============================================
  // CREATE ROLE
  // =============================================
  async createRole(dto: CreateRoleDto): Promise<Role> {
    const name = dto.name.toLowerCase().trim();

    const existing = await this.roleRepository.findOne({
      where: { name },
    });

    if (existing) {
      throw new BadRequestException('Role already exists');
    }

    const role = this.roleRepository.create({
      ...dto,
      name,
    });

    return this.roleRepository.save(role);
  }

  // =============================================
  // GET ALL ROLES
  // =============================================
  async findAll(): Promise<Role[]> {
    return this.roleRepository.find({
      order: { id: 'ASC' },
    });
  }

  // =============================================
  // GET ROLE BY ID
  // =============================================
  async findById(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException(`Role not found with id ${id}`);
    }

    return role;
  }

  // =============================================
  // GET ROLE BY NAME
  // =============================================
  async findByName(name: string): Promise<Role | null> {
    return this.roleRepository.findOne({
      where: { name: name.toLowerCase().trim() },
    });
  }

  // =============================================
  // DELETE ROLE
  // =============================================
  async deleteRole(id: number): Promise<void> {
    const role = await this.findById(id);

    if (role.name === 'admin') {
      throw new BadRequestException('Cannot delete admin role');
    }

    await this.roleRepository.remove(role);
  }
}
