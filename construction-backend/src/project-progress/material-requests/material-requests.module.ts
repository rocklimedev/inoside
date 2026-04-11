// src/material-requests/material-requests.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialRequest } from './entities/material-reuest.entity';
import { MaterialRequestsService } from './material-requests.service';
import { MaterialRequestsController } from './material-requests.controller';
import { ProjectsModule } from '@/projects/projects.module';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MaterialRequest]),

    // ✅ THIS fixes your error
    ProjectsModule,

    // ✅ REQUIRED for UserRepository
    UsersModule, // OR TypeOrmModule.forFeature([User])
  ],
  controllers: [MaterialRequestsController],
  providers: [MaterialRequestsService],
})
export class MaterialRequestsModule {}
