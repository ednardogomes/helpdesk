import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { ModuleCompanyAccess } from '../helpdesk-modules/entities/module-company-access.entity';
import { TicketStatus } from './enums/ticket-status.enum';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(ModuleCompanyAccess)
    private readonly accessRepository: Repository<ModuleCompanyAccess>,
    private readonly notificationsService: NotificationsService,
  ) { }

  async create(
    createTicketDto: CreateTicketDto,
    userId: number,
    companyId: number,
  ): Promise<Ticket> {
    if (
      !createTicketDto.description ||
      createTicketDto.description.trim() === ''
    ) {
      throw new BadRequestException('A descrição é obrigatória');
    }

    if (!createTicketDto.module_id) {
      throw new BadRequestException('O módulo de destino é obrigatório');
    }

    // Validar se a empresa do usuário tem acesso a este módulo
    const hasAccess = await this.accessRepository.findOne({
      where: { module_id: createTicketDto.module_id, company_id: companyId },
    });

    if (!hasAccess) {
      throw new ForbiddenException(
        'Sua empresa não tem permissão para abrir chamados neste setor.',
      );
    }

    const ticket = this.ticketRepository.create({
      ...createTicketDto,
      requester_id: userId,
    } as Partial<Ticket>);

    return await this.ticketRepository.save(ticket);
  }

  // Lista todos os tickets que o usuário criou
  async findMyTickets(userId: number): Promise<Ticket[]> {
    return await this.ticketRepository.find({
      where: { requester_id: userId },
      relations: ['module'],
      order: { created_at: 'DESC' },
    });
  }

  // Retorna um ticket específico (somente se ele for o dono ou for admin/agent, mas faremos a validação básica aqui)
  async findOne(id: number, userId: number, role: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: ['module', 'requester', 'assignedAgent', 'comments'],
    });

    if (!ticket) {
      throw new NotFoundException('Chamado não encontrado');
    }

    // Se for usuário comum, só pode ver o próprio ticket
    if (role === 'USER' && ticket.requester_id !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para visualizar este chamado.',
      );
    }

    // Filtrar comentários se for usuário (não deve ver is_internal = true)
    if (role === 'USER' && ticket.comments) {
      ticket.comments = ticket.comments.filter((c) => !c.is_internal);
    }

    return ticket;
  }

  // Cenário 4.1: Atendente assume ticket
  async assignTicket(id: number, agentId: number): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({ where: { id } });
    if (!ticket) throw new NotFoundException('Chamado não encontrado');

    ticket.assigned_agent_id = agentId;
    ticket.status = TicketStatus.IN_PROGRESS;
    const updated = await this.ticketRepository.save(ticket);

    // Notifica usuário
    await this.notificationsService.create(
      ticket.requester_id,
      `Seu chamado #${ticket.id} está sendo atendido!`,
      `/tickets/${ticket.id}`,
    );

    return updated;
  }

  // Atendente/Admin altera o status
  async updateStatus(id: number, status: TicketStatus): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({ where: { id } });
    if (!ticket) throw new NotFoundException('Chamado não encontrado');

    ticket.status = status;
    if (status === TicketStatus.RESOLVED || status === TicketStatus.CLOSED) {
      ticket.resolved_at = new Date();
    }
    const updated = await this.ticketRepository.save(ticket);

    await this.notificationsService.create(
      ticket.requester_id,
      `O status do seu chamado #${ticket.id} mudou para ${status}`,
      `/tickets/${ticket.id}`,
    );

    return updated;
  }
}
