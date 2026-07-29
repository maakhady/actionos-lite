"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateActionDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_action_dto_1 = require("./create-action.dto");
class UpdateActionDto extends (0, mapped_types_1.PartialType)((0, mapped_types_1.OmitType)(create_action_dto_1.CreateActionDto, ['compteRenduId'])) {
}
exports.UpdateActionDto = UpdateActionDto;
//# sourceMappingURL=update-action.dto.js.map