import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';

// ================= CORE MODELS =================
import { Project } from './models/project.model';
import { Client } from '../clients/models/client.model';
import { Site } from '../sites/models/site.model';
import { User } from '../users/models/user.model';

// ================= PROJECT FEATURE MODELS =================
import { ProjectBrief } from './models/project_brief.model';
import { ProjectPitch } from './models/project_pitch.model';
import { PitchReference } from './models/pitch_references.model';
import { RekiReport } from './models/reki_reports.model';
import { RekiPhoto } from './models/reki_photos.model';
import { ScopeOfWork } from './models/scope_of_work.model';
import { ProjectCostEstimate } from './models/project_cost_estimates.model';
import { ProjectDrawing } from './models/project-drawings.model';
import { DrawingApprovalLog } from './models/drawing_approval_logs.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      // CORE
      Project,
      Client,
      Site,
      User,

      // FEATURES
      ProjectBrief,
      ProjectPitch,
      PitchReference,
      RekiReport,
      RekiPhoto,
      ScopeOfWork,
      ProjectCostEstimate,
      ProjectDrawing,
      DrawingApprovalLog,
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
