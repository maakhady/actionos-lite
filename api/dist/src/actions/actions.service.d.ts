import { PrismaService } from '../prisma/prisma.service';
import type { CreateActionDto } from './dto/create-action.dto';
import type { UpdateActionDto } from './dto/update-action.dto';
import { Statut } from '../extraction/domain/action-brouillon';
export declare class ActionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateActionDto): import("@prisma/client").Prisma.Prisma__ActionClient<{
        id: string;
        description: string;
        responsable: string | null;
        echeance: Date | null;
        priorite: import("@prisma/client").$Enums.Priorite;
        statut: import("@prisma/client").$Enums.Statut;
        origine: import("@prisma/client").$Enums.Origine;
        createdAt: Date;
        updatedAt: Date;
        compteRenduId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    createMany(compteRenduId: string, actions: CreateActionDto[]): Promise<{
        id: string;
        description: string;
        responsable: string | null;
        echeance: Date | null;
        priorite: import("@prisma/client").$Enums.Priorite;
        statut: import("@prisma/client").$Enums.Statut;
        origine: import("@prisma/client").$Enums.Origine;
        createdAt: Date;
        updatedAt: Date;
        compteRenduId: string;
    }[]>;
    findAll(statut?: Statut): import("@prisma/client").Prisma.PrismaPromise<({
        compteRendu: {
            id: string;
            titre: string;
        };
    } & {
        id: string;
        description: string;
        responsable: string | null;
        echeance: Date | null;
        priorite: import("@prisma/client").$Enums.Priorite;
        statut: import("@prisma/client").$Enums.Statut;
        origine: import("@prisma/client").$Enums.Origine;
        createdAt: Date;
        updatedAt: Date;
        compteRenduId: string;
    })[]>;
    findOne(id: string): Promise<{
        id: string;
        description: string;
        responsable: string | null;
        echeance: Date | null;
        priorite: import("@prisma/client").$Enums.Priorite;
        statut: import("@prisma/client").$Enums.Statut;
        origine: import("@prisma/client").$Enums.Origine;
        createdAt: Date;
        updatedAt: Date;
        compteRenduId: string;
    }>;
    update(id: string, dto: UpdateActionDto): Promise<{
        id: string;
        description: string;
        responsable: string | null;
        echeance: Date | null;
        priorite: import("@prisma/client").$Enums.Priorite;
        statut: import("@prisma/client").$Enums.Statut;
        origine: import("@prisma/client").$Enums.Origine;
        createdAt: Date;
        updatedAt: Date;
        compteRenduId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        description: string;
        responsable: string | null;
        echeance: Date | null;
        priorite: import("@prisma/client").$Enums.Priorite;
        statut: import("@prisma/client").$Enums.Statut;
        origine: import("@prisma/client").$Enums.Origine;
        createdAt: Date;
        updatedAt: Date;
        compteRenduId: string;
    }>;
}
