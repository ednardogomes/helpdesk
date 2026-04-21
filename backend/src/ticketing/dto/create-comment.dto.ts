import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty({ message: 'Conteúdo é obrigatório' })
  @IsString({ message: 'Conteúdo deve ser uma string' })
  content: string;

  @IsNotEmpty({ message: 'ID do ticket é obrigatório' })
  @IsNumber({}, { message: 'ID do ticket deve ser um número' })
  ticket_id: number;
}
