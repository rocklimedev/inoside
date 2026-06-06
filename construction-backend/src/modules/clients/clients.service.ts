import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';
import { Client } from './models/client.model';

import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

import { ClientEngagementService } from '@/modules/engagement/services/client-engagement.service';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client)
    private clientModel: typeof Client,

    private readonly clientEngagementService: ClientEngagementService,
  ) {}

  // ================= CREATE =================

  async create(dto: CreateClientDto, actor: { id: string; name: string }) {
    if (dto.email) {
      const existing = await this.clientModel.findOne({
        where: { email: dto.email },
      });

      if (existing) {
        await this.clientEngagementService.duplicateEmailAttempt(
          actor,
          dto.email,
        );

        throw new ConflictException('Client with this email already exists');
      }
    }

    const client = await this.clientModel.create(dto);

    await this.clientEngagementService.clientCreated(actor, {
      id: client.id,
      name: client.name,
      email: client.email ?? undefined,
    });

    return client;
  }

  // ================= READ ALL =================

  async findAll(actor?: { id: string; name: string }) {
    const clients = await this.clientModel.findAll({
      order: [['created_at', 'DESC']],
    });

    // optional: bulk view tracking can be noisy, so usually skipped
    return clients;
  }

  // ================= READ ONE =================

  async findOne(id: string, actor?: { id: string; name: string }) {
    const client = await this.clientModel.findByPk(id);

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    if (actor) {
      await this.clientEngagementService.clientViewed(actor, client);
    }

    return client;
  }

  // ================= UPDATE =================

  async update(
    id: string,
    dto: UpdateClientDto,
    actor: { id: string; name: string },
  ) {
    const client = await this.findOne(id);

    if (dto.email) {
      const existing = await this.clientModel.findOne({
        where: { email: dto.email },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Email already in use');
      }
    }

    const oldValues = { ...client.get() };

    await client.update(dto);

    await this.clientEngagementService.clientUpdated(
      actor,
      client,
      oldValues,
      dto,
    );

    return client;
  }

  // ================= DELETE =================

  async remove(id: string, actor: { id: string; name: string }) {
    const client = await this.findOne(id);

    await client.destroy();

    await this.clientEngagementService.clientDeleted(actor, client);

    return {
      message: 'Client deleted successfully',
    };
  }
}
