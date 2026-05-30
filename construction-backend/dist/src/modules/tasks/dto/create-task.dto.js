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
exports.CreateTaskDto = exports.TaskStatus = exports.TaskType = exports.TaskPriority = void 0;
const class_validator_1 = require("class-validator");
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["LOW"] = "low";
    TaskPriority["MEDIUM"] = "medium";
    TaskPriority["HIGH"] = "high";
    TaskPriority["URGENT"] = "urgent";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
var TaskType;
(function (TaskType) {
    TaskType["GENERAL"] = "General";
    TaskType["DESIGN_UPLOAD"] = "Design upload";
    TaskType["REVISION_RESPONSE"] = "Revision response";
    TaskType["SITE_VISIT"] = "Site visit";
    TaskType["VENDOR_FOLLOW_UP"] = "Vendor follow-up";
    TaskType["INVENTORY_DISPATCH"] = "Inventory dispatch";
    TaskType["QUALITY_CHECK"] = "Quality check";
    TaskType["CLIENT_RESPONSE"] = "Client response";
    TaskType["INTERNAL_DOCUMENTATION"] = "Internal documentation";
})(TaskType || (exports.TaskType = TaskType = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["TODO"] = "todo";
    TaskStatus["IN_PROGRESS"] = "in_progress";
    TaskStatus["REVIEW"] = "review";
    TaskStatus["COMPLETED"] = "completed";
    TaskStatus["BLOCKED"] = "blocked";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
class CreateTaskDto {
    project_id;
    title;
    module;
    description;
    assigned_to_user_id;
    due_date;
    priority;
    task_type;
    status;
}
exports.CreateTaskDto = CreateTaskDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({
        message: 'Project ID is required',
    }),
    (0, class_validator_1.IsUUID)('all', {
        message: 'Invalid Project ID format',
    }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "project_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({
        message: 'Task title is required',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "module", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('all', {
        message: 'Assigned user ID must be a valid UUID',
    }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "assigned_to_user_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, {
        message: 'Due date must be a valid date',
    }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "due_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(TaskPriority, {
        message: 'Invalid priority value',
    }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(TaskType, {
        message: 'Invalid task type',
    }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "task_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(TaskStatus, {
        message: 'Invalid status value',
    }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "status", void 0);
//# sourceMappingURL=create-task.dto.js.map