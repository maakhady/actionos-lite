import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExtractionService } from '../extraction/extraction.service';
import type { CreateCompteRenduDto } from './dto/create-compte-rendu.dto';
import type { UpdateCompteRenduDto } from './dto/update-compte-rendu.dto';

@Injectable()
export class ComptesRendusService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly extraction: ExtractionService,
  ) {}

  create(dto: CreateCompteRenduDto) {
    return this.prisma.compteRendu.create({ data: dto });
  }

  findAll() {
    return this.prisma.compteRendu.findMany({
      orderBy: { dateReunion: 'desc' },
      include: { _count: { select: { actions: true } } },
    });
  }

  async findOne(id: string) {
    const compteRendu = await this.prisma.compteRendu.findUnique({
      where: { id },
      include: { actions: { orderBy: { createdAt: 'asc' } } },
    });

    if (!compteRendu) {
      throw new NotFoundException(`Compte rendu ${id} introuvable`);
    }

    return compteRendu;
  }

  async update(id: string, dto: UpdateCompteRenduDto) {
    await this.findOne(id);
    return this.prisma.compteRendu.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.compteRendu.delete({ where: { id } });
  }

  analyser(texte: string) {
    return this.extraction.extraire(texte);
  }
}
