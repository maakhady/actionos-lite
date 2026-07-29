import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ComptesRendusService } from './comptes-rendus.service';
import { CreateCompteRenduDto } from './dto/create-compte-rendu.dto';
import { UpdateCompteRenduDto } from './dto/update-compte-rendu.dto';
import { AnalyserDto } from './dto/analyser.dto';

@Controller('comptes-rendus')
export class ComptesRendusController {
  constructor(private readonly service: ComptesRendusService) {}

  @Post()
  create(@Body() dto: CreateCompteRenduDto) {
    return this.service.create(dto);
  }

  @Post('analyser')
  analyser(@Body() dto: AnalyserDto) {
    return this.service.analyser(dto.texteSource);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCompteRenduDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
