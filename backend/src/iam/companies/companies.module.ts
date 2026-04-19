import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { User } from '../users/entities/user.entity';
import { ModuleCompanyAccess } from '../../helpdesk-modules/entities/module-company-access.entity';
import { HelpdeskModule } from '../../helpdesk-modules/entities/helpdesk-module.entity';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Company,
      User,
      ModuleCompanyAccess,
      HelpdeskModule,
    ]),
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule { }
