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
const projects_controller_1 = require("./projects.controller");
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
let ProjectsModule = class ProjectsModule {
};
exports.ProjectsModule = ProjectsModule;
exports.ProjectsModule = ProjectsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([
                project_model_1.Project,
                client_model_1.Client,
                site_model_1.Site,
                user_model_1.User,
                project_brief_model_1.ProjectBrief,
                project_pitch_model_1.ProjectPitch,
                pitch_references_model_1.PitchReference,
                reki_reports_model_1.RekiReport,
                reki_photos_model_1.RekiPhoto,
                scope_of_work_model_1.ScopeOfWork,
                pitch_comment_model_1.PitchComment,
                project_cost_estimates_model_1.ProjectCostEstimate,
                project_drawings_model_1.ProjectDrawing,
                drawing_approval_logs_model_1.DrawingApprovalLog,
            ]),
        ],
        controllers: [projects_controller_1.ProjectsController],
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
        ],
        exports: [
            projects_service_1.ProjectsService,
            project_brief_service_1.ProjectBriefService,
            pitch_reference_service_1.PitchReferenceService,
            reki_report_service_1.RekiReportService,
            reki_photo_service_1.RekiPhotoService,
            scope_of_work_service_1.ScopeOfWorkService,
            project_pitch_service_1.ProjectPitchService,
            project_cost_estimate_service_1.ProjectCostEstimateService,
            project_drawing_service_1.ProjectDrawingService,
            drawing_approval_log_service_1.DrawingApprovalLogService,
        ],
    })
], ProjectsModule);
//# sourceMappingURL=projects.module.js.map