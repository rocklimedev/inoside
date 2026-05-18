"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PitchReferenceService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const pitch_references_model_1 = require("../models/pitch_references.model");
const project_model_1 = require("../models/project.model");
let PitchReferenceService = class PitchReferenceService {
    pitchRefModel;
    projectModel;
    constructor(pitchRefModel, projectModel) {
        this.pitchRefModel = pitchRefModel;
        this.projectModel = projectModel;
    }
    async add(dto) {
        await this.projectModel.findByPk(dto.project_id, { rejectOnEmpty: true });
        return this.pitchRefModel.create(dto);
    }
    async findByProject(project_id) {
        return this.pitchRefModel.findAll({ where: { project_id } });
    }
    async delete(id) {
        return this.pitchRefModel.destroy({ where: { id } });
    }
};
exports.PitchReferenceService = PitchReferenceService;
exports.PitchReferenceService = PitchReferenceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(pitch_references_model_1.PitchReference)),
    __param(1, (0, sequelize_1.InjectModel)(project_model_1.Project)),
    __metadata("design:paramtypes", [Object, Object])
], PitchReferenceService);
//# sourceMappingURL=pitch-reference.service.js.map