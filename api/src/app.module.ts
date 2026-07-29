import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExtractionModule } from './extraction/extraction.module';

@Module({
  imports: [ExtractionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
