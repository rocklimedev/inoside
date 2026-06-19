"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const bcrypt = __importStar(require("bcryptjs"));
const user_model_1 = require("./models/user.model");
const role_model_1 = require("../rbac/models/role.model");
const user_messages_1 = require("../../common/messages/user.messages");
const cdn_service_1 = require("../cdn/services/cdn.service");
const user_engagement_service_1 = require("../engagement/services/user-engagement.service");
let UsersService = class UsersService {
    userModel;
    roleModel;
    cdnService;
    userEngagementService;
    constructor(userModel, roleModel, cdnService, userEngagementService) {
        this.userModel = userModel;
        this.roleModel = roleModel;
        this.cdnService = cdnService;
        this.userEngagementService = userEngagementService;
    }
    async create(createUserDto, actor) {
        const { email, password, ...rest } = createUserDto;
        const existingUser = await this.userModel.findOne({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException(user_messages_1.USER_MESSAGES.EMAIL_EXISTS);
        }
        const defaultRole = await this.roleModel.findOne({
            where: {
                name: 'employee',
            },
        });
        if (!defaultRole) {
            throw new common_1.BadRequestException('Default role not configured in system');
        }
        const password_hash = await bcrypt.hash(password, 10);
        const user = await this.userModel.create({
            ...rest,
            email,
            role_id: defaultRole.id,
            password_hash,
            is_active: false,
            is_email_verified: false,
        });
        await this.userEngagementService.userCreated(actor, {
            id: user.id,
            name: user.name,
            email: user.email,
        });
        const { password_hash: _, ...result } = user.toJSON();
        return {
            message: user_messages_1.USER_MESSAGES.CREATED,
            data: result,
        };
    }
    async findAll() {
        return this.userModel.findAll({
            attributes: {
                exclude: ['password_hash'],
            },
            include: [
                {
                    model: role_model_1.Role,
                    attributes: ['id', 'name', 'display_name'],
                },
            ],
            order: [['created_at', 'DESC']],
        });
    }
    async findOne(id) {
        const user = await this.userModel.findByPk(id, {
            attributes: {
                exclude: ['password_hash'],
            },
            include: [
                {
                    model: role_model_1.Role,
                    attributes: ['id', 'name', 'display_name', 'description'],
                },
            ],
        });
        if (!user) {
            throw new common_1.NotFoundException(user_messages_1.USER_MESSAGES.NOT_FOUND(id));
        }
        return user;
    }
    async update(id, updateUserDto, actor, file) {
        const user = await this.findOne(id);
        const oldValues = user.toJSON();
        const updatePayload = {
            ...updateUserDto,
        };
        if (file) {
            const uploaded = await this.cdnService.uploadFile(file);
            updatePayload.avatar_url = uploaded.url;
            updatePayload.avatar_thumbnail = uploaded.url;
        }
        Object.keys(updatePayload).forEach((key) => {
            if (updatePayload[key] === undefined) {
                delete updatePayload[key];
            }
        });
        await user.update(updatePayload);
        const updatedUser = await this.findOne(id);
        await this.userEngagementService.userUpdated(actor, {
            id: user.id,
            name: user.name,
        }, oldValues, updatedUser.toJSON());
        return {
            message: user_messages_1.USER_MESSAGES.UPDATED,
            data: updatedUser,
        };
    }
    async remove(id, actor) {
        const user = await this.findOne(id);
        await this.userEngagementService.userDeleted(actor, {
            id: user.id,
            name: user.name,
        });
        await user.destroy();
        return {
            message: user_messages_1.USER_MESSAGES.DELETED,
        };
    }
    async toggleActive(id, actor) {
        const user = await this.findOne(id);
        const newStatus = !user.is_active;
        await user.update({
            is_active: newStatus,
        });
        await this.userEngagementService.userStatusChanged(actor, {
            id: user.id,
            name: user.name,
            isActive: newStatus,
        });
        return {
            message: user_messages_1.USER_MESSAGES.TOGGLED,
            data: await this.findOne(id),
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __param(1, (0, sequelize_1.InjectModel)(role_model_1.Role)),
    __metadata("design:paramtypes", [Object, Object, cdn_service_1.CdnService,
        user_engagement_service_1.UserEngagementService])
], UsersService);
//# sourceMappingURL=users.service.js.map