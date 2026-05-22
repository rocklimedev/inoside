import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { SitesService } from './sites.service';
import { SitesController } from './sites.controller';

import { Site } from './models/site.model';

import { Address } from '@/modules/address/models/address.model';

@Module({
  imports: [SequelizeModule.forFeature([Site, Address])],

  controllers: [SitesController],

  providers: [SitesService],

  exports: [SitesService],
})
export class SitesModule {}
