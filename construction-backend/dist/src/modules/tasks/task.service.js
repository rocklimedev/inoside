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
exports.TaskService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const task_model_1 = require("./models/task.model");
const project_model_1 = require("../projects/models/project.model");
const user_model_1 = require("../users/models/user.model");
let TaskService = class TaskService {
    taskModel;
    projectModel;
    userModel;
    constructor(taskModel, projectModel, userModel) {
        this.taskModel = taskModel;
        this.projectModel = projectModel;
        this.userModel = userModel;
    }
    async findAll() {
        return this.taskModel.findAll({
            include: [
                project_model_1.Project,
                {
                    model: user_model_1.User,
                    as: 'assignedUser',
                    attributes: ['id', 'name', 'email', 'avatar_url', 'avatar_thumbnail'],
                },
                {
                    model: user_model_1.User,
                    as: 'createdBy',
                    attributes: ['id', 'name', 'email', 'avatar_url', 'avatar_thumbnail'],
                },
            ],
            order: [['created_at', 'DESC']],
        });
    }
    async findByProject(projectId) {
        return this.taskModel.findAll({
            where: {
                project_id: projectId,
            },
            include: [
                project_model_1.Project,
                {
                    model: user_model_1.User,
                    as: 'assignedUser',
                    attributes: ['id', 'name', 'email', 'avatar_url', 'avatar_thumbnail'],
                },
                {
                    model: user_model_1.User,
                    as: 'createdBy',
                    attributes: ['id', 'name', 'email', 'avatar_url', 'avatar_thumbnail'],
                },
            ],
            order: [['created_at', 'DESC']],
        });
    }
    async findOne(id, projectId) {
        const whereClause = {
            id,
        };
        if (projectId) {
            whereClause.project_id = projectId;
        }
        const task = await this.taskModel.findOne({
            where: whereClause,
            include: [
                project_model_1.Project,
                {
                    model: user_model_1.User,
                    as: 'assignedUser',
                    attributes: ['id', 'name', 'email', 'avatar_url', 'avatar_thumbnail'],
                },
                {
                    model: user_model_1.User,
                    as: 'createdBy',
                    attributes: ['id', 'name', 'email', 'avatar_url', 'avatar_thumbnail'],
                },
            ],
        });
        if (!task) {
            throw new common_1.NotFoundException(projectId ? 'Task not found for this project' : 'Task not found');
        }
        return task;
    }
    async create(dto, createdByUserId) {
        const project = await this.projectModel.findByPk(dto.project_id);
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        const createdBy = await this.userModel.findByPk(createdByUserId);
        if (!createdBy) {
            throw new common_1.NotFoundException('Creator user not found');
        }
        if (dto.assigned_to_user_id) {
            const assignedUser = await this.userModel.findByPk(dto.assigned_to_user_id);
            if (!assignedUser) {
                throw new common_1.NotFoundException('Assigned user not found');
            }
        }
        const task = await this.taskModel.create({
            ...dto,
            created_by_user_id: createdByUserId,
        });
        return this.findOne(task.id);
    }
    async update(id, dto, projectId) {
        const task = await this.findOne(id, projectId);
        if (dto.assigned_to_user_id) {
            const assignedUser = await this.userModel.findByPk(dto.assigned_to_user_id);
            if (!assignedUser) {
                throw new common_1.NotFoundException('Assigned user not found');
            }
        }
        await task.update(dto);
        return this.findOne(id, projectId);
    }
    async remove(id, projectId) {
        const task = await this.findOne(id, projectId);
        await task.destroy();
        return {
            message: 'Task deleted successfully',
        };
    }
};
exports.TaskService = TaskService;
exports.TaskService = TaskService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(task_model_1.Task)),
    __param(1, (0, sequelize_1.InjectModel)(project_model_1.Project)),
    __param(2, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __metadata("design:paramtypes", [Object, Object, Object])
], TaskService);
//# sourceMappingURL=task.service.js.map