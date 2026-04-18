import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelpdeskModule } from './entities/helpdesk-module.entity';
import { ModuleCompanyAccess } from './entities/module-company-access.entity';
import { HelpdeskModulesService } from './helpdesk-modules.service';
import { HelpdeskModulesController } from './helpdesk-modules.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HelpdeskModule, ModuleCompanyAccess])],
  controllers: [HelpdeskModulesController],
  providers: [HelpdeskModulesService],
  exports: [HelpdeskModulesService],
})
export class HelpdeskModulesModule {}
