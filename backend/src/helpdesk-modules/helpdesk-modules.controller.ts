import { Controller, Get, Post, Body, Param, UseGuards, Request, Delete } from '@nestjs/common';
import { HelpdeskModulesService } from './helpdesk-modules.service';
import { JwtAuthGuard } from '../iam/auth/jwt-auth.guard';
import { RolesGuard } from '../iam/auth/roles.guard';
import { Roles } from '../iam/auth/roles.decorator';
import { Role } from '../iam/users/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('helpdesk-modules')
export class HelpdeskModulesController {
  constructor(private readonly modulesService: HelpdeskModulesService) {}

  // Apenas admins podem criar módulos
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post()
  create(@Body() createDto: any) {
    return this.modulesService.create(createDto);
  }

  // Apenas admins podem listar TODOS os módulos ignorando a empresa
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get('all')
  findAll() {
    return this.modulesService.findAll();
  }

  // Qualquer usuário autenticado pode listar os módulos permitidos para a sua empresa
  @Get('my-modules')
  findMyModules(@Request() req: any) {
    const userCompanyId = req.user.company_id;
    return this.modulesService.findModulesByCompany(userCompanyId);
  }

  // Apenas admins podem vincular uma empresa a um módulo
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post(':id/access/:companyId')
  grantAccess(@Param('id') id: string, @Param('companyId') companyId: string) {
    return this.modulesService.grantAccess(+id, +companyId);
  }

  // Apenas admins podem remover o vínculo
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete(':id/access/:companyId')
  revokeAccess(@Param('id') id: string, @Param('companyId') companyId: string) {
    return this.modulesService.revokeAccess(+id, +companyId);
  }
}
