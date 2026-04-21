import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../iam/auth/jwt-auth.guard';
import { RolesGuard } from '../iam/auth/roles.guard';
import { Roles } from '../iam/auth/roles.decorator';
import { Role } from '../iam/users/enums/role.enum';
import { TicketStatus } from './enums/ticket-status.enum';
import { CreateTicketDto } from './dto/create-ticket.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  create(@Body() createTicketDto: CreateTicketDto, @Request() req: any) {
    const userId = req.user.userId; // Vem do JwtStrategy (sub)
    const companyId = req.user.company_id; // Vem do JwtStrategy
    return this.ticketsService.create(createTicketDto, userId, companyId);
  }

  @Get('my-tickets')
  findMyTickets(@Request() req: any) {
    const userId = req.user.userId;
    return this.ticketsService.findMyTickets(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.userId;
    const role = req.user.role;
    return this.ticketsService.findOne(+id, userId, role);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.AGENT)
  @Patch(':id/assign')
  assignTicket(@Param('id') id: string, @Request() req: any) {
    const agentId = req.user.userId;
    return this.ticketsService.assignTicket(+id, agentId);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.AGENT)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: TicketStatus) {
    return this.ticketsService.updateStatus(+id, status);
  }
}
