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
exports.ProjectPitchService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const project_pitch_model_1 = require("../models/project_pitch.model");
const project_model_1 = require("../models/project.model");
const client_model_1 = require("../../clients/models/client.model");
const site_model_1 = require("../../sites/models/site.model");
const user_model_1 = require("../../users/models/user.model");
const pitch_comment_model_1 = require("../models/pitch-comment.model");
const address_model_1 = require("../../address/models/address.model");
let ProjectPitchService = class ProjectPitchService {
    pitchModel;
    projectModel;
    userModel;
    commentModel;
    constructor(pitchModel, projectModel, userModel, commentModel) {
        this.pitchModel = pitchModel;
        this.projectModel = projectModel;
        this.userModel = userModel;
        this.commentModel = commentModel;
    }
    async createPitch(projectId, dto) {
        const project = await this.projectModel.findByPk(projectId);
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        const existing = await this.pitchModel.findOne({
            where: {
                project_id: projectId,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('Pitch already exists for this project');
        }
        return this.pitchModel.create({
            ...dto,
            project_id: projectId,
        });
    }
    async getPitch(projectId) {
        const pitch = await this.pitchModel.findOne({
            where: {
                project_id: projectId,
            },
            include: this.getIncludes(),
        });
        if (!pitch) {
            throw new common_1.NotFoundException('Pitch not found');
        }
        return pitch;
    }
    async updatePitch(projectId, dto) {
        const pitch = await this.pitchModel.findOne({
            where: {
                project_id: projectId,
            },
        });
        if (!pitch) {
            throw new common_1.NotFoundException('Pitch not found');
        }
        await pitch.update(dto);
        return this.getPitch(projectId);
    }
    async deletePitch(id) {
        const pitch = await this.pitchModel.findByPk(id);
        if (!pitch) {
            throw new common_1.NotFoundException('Pitch not found');
        }
        await pitch.destroy();
        return {
            success: true,
            message: 'Pitch deleted successfully',
        };
    }
    async getAllPitches() {
        return this.pitchModel.findAll({
            include: this.getIncludes(),
            order: [['created_at', 'DESC']],
        });
    }
    async getPitchById(id) {
        const pitch = await this.pitchModel.findByPk(id, {
            include: this.getIncludes(),
        });
        if (!pitch) {
            throw new common_1.NotFoundException('Pitch not found');
        }
        return pitch;
    }
    async addComment(pitchId, dto) {
        const pitch = await this.pitchModel.findByPk(pitchId);
        if (!pitch) {
            throw new common_1.NotFoundException('Pitch not found');
        }
        if (dto.user_id) {
            const user = await this.userModel.findByPk(dto.user_id);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
        }
        return this.commentModel.create({
            pitch_id: pitchId,
            content: dto.content,
            user_id: dto.user_id || null,
        });
    }
    async replacePitchFile(pitchId, dto) {
        const pitch = await this.pitchModel.findByPk(pitchId);
        if (!pitch) {
            throw new common_1.NotFoundException('Pitch not found');
        }
        await pitch.update(dto);
        return this.getPitchById(pitchId);
    }
    async approvePitch(id) {
        const pitch = await this.pitchModel.findByPk(id);
        if (!pitch) {
            throw new common_1.NotFoundException('Pitch not found');
        }
        await pitch.update({
            status: 'Approved',
        });
        return this.getPitchById(id);
    }
    async rejectPitch(id) {
        const pitch = await this.pitchModel.findByPk(id);
        if (!pitch) {
            throw new common_1.NotFoundException('Pitch not found');
        }
        await pitch.update({
            status: 'Rejected',
        });
        return this.getPitchById(id);
    }
    async getComments(pitchId) {
        const pitch = await this.pitchModel.findByPk(pitchId);
        if (!pitch) {
            throw new common_1.NotFoundException('Pitch not found');
        }
        return this.commentModel.findAll({
            where: { pitch_id: pitchId },
            include: [
                {
                    model: user_model_1.User,
                    attributes: ['id', 'name', 'email'],
                },
            ],
            order: [['created_at', 'DESC']],
        });
    }
    async updateComment(commentId, dto) {
        const comment = await this.commentModel.findByPk(commentId);
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        await comment.update(dto);
        return this.commentModel.findByPk(commentId, {
            include: [
                {
                    model: user_model_1.User,
                    attributes: ['id', 'name', 'email'],
                },
            ],
        });
    }
    async deleteComment(commentId) {
        const comment = await this.commentModel.findByPk(commentId);
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        await comment.destroy();
        return {
            success: true,
            message: 'Comment deleted successfully',
        };
    }
    async deleteByProject(projectId) {
        const pitch = await this.pitchModel.findOne({
            where: { project_id: projectId },
        });
        if (!pitch) {
            throw new common_1.NotFoundException('Pitch not found');
        }
        await pitch.destroy();
        return {
            success: true,
            message: 'Pitch deleted successfully',
        };
    }
    getIncludes() {
        return [
            {
                model: project_model_1.Project,
                attributes: ['id', 'name', 'status'],
                include: [
                    {
                        model: client_model_1.Client,
                        attributes: ['id', 'name', 'email', 'contact_number'],
                    },
                    {
                        model: site_model_1.Site,
                        attributes: ['id', 'ownership_status', 'access_available'],
                        include: [
                            {
                                model: address_model_1.Address,
                                attributes: [
                                    'id',
                                    'line1',
                                    'line2',
                                    'landmark',
                                    'city',
                                    'state',
                                    'country',
                                    'pincode',
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                model: user_model_1.User,
                as: 'createdByUser',
                attributes: ['id', 'name', 'email'],
            },
            {
                model: pitch_comment_model_1.PitchComment,
                include: [
                    {
                        model: user_model_1.User,
                        attributes: ['id', 'name', 'email'],
                    },
                ],
            },
        ];
    }
};
exports.ProjectPitchService = ProjectPitchService;
exports.ProjectPitchService = ProjectPitchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(project_pitch_model_1.ProjectPitch)),
    __param(1, (0, sequelize_1.InjectModel)(project_model_1.Project)),
    __param(2, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __param(3, (0, sequelize_1.InjectModel)(pitch_comment_model_1.PitchComment)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], ProjectPitchService);
//# sourceMappingURL=project-pitch.service.js.map