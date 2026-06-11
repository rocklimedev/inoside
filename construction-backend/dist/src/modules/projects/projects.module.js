"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const cdn_module_1 = require("../cdn/cdn.module");
const projects_controller_1 = require("./projects.controller");
const briefs_controller_1 = require("./controllers/briefs.controller");
const scopes_controller_1 = require("./controllers/scopes.controller");
const pitches_controller_1 = require("./controllers/pitches.controller");
const pitch_comments_controller_1 = require("./controllers/pitch-comments.controller");
const reki_controller_1 = require("./controllers/reki.controller");
const pitch_references_controller_1 = require("./controllers/pitch-references.controller");
const reki_photos_controller_1 = require("./controllers/reki-photos.controller");
const cost_estimates_controller_1 = require("./controllers/cost-estimates.controller");
const drawings_controller_1 = require("./controllers/drawings.controller");
const drawing_logs_controller_1 = require("./controllers/drawing-logs.controller");
const projects_service_1 = require("./projects.service");
const project_brief_service_1 = require("./services/project-brief.service");
const pitch_reference_service_1 = require("./services/pitch-reference.service");
const reki_report_service_1 = require("./services/reki-report.service");
const reki_photo_service_1 = require("./services/reki-photo.service");
const scope_of_work_service_1 = require("./services/scope-of-work.service");
const project_cost_estimate_service_1 = require("./services/project-cost-estimate.service");
const project_drawing_service_1 = require("./services/project-drawing.service");
const drawing_approval_log_service_1 = require("./services/drawing-approval-log.service");
const project_pitch_service_1 = require("./services/project-pitch.service");
const project_model_1 = require("./models/project.model");
const client_model_1 = require("../clients/models/client.model");
const site_model_1 = require("../sites/models/site.model");
const user_model_1 = require("../users/models/user.model");
const address_model_1 = require("../address/models/address.model");
const project_brief_model_1 = require("./models/project_brief.model");
const project_pitch_model_1 = require("./models/project_pitch.model");
const pitch_references_model_1 = require("./models/pitch_references.model");
const reki_reports_model_1 = require("./models/reki_reports.model");
const reki_photos_model_1 = require("./models/reki_photos.model");
const scope_of_work_model_1 = require("./models/scope_of_work.model");
const project_cost_estimates_model_1 = require("./models/project_cost_estimates.model");
const project_drawings_model_1 = require("./models/project-drawings.model");
const drawing_approval_logs_model_1 = require("./models/drawing_approval_logs.model");
const pitch_comment_model_1 = require("./models/pitch-comment.model");
const daily_progress_report_model_1 = require("./models/daily-progress-report.model");
const daily_progress_reports_service_1 = require("./services/daily-progress-reports.service");
const daily_progress_reports_controller_1 = require("./controllers/daily-progress-reports.controller");
const execution_stage_model_1 = require("./models/execution-stage.model");
const execution_activity_model_1 = require("./models/execution-activity.model");
const execution_stage_controller_1 = require("./controllers/execution-stage.controller");
const execution_activity_controller_1 = require("./controllers/execution-activity.controller");
const execution_stage_service_1 = require("./services/execution-stage.service");
const execution_activity_service_1 = require("./services/execution-activity.service");
let ProjectsModule = class ProjectsModule {
};
exports.ProjectsModule = ProjectsModule;
exports.ProjectsModule = ProjectsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cdn_module_1.CdnModule,
            sequelize_1.SequelizeModule.forFeature([
                project_model_1.Project,
                client_model_1.Client,
                site_model_1.Site,
                user_model_1.User,
                address_model_1.Address,
                project_brief_model_1.ProjectBrief,
                project_pitch_model_1.ProjectPitch,
                pitch_references_model_1.PitchReference,
                reki_reports_model_1.RekiReport,
                daily_progress_report_model_1.DailyProgressReport,
                reki_photos_model_1.RekiPhoto,
                scope_of_work_model_1.ScopeOfWork,
                pitch_comment_model_1.PitchComment,
                project_cost_estimates_model_1.ProjectCostEstimate,
                project_drawings_model_1.ProjectDrawing,
                drawing_approval_logs_model_1.DrawingApprovalLog,
                execution_stage_model_1.ExecutionStage,
                execution_activity_model_1.ExecutionActivity,
            ]),
        ],
        controllers: [
            projects_controller_1.ProjectsController,
            briefs_controller_1.BriefsController,
            scopes_controller_1.ScopesController,
            pitches_controller_1.PitchesController,
            pitch_comments_controller_1.PitchCommentsController,
            pitch_references_controller_1.PitchReferencesController,
            reki_controller_1.RekiController,
            reki_photos_controller_1.RekiPhotosController,
            cost_estimates_controller_1.CostEstimatesController,
            drawings_controller_1.DrawingsController,
            drawing_logs_controller_1.DrawingLogsController,
            daily_progress_reports_controller_1.DailyProgressReportsController,
            execution_stage_controller_1.ExecutionStageController,
            execution_activity_controller_1.ExecutionActivityController,
        ],
        providers: [
            projects_service_1.ProjectsService,
            project_brief_service_1.ProjectBriefService,
            project_pitch_service_1.ProjectPitchService,
            pitch_reference_service_1.PitchReferenceService,
            reki_report_service_1.RekiReportService,
            reki_photo_service_1.RekiPhotoService,
            scope_of_work_service_1.ScopeOfWorkService,
            project_cost_estimate_service_1.ProjectCostEstimateService,
            project_drawing_service_1.ProjectDrawingService,
            drawing_approval_log_service_1.DrawingApprovalLogService,
            daily_progress_reports_service_1.DailyProgressReportsService,
            execution_stage_service_1.ExecutionStageService,
            execution_activity_service_1.ExecutionActivityService,
        ],
        exports: [
            projects_service_1.ProjectsService,
            project_brief_service_1.ProjectBriefService,
            project_pitch_service_1.ProjectPitchService,
            pitch_reference_service_1.PitchReferenceService,
            reki_report_service_1.RekiReportService,
            reki_photo_service_1.RekiPhotoService,
            scope_of_work_service_1.ScopeOfWorkService,
            project_cost_estimate_service_1.ProjectCostEstimateService,
            project_drawing_service_1.ProjectDrawingService,
            drawing_approval_log_service_1.DrawingApprovalLogService,
            daily_progress_reports_service_1.DailyProgressReportsService,
            execution_stage_service_1.ExecutionStageService,
            execution_activity_service_1.ExecutionActivityService,
        ],
    })
], ProjectsModule);
//# sourceMappingURL=projects.module.js.map