import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';
import { Client } from './models/client.model';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(@InjectModel(Client) private clientModel: typeof Client) {}

  // ================= CREATE =================

  async create(dto: CreateClientDto) {
    if (dto.email) {
      const existing = await this.clientModel.findOne({
        where: { email: dto.email },
      });

      if (existing) {
        throw new ConflictException('Client with this email already exists');
      }
    }

    return this.clientModel.create(dto);
  }

  // ================= READ ALL =================

  async findAll() {
    return this.clientModel.findAll({
      order: [['created_at', 'DESC']],
    });
  }

  // ================= READ ONE =================

  async findOne(id: string) {
    const client = await this.clientModel.findByPk(id);

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }

  // ================= UPDATE =================

  async update(id: string, dto: UpdateClientDto) {
    const client = await this.findOne(id);

    if (dto.email) {
      const existing = await this.clientModel.findOne({
        where: { email: dto.email },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Email already in use');
      }
    }

    await client.update(dto);
    return client;
  }

  // ================= DELETE =================

  async remove(id: string) {
    const client = await this.findOne(id);
    await client.destroy();

    return {
      message: 'Client deleted successfully',
    };
  }
}
