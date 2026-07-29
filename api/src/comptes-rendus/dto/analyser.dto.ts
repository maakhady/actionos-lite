import { IsNotEmpty, IsString } from 'class-validator';

export class AnalyserDto {
  @IsString()
  @IsNotEmpty({ message: 'Le texte à analyser est obligatoire' })
  texteSource!: string;
}
