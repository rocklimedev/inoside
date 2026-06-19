import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { SitesService } from './sites.service';
import { SitesController } from './sites.controller';

import { Site } from './models/site.model';

import { Address } from '@/modules/address/models/address.model';
import { EngagementModule } from '../engagement/engagement.module';

@Module({
  imports: [SequelizeModule.forFeature([Site, Address]), EngagementModule],

  controllers: [SitesController],

  providers: [SitesService],

  exports: [SitesService],
})
export class SitesModule {}
