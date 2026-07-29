import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsUUID, ValidateNested } from 'class-validator';
import { CreateActionDto } from './create-action.dto';

export class ValiderActionsDto {
  @IsUUID()
  compteRenduId!: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Au moins une action est requise' })
  @ValidateNested({ each: true })
  @Type(() => CreateActionDto)
  actions!: CreateActionDto[];
}
