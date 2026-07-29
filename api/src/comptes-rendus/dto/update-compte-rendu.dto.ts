import { PartialType } from '@nestjs/mapped-types';
import { CreateCompteRenduDto } from './create-compte-rendu.dto';

export class UpdateCompteRenduDto extends PartialType(CreateCompteRenduDto) {}
