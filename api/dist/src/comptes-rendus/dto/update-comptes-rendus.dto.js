"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateComptesRendusDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_comptes_rendus_dto_1 = require("./create-comptes-rendus.dto");
class UpdateComptesRendusDto extends (0, mapped_types_1.PartialType)(create_comptes_rendus_dto_1.CreateComptesRendusDto) {
}
exports.UpdateComptesRendusDto = UpdateComptesRendusDto;
//# sourceMappingURL=update-comptes-rendus.dto.js.map