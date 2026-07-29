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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateActionDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const action_brouillon_1 = require("../../extraction/domain/action-brouillon");
class CreateActionDto {
    compteRenduId;
    description;
    responsable;
    echeance;
    priorite;
    statut;
}
exports.CreateActionDto = CreateActionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateActionDto.prototype, "compteRenduId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La description est obligatoire' }),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateActionDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateActionDto.prototype, "responsable", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)({ message: "L'échéance est invalide" }),
    __metadata("design:type", Object)
], CreateActionDto.prototype, "echeance", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(action_brouillon_1.Priorite),
    __metadata("design:type", String)
], CreateActionDto.prototype, "priorite", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(action_brouillon_1.Statut),
    __metadata("design:type", typeof (_a = typeof action_brouillon_1.Statut !== "undefined" && action_brouillon_1.Statut) === "function" ? _a : Object)
], CreateActionDto.prototype, "statut", void 0);
//# sourceMappingURL=create-action.dto.js.map