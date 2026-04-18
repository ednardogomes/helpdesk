import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { HelpdeskModule } from '../../helpdesk-modules/entities/helpdesk-module.entity';
import { User } from '../../iam/users/entities/user.entity';
import { TicketStatus } from '../enums/ticket-status.enum';
import { TicketPriority } from '../enums/ticket-priority.enum';
import { Comment } from './comment.entity';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  module_id: number;

  @Column()
  requester_id: number;

  @Column({ nullable: true })
  assigned_agent_id: number;

  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.OPEN })
  status: TicketStatus;

  @Column({ type: 'enum', enum: TicketPriority, default: TicketPriority.MEDIUM })
  priority: TicketPriority;

  @Column({ type: 'varchar', length: 255 })
  subject: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => HelpdeskModule)
  @JoinColumn({ name: 'module_id', foreignKeyConstraintName: 'fk_ticket_module' })
  module: HelpdeskModule;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'requester_id', foreignKeyConstraintName: 'fk_ticket_requester' })
  requester: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_agent_id', foreignKeyConstraintName: 'fk_ticket_assigned_agent' })
  assignedAgent: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  resolved_at: Date;

  @OneToMany(() => Comment, (comment) => comment.ticket)
  comments: Comment[];
}
