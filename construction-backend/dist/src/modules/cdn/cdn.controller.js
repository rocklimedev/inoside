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
exports.CdnController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const cdn_guard_1 = require("../../common/guards/cdn.guard");
const cdn_service_1 = require("./services/cdn.service");
let CdnController = class CdnController {
    cdnService;
    constructor(cdnService) {
        this.cdnService = cdnService;
    }
    async upload(file) {
        return this.cdnService.uploadFile(file);
    }
};
exports.CdnController = CdnController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseGuards)(cdn_guard_1.CdnGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
        limits: {
            fileSize: 500 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CdnController.prototype, "upload", null);
exports.CdnController = CdnController = __decorate([
    (0, common_1.Controller)('cdn'),
    __metadata("design:paramtypes", [cdn_service_1.CdnService])
], CdnController);
//# sourceMappingURL=cdn.controller.js.map