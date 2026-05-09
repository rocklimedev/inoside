import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Site } from './models/site.model';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

@Injectable()
export class SitesService {
  constructor(@InjectModel(Site) private siteModel: typeof Site) {}

  async create(createSiteDto: CreateSiteDto) {
    return this.siteModel.create(createSiteDto);
  }

  async findAll() {
    return this.siteModel.findAll({
      order: [['created_at', 'DESC']],
    });
  }

  async findOne(id: number) {
    const site = await this.siteModel.findByPk(id);
    if (!site) {
      throw new NotFoundException(`Site with ID ${id} not found`);
    }
    return site;
  }

  async update(id: number, updateSiteDto: UpdateSiteDto) {
    const site = await this.findOne(id);
    await site.update(updateSiteDto);
    return site;
  }

  async remove(id: number) {
    const site = await this.findOne(id);
    await site.destroy();
    return { message: 'Site deleted successfully' };
  }
}
