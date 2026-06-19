import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CdnController } from './cdn.controller';
import { CdnService } from './services/cdn.service';

import { CdnFile } from './models/cdn-file.model';
import { EngagementModule } from '../engagement/engagement.module';

@Module({
  imports: [SequelizeModule.forFeature([CdnFile]), EngagementModule],

  controllers: [CdnController],

  providers: [CdnService],

  exports: [CdnService],
})
export class CdnModule {}
