"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateExecutionActivityDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_activity_dto_1 = require("./create-activity.dto");
class UpdateExecutionActivityDto extends (0, mapped_types_1.PartialType)(create_activity_dto_1.CreateExecutionActivityDto) {
}
exports.UpdateExecutionActivityDto = UpdateExecutionActivityDto;
//# sourceMappingURL=update-activity.dto.js.map