import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompaniesModule } from './iam/companies/companies.module';
import { UsersModule } from './iam/users/users.module';
import { AuthModule } from './iam/auth/auth.module';
import { HelpdeskModulesModule } from './helpdesk-modules/helpdesk-modules.module';
import { TicketingModule } from './ticketing/ticketing.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'rootpassword',
      database: 'helpdesk_db',
      autoLoadEntities: true,
      synchronize: false, // Alterado para false para usarmos Migrations
    }),
    CompaniesModule,
    UsersModule,
    AuthModule,
    HelpdeskModulesModule,
    TicketingModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
