import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { HelpdeskModulesModule } from '../helpdesk-modules/helpdesk-modules.module';
import { ModuleCompanyAccess } from '../helpdesk-modules/entities/module-company-access.entity';
import { Comment } from './entities/comment.entity';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, ModuleCompanyAccess, Comment]),
    HelpdeskModulesModule,
    NotificationsModule
  ],
  controllers: [TicketsController, CommentsController],
  providers: [TicketsService, CommentsService],
  exports: [TicketsService, CommentsService],
})
export class TicketingModule {}
