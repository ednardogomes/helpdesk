import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelpdeskModule } from './entities/helpdesk-module.entity';
import { ModuleCompanyAccess } from './entities/module-company-access.entity';

@Injectable()
export class HelpdeskModulesService {
  constructor(
    @InjectRepository(HelpdeskModule)
    private readonly moduleRepository: Repository<HelpdeskModule>,
    @InjectRepository(ModuleCompanyAccess)
    private readonly accessRepository: Repository<ModuleCompanyAccess>,
  ) {}

  async create(createDto: any): Promise<HelpdeskModule> {
    const module = this.moduleRepository.create(createDto as Partial<HelpdeskModule>);
    return await this.moduleRepository.save(module);
  }

  async findAll(): Promise<HelpdeskModule[]> {
    return await this.moduleRepository.find();
  }

  async findOne(id: number): Promise<HelpdeskModule> {
    const module = await this.moduleRepository.findOne({ where: { id } });
    if (!module) throw new NotFoundException('Module not found');
    return module;
  }

  // Permite que um usuário comum veja apenas os módulos da sua empresa
  async findModulesByCompany(companyId: number): Promise<HelpdeskModule[]> {
    const accesses = await this.accessRepository.find({
      where: { company_id: companyId },
      relations: ['module'],
    });
    return accesses.map((access) => access.module).filter(m => m.is_active);
  }

  // Associa uma empresa a um módulo
  async grantAccess(moduleId: number, companyId: number): Promise<ModuleCompanyAccess> {
    const access = this.accessRepository.create({ module_id: moduleId, company_id: companyId });
    return await this.accessRepository.save(access);
  }

  // Remove a associação
  async revokeAccess(moduleId: number, companyId: number): Promise<void> {
    await this.accessRepository.delete({ module_id: moduleId, company_id: companyId });
  }
}
