import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorsService } from './vendors.service';
import { VendorsController } from './vendors.controller';
import { ProjectsModule } from '../projects/projects.module';

// Entities
import { Vendor } from './entities/vendor.entity';
import { VendorQuotation } from './entities/vendor-quotation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vendor, VendorQuotation]),
    ProjectsModule, // For future project validation if needed
  ],
  controllers: [VendorsController],
  providers: [VendorsService],
  exports: [VendorsService],
})
export class VendorsModule {}
