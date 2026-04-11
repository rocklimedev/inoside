import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StageQualityCheck } from './entities/stage-quality-check.entity';
import { Project } from '@/projects/entities/project.entity';
import { User } from '@/users/entities/user.entity';

import { StageQualityChecksService } from './stage-quality-checks.service';
import { StageQualityChecksController } from './stage-quality-checks.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StageQualityCheck,
      Project, // ✅ ADD THIS
      User, // ✅ ADD THIS
    ]),
  ],
  controllers: [StageQualityChecksController],
  providers: [StageQualityChecksService],
})
export class StageQualityChecksModule {}
