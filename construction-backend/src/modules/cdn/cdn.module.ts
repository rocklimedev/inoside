import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CdnController } from './cdn.controller';
import { CdnService } from './services/cdn.service';

import { CdnFile } from './models/cdn-file.model';

@Module({
  imports: [SequelizeModule.forFeature([CdnFile])],

  controllers: [CdnController],

  providers: [CdnService],

  exports: [CdnService],
})
export class CdnModule {}
