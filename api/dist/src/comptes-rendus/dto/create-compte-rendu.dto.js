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
exports.CreateCompteRenduDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateCompteRenduDto {
    titre;
    dateReunion;
    texteSource;
}
exports.CreateCompteRenduDto = CreateCompteRenduDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le titre est obligatoire' }),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateCompteRenduDto.prototype, "titre", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)({ message: 'La date de réunion est invalide' }),
    __metadata("design:type", Date)
], CreateCompteRenduDto.prototype, "dateReunion", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le texte du compte rendu est obligatoire' }),
    __metadata("design:type", String)
], CreateCompteRenduDto.prototype, "texteSource", void 0);
//# sourceMappingURL=create-compte-rendu.dto.js.map