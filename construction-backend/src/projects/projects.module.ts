import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { ProjectProposalsService } from './project-proposals.service';
import { SiteRekiReportService } from './site-reki-report.service';
import { ProjectScopesService } from './project-scopes.service';

// Entities
import { Project } from './entities/project.entity';
import { ProjectProposal } from './entities/project-proposal.entity';
import { SiteRekiReport } from './entities/site-reki-report.entity';
import { ProjectScope } from './entities/project-scopes.entity';
import { ScopeItem } from './entities/scope-item.entity';
import { Address } from '@/users/entities/address.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      ProjectProposal,
      SiteRekiReport,
      ProjectScope,
      ScopeItem,
      Address,
    ]),
  ],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    ProjectProposalsService,
    SiteRekiReportService,
    ProjectScopesService,
  ],
  exports: [
    TypeOrmModule, // ✅ THIS LINE FIXES YOUR ERROR
    ProjectsService,
    ProjectProposalsService,
    SiteRekiReportService,
    ProjectScopesService,
  ],
})
export class ProjectsModule {}
