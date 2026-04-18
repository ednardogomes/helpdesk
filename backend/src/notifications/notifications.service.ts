import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notifRepository: Repository<Notification>,
  ) {}

  async create(userId: number, message: string, referenceUrl?: string): Promise<Notification> {
    const notif = this.notifRepository.create({
      user_id: userId,
      message,
      reference_url: referenceUrl,
    });
    // Simula log de notificação (Cenários 4.1 e 4.2 do BDD)
    console.log(`[Notificação] ${message}`);
    return await this.notifRepository.save(notif);
  }

  async findMyNotifications(userId: number): Promise<Notification[]> {
    return await this.notifRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async markAsRead(id: number): Promise<void> {
    await this.notifRepository.update(id, { is_read: true });
  }
}
