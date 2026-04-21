import { IsNotEmpty, IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { TicketPriority } from '../enums/ticket-priority.enum';
import { TicketStatus } from '../enums/ticket-status.enum';

export class CreateTicketDto {
  @IsNotEmpty({ message: 'Assunto é obrigatório' })
  @IsString({ message: 'Assunto deve ser uma string' })
  subject: string;

  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @IsString({ message: 'Descrição deve ser uma string' })
  description: string;

  @IsEnum(TicketPriority, { message: 'Prioridade inválida' })
  @IsOptional()
  priority?: TicketPriority;

  @IsEnum(TicketStatus, { message: 'Status inválido' })
  @IsOptional()
  status?: TicketStatus;

  @IsNumber({}, { message: 'Módulo deve ser um número' })
  @IsOptional()
  module_id?: number;
}
