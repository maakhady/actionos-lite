import { ComptesRendusService } from './comptes-rendus.service';
import { CreateCompteRenduDto } from './dto/create-compte-rendu.dto';
import { UpdateCompteRenduDto } from './dto/update-compte-rendu.dto';
import { AnalyserDto } from './dto/analyser.dto';
export declare class ComptesRendusController {
    private readonly service;
    constructor(service: ComptesRendusService);
    create(dto: CreateCompteRenduDto): import("@prisma/client").Prisma.Prisma__CompteRenduClient<{
        id: string;
        titre: string;
        dateReunion: Date;
        texteSource: string;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    analyser(dto: AnalyserDto): Promise<import("../extraction/domain/action-brouillon").ActionBrouillon[]>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        _count: {
            actions: number;
        };
    } & {
        id: string;
        titre: string;
        dateReunion: Date;
        texteSource: string;
        createdAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        actions: {
            id: string;
            createdAt: Date;
            compteRenduId: string;
            description: string;
            responsable: string | null;
            echeance: Date | null;
            priorite: import("@prisma/client").$Enums.Priorite;
            statut: import("@prisma/client").$Enums.Statut;
            origine: import("@prisma/client").$Enums.Origine;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        titre: string;
        dateReunion: Date;
        texteSource: string;
        createdAt: Date;
    }>;
    update(id: string, dto: UpdateCompteRenduDto): Promise<{
        id: string;
        titre: string;
        dateReunion: Date;
        texteSource: string;
        createdAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        titre: string;
        dateReunion: Date;
        texteSource: string;
        createdAt: Date;
    }>;
}
