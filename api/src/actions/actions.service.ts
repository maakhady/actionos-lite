import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateActionDto } from './dto/create-action.dto';
import type { UpdateActionDto } from './dto/update-action.dto';
import { Statut } from '../extraction/domain/action-brouillon';

@Injectable()
export class ActionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateActionDto) {
    const { compteRenduId, ...donnees } = dto;

    if (!compteRenduId) {
      throw new BadRequestException('Le compte rendu est obligatoire');
    }

    return this.prisma.action.create({
      data: { ...donnees, compteRenduId },
    });
  }

  createMany(compteRenduId: string, actions: CreateActionDto[]) {
    return this.prisma.$transaction(
      actions.map((action) =>
        this.prisma.action.create({ data: { ...action, compteRenduId } }),
      ),
    );
  }

  findAll(statut?: Statut) {
    return this.prisma.action.findMany({
      where: statut ? { statut } : undefined,
      orderBy: [{ echeance: 'asc' }, { createdAt: 'desc' }],
      include: { compteRendu: { select: { id: true, titre: true } } },
    });
  }

  async findOne(id: string) {
    const action = await this.prisma.action.findUnique({ where: { id } });

    if (!action) {
      throw new NotFoundException(`Action ${id} introuvable`);
    }

    return action;
  }

  async update(id: string, dto: UpdateActionDto) {
    await this.findOne(id);
    return this.prisma.action.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.action.delete({ where: { id } });
  }
}
