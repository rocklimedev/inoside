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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const bcrypt = __importStar(require("bcryptjs"));
const jwt_1 = require("@nestjs/jwt");
const user_model_1 = require("../users/models/user.model");
const role_model_1 = require("../rbac/models/role.model");
const permission_model_1 = require("../rbac/models/permission.model");
let AuthService = class AuthService {
    userModel;
    roleModel;
    jwtService;
    constructor(userModel, roleModel, jwtService) {
        this.userModel = userModel;
        this.roleModel = roleModel;
        this.jwtService = jwtService;
    }
    async register(createUserDto) {
        const { email, password, role_id, avatar_url, avatar_thumbnail, ...rest } = createUserDto;
        const existingUser = await this.userModel.findOne({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const role = await this.roleModel.findByPk(role_id);
        if (!role) {
            throw new common_1.BadRequestException('Invalid role_id provided');
        }
        const password_hash = await bcrypt.hash(password, 10);
        const user = await this.userModel.create({
            name: rest.name,
            email,
            role_id,
            password_hash,
            avatar_url: avatar_url ?? null,
            avatar_thumbnail: avatar_thumbnail ?? null,
            is_active: rest.is_active ?? true,
            is_email_verified: false,
        });
        const createdUser = await this.userModel.findByPk(user.id, {
            include: [
                {
                    model: role_model_1.Role,
                    attributes: ['id', 'name', 'display_name'],
                },
            ],
        });
        if (!createdUser) {
            throw new common_1.BadRequestException('Failed to create user');
        }
        return this.formatUserResponse(createdUser);
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userModel.findOne({
            where: { email },
            include: [
                {
                    model: role_model_1.Role,
                    attributes: ['id', 'name', 'display_name'],
                },
            ],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.is_active) {
            throw new common_1.UnauthorizedException('Account is inactive. Contact administrator.');
        }
        await user.update({
            last_login: new Date(),
        });
        const permissions = await permission_model_1.Permission.findAll({
            include: [
                {
                    model: role_model_1.Role,
                    where: { id: user.role_id },
                    through: { attributes: [] },
                },
            ],
        });
        const payload = {
            sub: user.id,
            email: user.email,
            name: user.name,
            avatar_url: user.avatar_url,
            avatar_thumbnail: user.avatar_thumbnail,
            role: user.role?.name ?? null,
            permissions: permissions.map((p) => p.name),
        };
        const access_token = this.jwtService.sign(payload);
        return {
            access_token,
            user: this.formatUserResponse(user),
        };
    }
    async validateUser(userId) {
        const user = await this.userModel.findByPk(userId, {
            include: [
                {
                    model: role_model_1.Role,
                    attributes: ['id', 'name', 'display_name'],
                },
            ],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        if (!user.is_active) {
            throw new common_1.UnauthorizedException('Account is inactive');
        }
        if (!user.role_id || !user.role) {
            throw new common_1.UnauthorizedException('No role assigned to this account');
        }
        return this.formatUserResponse(user);
    }
    formatUserResponse(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role ?? null,
            is_active: user.is_active,
            is_email_verified: user.is_email_verified,
            avatar_url: user.avatar_url,
            avatar_thumbnail: user.avatar_thumbnail,
            last_login: user.last_login,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __param(1, (0, sequelize_1.InjectModel)(role_model_1.Role)),
    __metadata("design:paramtypes", [Object, Object, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map