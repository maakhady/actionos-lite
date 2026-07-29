import { Module } from '@nestjs/common';
import { ExtractionModule } from './extraction/extraction.module';
import { ComptesRendusModule } from './comptes-rendus/comptes-rendus.module';
import { ActionsModule } from './actions/actions.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ExtractionModule, ComptesRendusModule, ActionsModule, PrismaModule],
})
export class AppModule {}
