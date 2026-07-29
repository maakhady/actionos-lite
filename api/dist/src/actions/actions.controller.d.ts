import { ActionsService } from './actions.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { ValiderActionsDto } from './dto/valider-actions.dto';
import { FiltrerActionsDto } from './dto/filtrer-actions.dto';
export declare class ActionsController {
    private readonly service;
    constructor(service: ActionsService);
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
    valider(dto: ValiderActionsDto): Promise<{
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
    findAll(filtres: FiltrerActionsDto): import("@prisma/client").Prisma.PrismaPromise<({
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
