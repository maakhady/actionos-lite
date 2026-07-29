"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCompteRenduDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_compte_rendu_dto_1 = require("./create-compte-rendu.dto");
class UpdateCompteRenduDto extends (0, mapped_types_1.PartialType)(create_compte_rendu_dto_1.CreateCompteRenduDto) {
}
exports.UpdateCompteRenduDto = UpdateCompteRenduDto;
//# sourceMappingURL=update-compte-rendu.dto.js.map