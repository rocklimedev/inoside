import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ProjectsController } from './projects.controller';

// ================= SERVICES =================
import { ProjectsService } from './projects.service';
import { ProjectBriefService } from './services/project-brief.service';
import { PitchReferenceService } from './services/pitch-reference.service';
import { RekiReportService } from './services/reki-report.service';
import { RekiPhotoService } from './services/reki-photo.service';
import { ScopeOfWorkService } from './services/scope-of-work.service';
import { ProjectCostEstimateService } from './services/project-cost-estimate.service';
import { ProjectDrawingService } from './services/project-drawing.service';
import { DrawingApprovalLogService } from './services/drawing-approval-log.service';
import { ProjectPitchService } from './services/project-pitch.service';

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
import { PitchComment } from './models/pitch-comment.model';
import { Address } from '../address/models/address.model';
import { BriefsController } from './controllers/briefs.controller';
import { ScopesController } from './controllers/scopes.controller';
import { PitchesController } from './controllers/pitches.controller';
import { PitchCommentsController } from './controllers/pitch-comments.controller';
import { RekiController } from './controllers/reki.controller';
import { PitchReferencesController } from './controllers/pitch-references.controller';
import { RekiPhotosController } from './controllers/reki-photos.controller';
import { CostEstimatesController } from './controllers/cost-estimates.controller';
import { DrawingLogsController } from './controllers/drawing-logs.controller';
import { DrawingsController } from './controllers/drawings.controller';
@Module({
  imports: [
    SequelizeModule.forFeature([
      // CORE
      Project,
      Client,
      Site,
      User,
      Address,
      // FEATURES
      ProjectBrief,
      ProjectPitch,
      PitchReference,
      RekiReport,
      RekiPhoto,
      ScopeOfWork,
      PitchComment, // ✅ ADD THIS
      ProjectCostEstimate,
      ProjectDrawing,
      DrawingApprovalLog,
    ]),
  ],
  controllers: [
    ProjectsController,
    BriefsController,
    ScopesController,
    PitchesController,
    PitchCommentsController,
    PitchReferencesController,
    RekiController,
    RekiPhotosController,
    CostEstimatesController,
    DrawingsController,
    DrawingLogsController,
  ],
  providers: [
    ProjectsService,
    ProjectBriefService,
    ProjectPitchService,
    PitchReferenceService,
    RekiReportService,
    RekiPhotoService,
    ScopeOfWorkService,
    ProjectCostEstimateService,
    ProjectDrawingService,
    DrawingApprovalLogService,
  ],
  exports: [
    ProjectsService,
    ProjectBriefService,
    PitchReferenceService,
    RekiReportService,
    RekiPhotoService,
    ScopeOfWorkService,
    ProjectPitchService,
    ProjectCostEstimateService,
    ProjectDrawingService,
    DrawingApprovalLogService,
  ],
})
export class ProjectsModule {}
