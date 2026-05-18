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
exports.CreateProjectPitchDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateProjectPitchDto {
    project_id;
    preferred_design_style;
    color_tone;
    luxury_level;
    functional_vs_aesthetic;
    budget_flexibility;
    priority_areas;
    likes_dislikes;
    non_negotiables;
    special_requirements;
    moodboard_pdf_url;
    pitch_pdf_url;
}
exports.CreateProjectPitchDto = CreateProjectPitchDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Project ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateProjectPitchDto.prototype, "project_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Modern Minimalist' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectPitchDto.prototype, "preferred_design_style", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['Light', 'Dark', 'Mixed', 'Not Sure'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['Light', 'Dark', 'Mixed', 'Not Sure']),
    __metadata("design:type", String)
], CreateProjectPitchDto.prototype, "color_tone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['Low', 'Medium', 'High'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['Low', 'Medium', 'High']),
    __metadata("design:type", String)
], CreateProjectPitchDto.prototype, "luxury_level", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'More focus on functionality than aesthetics',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectPitchDto.prototype, "functional_vs_aesthetic", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProjectPitchDto.prototype, "budget_flexibility", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Array of priority areas' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateProjectPitchDto.prototype, "priority_areas", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectPitchDto.prototype, "likes_dislikes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectPitchDto.prototype, "non_negotiables", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectPitchDto.prototype, "special_requirements", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/moodboard.pdf' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectPitchDto.prototype, "moodboard_pdf_url", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/pitch.pdf' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectPitchDto.prototype, "pitch_pdf_url", void 0);
//# sourceMappingURL=create-project-pitch.dto.js.map