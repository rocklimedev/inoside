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
exports.ActivityLogService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const activity_log_model_1 = require("./models/activity-log.model");
let ActivityLogService = class ActivityLogService {
    activityLogModel;
    constructor(activityLogModel) {
        this.activityLogModel = activityLogModel;
    }
    async create(payload) {
        return this.activityLogModel.create({
            ...payload,
            isSystemGenerated: payload.isSystemGenerated ?? false,
        });
    }
    async bulkCreate(payloads) {
        return this.activityLogModel.bulkCreate(payloads.map((payload) => ({
            ...payload,
            isSystemGenerated: payload.isSystemGenerated ?? false,
        })));
    }
    async getLogs(page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        return this.activityLogModel.findAndCountAll({
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        });
    }
    async findById(activityLogId) {
        return this.activityLogModel.findByPk(activityLogId);
    }
    async findByUserId(userId, page = 1, limit = 20) {
        return this.activityLogModel.findAndCountAll({
            where: { userId },
            limit,
            offset: (page - 1) * limit,
            order: [['createdAt', 'DESC']],
        });
    }
    async findByReference(referenceId, referenceType) {
        const where = {
            referenceId,
        };
        if (referenceType) {
            where['referenceType'] = referenceType;
        }
        return this.activityLogModel.findAll({
            where,
            order: [['createdAt', 'DESC']],
        });
    }
    async findByModule(moduleName, page = 1, limit = 20) {
        return this.activityLogModel.findAndCountAll({
            where: { moduleName },
            limit,
            offset: (page - 1) * limit,
            order: [['createdAt', 'DESC']],
        });
    }
    async findByContextTag(contextTag, page = 1, limit = 20) {
        return this.activityLogModel.findAndCountAll({
            where: { contextTag },
            limit,
            offset: (page - 1) * limit,
            order: [['createdAt', 'DESC']],
        });
    }
    async findBySeverity(severity, page = 1, limit = 20) {
        return this.activityLogModel.findAndCountAll({
            where: { severity },
            limit,
            offset: (page - 1) * limit,
            order: [['createdAt', 'DESC']],
        });
    }
    async search(filters) {
        const { page = 1, limit = 20 } = filters;
        const where = {};
        if (filters.userId)
            where['userId'] = filters.userId;
        if (filters.moduleName)
            where['moduleName'] = filters.moduleName;
        if (filters.contextTag)
            where['contextTag'] = filters.contextTag;
        if (filters.action)
            where['action'] = filters.action;
        if (filters.severity)
            where['severity'] = filters.severity;
        if (filters.referenceId)
            where['referenceId'] = filters.referenceId;
        if (filters.startDate || filters.endDate) {
            where['createdAt'] = {};
            if (filters.startDate) {
                where['createdAt'][sequelize_2.Op.gte] = filters.startDate;
            }
            if (filters.endDate) {
                where['createdAt'][sequelize_2.Op.lte] = filters.endDate;
            }
        }
        return this.activityLogModel.findAndCountAll({
            where,
            limit,
            offset: (page - 1) * limit,
            order: [['createdAt', 'DESC']],
        });
    }
    async getRecent(limit = 50) {
        return this.activityLogModel.findAll({
            limit,
            order: [['createdAt', 'DESC']],
        });
    }
    async getStats() {
        const totalLogs = await this.activityLogModel.count();
        const [info, warning, error, critical] = await Promise.all([
            this.activityLogModel.count({
                where: { severity: 'INFO' },
            }),
            this.activityLogModel.count({
                where: { severity: 'WARNING' },
            }),
            this.activityLogModel.count({
                where: { severity: 'ERROR' },
            }),
            this.activityLogModel.count({
                where: { severity: 'CRITICAL' },
            }),
        ]);
        return {
            totalLogs,
            info,
            warning,
            error,
            critical,
        };
    }
    async delete(activityLogId) {
        return this.activityLogModel.destroy({
            where: {
                activityLogId,
            },
        });
    }
    async deleteOlderThan(days) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        return this.activityLogModel.destroy({
            where: {
                createdAt: {
                    [sequelize_2.Op.lt]: cutoffDate,
                },
            },
        });
    }
};
exports.ActivityLogService = ActivityLogService;
exports.ActivityLogService = ActivityLogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(activity_log_model_1.ActivityLog)),
    __metadata("design:paramtypes", [Object])
], ActivityLogService);
//# sourceMappingURL=activity-log.service.js.map