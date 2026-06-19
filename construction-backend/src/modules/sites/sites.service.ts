import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { v4 as uuid } from 'uuid';

import { Site } from './models/site.model';

import { Address } from '../address/models/address.model';

import { Client } from '../clients/models/client.model';

import { CreateSiteDto } from './dto/create-site.dto';

import { UpdateSiteDto } from './dto/update-site.dto';

import { SiteEngagementService } from '../engagement/services/site-engagement.service';

@Injectable()
export class SitesService {
  constructor(
    @InjectModel(Site)
    private siteModel: typeof Site,

    @InjectModel(Address)
    private addressModel: typeof Address,

    private readonly siteEngagementService: SiteEngagementService,
  ) {}

  // ======================================================
  // CREATE SITE
  // ======================================================

  async create(
    createSiteDto: CreateSiteDto,
    actor: {
      id: string;
      name: string;
    },
  ) {
    const address = await this.addressModel.create({
      id: uuid(),

      ...createSiteDto.address,
    });

    const site = await this.siteModel.create({
      id: uuid(),

      client_id: createSiteDto.client_id,

      address_id: address.id,

      ownership_status: createSiteDto.ownership_status,

      access_available: createSiteDto.access_available,

      existing_structure: createSiteDto.existing_structure,
    });

    const createdSite = await this.siteModel.findByPk(site.id, {
      include: [Address, Client],
    });

    await this.siteEngagementService.siteCreated(actor, {
      id: site.id,
      clientId: site.client_id,
    });

    return createdSite;
  }

  // ======================================================
  // GET ALL SITES
  // ======================================================

  async findAll() {
    return this.siteModel.findAll({
      include: [Address, Client],

      order: [['created_at', 'DESC']],
    });
  }

  // ======================================================
  // GET SINGLE SITE
  // ======================================================

  async findOne(id: string) {
    const site = await this.siteModel.findByPk(id, {
      include: [Address, Client],
    });

    if (!site) {
      throw new NotFoundException(`Site with ID ${id} not found`);
    }

    return site;
  }

  // ======================================================
  // GET SITES BY CLIENT
  // ======================================================

  async findByClient(clientId: string) {
    return this.siteModel.findAll({
      where: {
        client_id: clientId,
      },

      include: [Address, Client],

      order: [['created_at', 'DESC']],
    });
  }

  // ======================================================
  // UPDATE SITE
  // ======================================================

  async update(
    id: string,
    updateSiteDto: UpdateSiteDto,
    actor: {
      id: string;
      name: string;
    },
  ) {
    const site = await this.findOne(id);

    const oldValues = site.toJSON();

    // ======================================================
    // UPDATE ADDRESS
    // ======================================================

    if (updateSiteDto.address) {
      const address = await this.addressModel.findByPk(site.address_id);

      if (address) {
        await address.update(updateSiteDto.address);
      }
    }

    // ======================================================
    // UPDATE SITE
    // ======================================================

    await site.update({
      client_id: updateSiteDto.client_id ?? site.client_id,

      ownership_status: updateSiteDto.ownership_status,

      access_available: updateSiteDto.access_available,

      existing_structure: updateSiteDto.existing_structure,
    });

    const updatedSite = await this.findOne(id);

    await this.siteEngagementService.siteUpdated(
      actor,
      {
        id: site.id,
        clientId: site.client_id,
      },
      oldValues,
      updatedSite.toJSON(),
    );

    return updatedSite;
  }

  // ======================================================
  // DELETE SITE
  // ======================================================

  async remove(
    id: string,
    actor: {
      id: string;
      name: string;
    },
  ) {
    const site = await this.findOne(id);

    await this.siteEngagementService.siteDeleted(actor, {
      id: site.id,
      clientId: site.client_id,
    });

    const addressId = site.address_id;

    await site.destroy();

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
