import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ActionsService } from './actions.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { ValiderActionsDto } from './dto/valider-actions.dto';
import { FiltrerActionsDto } from './dto/filtrer-actions.dto';

@Controller('actions')
export class ActionsController {
  constructor(private readonly service: ActionsService) {}

  @Post()
  create(@Body() dto: CreateActionDto) {
    return this.service.create(dto);
  }

  @Post('valider')
  valider(@Body() dto: ValiderActionsDto) {
    return this.service.createMany(dto.compteRenduId, dto.actions);
  }

  @Get()
  findAll(@Query() filtres: FiltrerActionsDto) {
    return this.service.findAll(filtres.statut);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateActionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
