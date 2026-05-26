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
exports.BoqController = void 0;
const common_1 = require("@nestjs/common");
const boq_service_1 = require("./boq.service");
const create_boq_dto_1 = require("./dto/create-boq.dto");
const create_boq_section_dto_1 = require("./dto/create-boq-section.dto");
const create_boq_item_dto_1 = require("./dto/create-boq-item.dto");
const create_boq_subheading_dto_1 = require("./dto/create-boq-subheading.dto");
const create_boq_category_dto_1 = require("./dto/create-boq-category.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
let BoqController = class BoqController {
    boqService;
    constructor(boqService) {
        this.boqService = boqService;
    }
    findCategories() {
        return this.boqService.findAllCategories();
    }
    createCategory(dto) {
        return this.boqService.createCategory(dto);
    }
    createBoq(dto) {
        return this.boqService.createBoq(dto);
    }
    updateBoq(id, dto) {
        return this.boqService.updateBoq(id, dto);
    }
    findAllBoqs(projectId, clientId) {
        return this.boqService.findAllBoqs(projectId, clientId);
    }
    getBoqsByClient(clientId) {
        return this.boqService.getBoqsByClient(clientId);
    }
    createSection(dto) {
        return this.boqService.createSection(dto);
    }
    updateSection(id, dto) {
        return this.boqService.updateSection(id, dto);
    }
    deleteSection(id) {
        return this.boqService.deleteSection(id);
    }
    findSections(boqId) {
        return this.boqService.findSectionsByBoq(boqId);
    }
    createSubHeading(dto) {
        return this.boqService.createSubHeading(dto);
    }
    updateSubHeading(id, dto) {
        return this.boqService.updateSubHeading(id, dto);
    }
    deleteSubHeading(id) {
        return this.boqService.deleteSubHeading(id);
    }
    findSubHeadings(sectionId) {
        return this.boqService.findSubHeadingsBySection(sectionId);
    }
    createItem(dto) {
        return this.boqService.createItem(dto);
    }
    updateItem(id, dto) {
        console.log('PATCH ITEM HIT:', id);
        return this.boqService.updateItem(id, dto);
    }
    deleteItem(id) {
        return this.boqService.deleteItem(id);
    }
    calculateTotal(id) {
        return this.boqService.calculateBoqTotal(id);
    }
    findBoq(id) {
        return this.boqService.getBoqWithDetails(id);
    }
};
exports.BoqController = BoqController;
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BoqController.prototype, "findCategories", null);
__decorate([
    (0, common_1.Post)('categories'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_boq_category_dto_1.CreateBoqCategoryDto]),
    __metadata("design:returntype", void 0)
], BoqController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_boq_dto_1.CreateBoqDto]),
    __metadata("design:returntype", void 0)
], BoqController.prototype, "createBoq", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BoqController.prototype, "updateBoq", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('projectId')),
    __param(1, (0, common_1.Query)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BoqController.prototype, "findAllBoqs", null);
__decorate([
    (0, common_1.Get)('client/:clientId'),
    __param(0, (0, common_1.Param)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BoqController.prototype, "getBoqsByClient", null);
__decorate([
    (0, common_1.Post)('sections'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_boq_section_dto_1.CreateBoqSectionDto]),
    __metadata("design:returntype", void 0)
], BoqController.prototype, "createSection", null);
__decorate([
    (0, common_1.Patch)('sections/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BoqController.prototype, "updateSection", null);
__decorate([
    (0, common_1.Delete)('sections/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BoqController.prototype, "deleteSection", null);
__decorate([
    (0, common_1.Get)(':boqId/sections'),
    __param(0, (0, common_1.Param)('boqId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BoqController.prototype, "findSections", null);
__decorate([
    (0, common_1.Post)('subheadings'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_boq_subheading_dto_1.CreateBoqSubHeadingDto]),
    __metadata("design:returntype", void 0)
], BoqController.prototype, "createSubHeading", null);
__decorate([
    (0, common_1.Patch)('subheadings/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BoqController.prototype, "updateSubHeading", null);
__decorate([
    (0, common_1.Delete)('subheadings/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BoqController.prototype, "deleteSubHeading", null);
__decorate([
    (0, common_1.Get)('sections/:sectionId/subheadings'),
    __param(0, (0, common_1.Param)('sectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BoqController.prototype, "findSubHeadings", null);
__decorate([
    (0, common_1.Post)('items'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_boq_item_dto_1.CreateBoqItemDto]),
    __metadata("design:returntype", void 0)
], BoqController.prototype, "createItem", null);
__decorate([
    (0, common_1.Patch)('items/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BoqController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)('items/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BoqController.prototype, "deleteItem", null);
__decorate([
    (0, common_1.Post)(':id/calculate'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BoqController.prototype, "calculateTotal", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BoqController.prototype, "findBoq", null);
exports.BoqController = BoqController = __decorate([
    (0, common_1.Controller)('boq'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [boq_service_1.BoqService])
], BoqController);
//# sourceMappingURL=boq.controller.js.map