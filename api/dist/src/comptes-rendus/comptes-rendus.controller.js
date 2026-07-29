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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComptesRendusController = void 0;
const common_1 = require("@nestjs/common");
const comptes_rendus_service_1 = require("./comptes-rendus.service");
const create_compte_rendu_dto_1 = require("./dto/create-compte-rendu.dto");
const update_compte_rendu_dto_1 = require("./dto/update-compte-rendu.dto");
const analyser_dto_1 = require("./dto/analyser.dto");
let ComptesRendusController = class ComptesRendusController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto) {
        return this.service.create(dto);
    }
    analyser(dto) {
        return this.service.analyser(dto.texteSource);
    }
    findAll() {
        return this.service.findAll();
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    remove(id) {
        return this.service.remove(id);
    }
};
exports.ComptesRendusController = ComptesRendusController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_compte_rendu_dto_1.CreateCompteRenduDto]),
    __metadata("design:returntype", void 0)
], ComptesRendusController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('analyser'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analyser_dto_1.AnalyserDto]),
    __metadata("design:returntype", void 0)
], ComptesRendusController.prototype, "analyser", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ComptesRendusController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ComptesRendusController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_compte_rendu_dto_1.UpdateCompteRenduDto]),
    __metadata("design:returntype", void 0)
], ComptesRendusController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ComptesRendusController.prototype, "remove", null);
exports.ComptesRendusController = ComptesRendusController = __decorate([
    (0, common_1.Controller)('comptes-rendus'),
    __metadata("design:paramtypes", [comptes_rendus_service_1.ComptesRendusService])
], ComptesRendusController);
//# sourceMappingURL=comptes-rendus.controller.js.map