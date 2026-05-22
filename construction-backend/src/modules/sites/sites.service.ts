import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { v4 as uuid } from 'uuid';

import { Site } from './models/site.model';
import { Address } from '../address/models/address.model';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

@Injectable()
export class SitesService {
  constructor(
    @InjectModel(Site)
    private siteModel: typeof Site,

    @InjectModel(Address)
    private addressModel: typeof Address,
  ) {}

  async create(createSiteDto: CreateSiteDto) {
    const address = await this.addressModel.create({
      id: uuid(),

      ...createSiteDto.address,
    });

    const site = await this.siteModel.create({
      id: uuid(),

      address_id: address.id,

      ownership_status: createSiteDto.ownership_status,

      access_available: createSiteDto.access_available,

      existing_structure: createSiteDto.existing_structure,
    });

    return this.siteModel.findByPk(site.id, {
      include: [Address],
    });
  }

  async findAll() {
    return this.siteModel.findAll({
      include: [Address],

      order: [['created_at', 'DESC']],
    });
  }

  async findOne(id: string) {
    const site = await this.siteModel.findByPk(id, {
      include: [Address],
    });

    if (!site) {
      throw new NotFoundException(`Site with ID ${id} not found`);
    }

    return site;
  }

  async update(id: string, updateSiteDto: UpdateSiteDto) {
    const site = await this.findOne(id);

    // UPDATE ADDRESS
    if (updateSiteDto.address) {
      const address = await this.addressModel.findByPk(site.address_id);

      if (address) {
        await address.update(updateSiteDto.address);
      }
    }

    // UPDATE SITE
    await site.update({
      ownership_status: updateSiteDto.ownership_status,

      access_available: updateSiteDto.access_available,

      existing_structure: updateSiteDto.existing_structure,
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    const site = await this.findOne(id);

    const addressId = site.address_id;

    await site.destroy();

    // OPTIONAL:
    // delete unused address too
    if (addressId) {
      await this.addressModel.destroy({
        where: {
          id: addressId,
        },
      });
    }

    return {
      message: 'Site deleted successfully',
    };
  }
}
