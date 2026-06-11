"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateExecutionStageDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_stage_dto_1 = require("./create-stage.dto");
class UpdateExecutionStageDto extends (0, mapped_types_1.PartialType)(create_stage_dto_1.CreateExecutionStageDto) {
}
exports.UpdateExecutionStageDto = UpdateExecutionStageDto;
//# sourceMappingURL=update-stage.dto.js.map