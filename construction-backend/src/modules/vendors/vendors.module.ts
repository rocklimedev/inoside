// vendors.module.ts

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { VendorsService } from './vendors.service';
import { VendorsController } from './vendors.controller';

import { Vendor } from './models/vendor.model';
import { VendorType } from './models/vendor-type.model';
import { VendorTypeVendor } from './models/vendor-type-vendor.model';
import { ProjectVendor } from './models/project-vendor.model';

import { Project } from '../projects/models/project.model';
import { EngagementModule } from '../engagement/engagement.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Vendor,
      VendorType,
      VendorTypeVendor,
      ProjectVendor,
      Project,
    ]),
    EngagementModule,
  ],

  controllers: [VendorsController],

  providers: [VendorsService],

  exports: [VendorsService],
})
export class VendorsModule {}
