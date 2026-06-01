"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawingsModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const drawings_controller_1 = require("./controllers/drawings.controller");
const project_drawing_service_1 = require("./services/project-drawing.service");
const drawing_approval_log_service_1 = require("./services/drawing-approval-log.service");
const project_drawings_model_1 = require("./models/project-drawings.model");
const drawing_approval_logs_model_1 = require("./models/drawing_approval_logs.model");
const project_model_1 = require("./models/project.model");
const user_model_1 = require("../users/models/user.model");
const cdn_module_1 = require("../cdn/cdn.module");
let DrawingsModule = class DrawingsModule {
};
exports.DrawingsModule = DrawingsModule;
exports.DrawingsModule = DrawingsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([
                project_drawings_model_1.ProjectDrawing,
                drawing_approval_logs_model_1.DrawingApprovalLog,
                project_model_1.Project,
                user_model_1.User,
            ]),
            cdn_module_1.CdnModule,
        ],
        controllers: [drawings_controller_1.DrawingsController],
        providers: [project_drawing_service_1.ProjectDrawingService, drawing_approval_log_service_1.DrawingApprovalLogService],
        exports: [project_drawing_service_1.ProjectDrawingService],
    })
], DrawingsModule);
//# sourceMappingURL=drawing.module.js.map