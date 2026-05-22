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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const notification_schema_1 = require("../schemas/notification.schema");
let NotificationsService = class NotificationsService {
    notificationModel;
    constructor(notificationModel) {
        this.notificationModel = notificationModel;
    }
    async create(dto) {
        const notification = {
            title: dto.title,
            message: dto.message,
            type: dto.type,
            category: dto.category,
            userId: dto.userId,
            unread: true,
        };
        return this.notificationModel.create(notification);
    }
    async findAll(userId) {
        return this.notificationModel
            .find({ userId })
            .sort({ createdAt: -1 })
            .lean();
    }
    async findUnreadCount(userId) {
        return this.notificationModel.countDocuments({
            userId,
            unread: true,
        });
    }
    async markAsRead(id) {
        const updated = await this.notificationModel.findByIdAndUpdate(id, { unread: false }, { new: true });
        if (!updated)
            throw new common_1.NotFoundException('Notification not found');
        return updated;
    }
    async markAllAsRead(userId) {
        return this.notificationModel.updateMany({ userId, unread: true }, { unread: false });
    }
    async delete(id) {
        return this.notificationModel.findByIdAndDelete(id);
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map