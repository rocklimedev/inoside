import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SitesService } from './sites.service';
import { SitesController } from './sites.controller';
import { Site } from './models/site.model';

@Module({
  imports: [SequelizeModule.forFeature([Site])],
  controllers: [SitesController],
  providers: [SitesService],
  exports: [SitesService],
})
export class SitesModule {}
