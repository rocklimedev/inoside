"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdnModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const cdn_controller_1 = require("./cdn.controller");
const cdn_service_1 = require("./services/cdn.service");
const cdn_file_model_1 = require("./models/cdn-file.model");
let CdnModule = class CdnModule {
};
exports.CdnModule = CdnModule;
exports.CdnModule = CdnModule = __decorate([
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([cdn_file_model_1.CdnFile])],
        controllers: [cdn_controller_1.CdnController],
        providers: [cdn_service_1.CdnService],
        exports: [cdn_service_1.CdnService],
    })
], CdnModule);
//# sourceMappingURL=cdn.module.js.map