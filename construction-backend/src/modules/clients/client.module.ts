import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { Client } from './models/client.model';
import { EngagementModule } from '../engagement/engagement.module';

@Module({
  imports: [SequelizeModule.forFeature([Client]), EngagementModule],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
