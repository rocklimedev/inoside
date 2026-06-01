"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CostEstimatesModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const cost_estimates_controller_1 = require("./controllers/cost-estimates.controller");
const project_cost_estimate_service_1 = require("./services/project-cost-estimate.service");
const project_cost_estimates_model_1 = require("./models/project_cost_estimates.model");
const project_model_1 = require("./models/project.model");
let CostEstimatesModule = class CostEstimatesModule {
};
exports.CostEstimatesModule = CostEstimatesModule;
exports.CostEstimatesModule = CostEstimatesModule = __decorate([
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([project_cost_estimates_model_1.ProjectCostEstimate, project_model_1.Project])],
        controllers: [cost_estimates_controller_1.CostEstimatesController],
        providers: [project_cost_estimate_service_1.ProjectCostEstimateService],
        exports: [project_cost_estimate_service_1.ProjectCostEstimateService],
    })
], CostEstimatesModule);
//# sourceMappingURL=cost-estimate.module.js.map