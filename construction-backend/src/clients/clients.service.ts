import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,
  ) {}

  async create(dto: CreateClientDto): Promise<Client> {
    const client = this.clientRepo.create(dto);
    return this.clientRepo.save(client);
  }

  async findAll() {
    return this.clientRepo.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.clientRepo.findOneBy({ id });
    if (!client) throw new NotFoundException(`Client with ID ${id} not found`);
    return client;
  }

  async update(id: number, updateDto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);
    Object.assign(client, updateDto);
    return this.clientRepo.save(client);
  }

  async remove(id: number): Promise<void> {
    const client = await this.findOne(id);
    await this.clientRepo.remove(client);
  }
}
