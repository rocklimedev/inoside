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
exports.CreateExecutionActivityDto = void 0;
const class_validator_1 = require("class-validator");
class CreateExecutionActivityDto {
    project_id;
    stage_id;
    title;
    description;
    activity_date;
    planned_quantity;
    completed_quantity;
    unit;
}
exports.CreateExecutionActivityDto = CreateExecutionActivityDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateExecutionActivityDto.prototype, "project_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateExecutionActivityDto.prototype, "stage_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExecutionActivityDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateExecutionActivityDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CreateExecutionActivityDto.prototype, "activity_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateExecutionActivityDto.prototype, "planned_quantity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateExecutionActivityDto.prototype, "completed_quantity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateExecutionActivityDto.prototype, "unit", void 0);
//# sourceMappingURL=create-activity.dto.js.map