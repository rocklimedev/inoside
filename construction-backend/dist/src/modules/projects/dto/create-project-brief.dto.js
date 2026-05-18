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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProjectBriefDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateProjectBriefDto {
    project_id;
    rooms_spaces_required;
    parking_required;
    first_construction_project;
    decision_readiness;
    end_to_end_services;
    output_client_profile;
    output_project_profile;
    status;
}
exports.CreateProjectBriefDto = CreateProjectBriefDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Project ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateProjectBriefDto.prototype, "project_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Rooms and spaces required' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateProjectBriefDto.prototype, "rooms_spaces_required", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProjectBriefDto.prototype, "parking_required", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProjectBriefDto.prototype, "first_construction_project", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Ready',
        enum: ['Ready', 'Not Ready', 'Need Discussion'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectBriefDto.prototype, "decision_readiness", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProjectBriefDto.prototype, "end_to_end_services", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateProjectBriefDto.prototype, "output_client_profile", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateProjectBriefDto.prototype, "output_project_profile", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 'Pending' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectBriefDto.prototype, "status", void 0);
//# sourceMappingURL=create-project-brief.dto.js.map