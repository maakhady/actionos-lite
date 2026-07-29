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
exports.ActionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ActionsService = class ActionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(dto) {
        const { compteRenduId, ...donnees } = dto;
        if (!compteRenduId) {
            throw new common_1.BadRequestException('Le compte rendu est obligatoire');
        }
        return this.prisma.action.create({
            data: { ...donnees, compteRenduId },
        });
    }
    createMany(compteRenduId, actions) {
        return this.prisma.$transaction(actions.map((action) => this.prisma.action.create({ data: { ...action, compteRenduId } })));
    }
    findAll(statut) {
        return this.prisma.action.findMany({
            where: statut ? { statut } : undefined,
            orderBy: [{ echeance: 'asc' }, { createdAt: 'desc' }],
            include: { compteRendu: { select: { id: true, titre: true } } },
        });
    }
    async findOne(id) {
        const action = await this.prisma.action.findUnique({ where: { id } });
        if (!action) {
            throw new common_1.NotFoundException(`Action ${id} introuvable`);
        }
        return action;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.action.update({ where: { id }, data: dto });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.action.delete({ where: { id } });
    }
};
exports.ActionsService = ActionsService;
exports.ActionsService = ActionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ActionsService);
//# sourceMappingURL=actions.service.js.map