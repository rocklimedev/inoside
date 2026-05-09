import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { VendorsService } from './vendors.service';
import { VendorsController } from './vendors.controller';
import { Vendor } from './models/vendor.model';
import { ProjectVendor } from './models/project-vendor.model';
import { Project } from '../projects/models/project.model';

@Module({
  imports: [SequelizeModule.forFeature([Vendor, ProjectVendor, Project])],
  controllers: [VendorsController],
  providers: [VendorsService],
  exports: [VendorsService],
})
export class VendorsModule {}
