import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateActionDto } from './create-action.dto';

/* eslint-disable-next-line @typescript-eslint/no-unsafe-call */
export class UpdateActionDto extends PartialType(
  OmitType(CreateActionDto, ['compteRenduId'] as const),
) {}
