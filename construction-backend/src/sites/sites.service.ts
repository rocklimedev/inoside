import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Site } from './entities/site.entity';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

@Injectable()
export class SitesService {
  constructor(
    @InjectRepository(Site)
    private readonly siteRepo: Repository<Site>,
  ) {}

  async create(dto: CreateSiteDto): Promise<Site> {
    const site = this.siteRepo.create(dto);
    return this.siteRepo.save(site);
  }

  async findAll() {
    return this.siteRepo.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Site> {
    const site = await this.siteRepo.findOneBy({ id });
    if (!site) throw new NotFoundException(`Site with ID ${id} not found`);
    return site;
  }

  async update(id: number, updateDto: UpdateSiteDto): Promise<Site> {
    const site = await this.findOne(id);
    Object.assign(site, updateDto);
    return this.siteRepo.save(site);
  }

  async remove(id: number): Promise<void> {
    const site = await this.findOne(id);
    await this.siteRepo.remove(site);
  }
}
