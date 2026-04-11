import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectIssue } from './entities/project-issue.entity';
import { Project } from '@/projects/entities/project.entity';
import { Attachment } from '@/attachments/entities/attachments.entity';

import { ProjectIssuesService } from './project-issues.service';
import { ProjectIssuesController } from './project-issues.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectIssue,
      Project, // ✅ ADD THIS
      Attachment, // ✅ already using it
    ]),
  ],
  controllers: [ProjectIssuesController],
  providers: [ProjectIssuesService],
})
export class ProjectIssuesModule {}
