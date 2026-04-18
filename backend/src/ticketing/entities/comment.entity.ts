import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Ticket } from './ticket.entity';
import { User } from '../../iam/users/entities/user.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ticket_id: number;

  @Column()
  author_id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  is_internal: boolean;

  @ManyToOne(() => Ticket, (ticket) => ticket.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ticket_id', foreignKeyConstraintName: 'fk_comment_ticket' })
  ticket: Ticket;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id', foreignKeyConstraintName: 'fk_comment_author' })
  author: User;

  @CreateDateColumn()
  created_at: Date;
}
