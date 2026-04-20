import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/enums/role.enum';
import { ModuleCompanyAccess } from '../../helpdesk-modules/entities/module-company-access.entity';
import { HelpdeskModule } from '../../helpdesk-modules/entities/helpdesk-module.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(ModuleCompanyAccess)
    private readonly accessRepository: Repository<ModuleCompanyAccess>,
    @InjectRepository(HelpdeskModule)
    private readonly modulesRepository: Repository<HelpdeskModule>,
  ) { }

  async create(createCompanyDto: any): Promise<Company> {
    try {
      // Validar CNPJ único
      if (createCompanyDto.cnpj) {
        const existingCompany = await this.companiesRepository.findOne({
          where: { cnpj: createCompanyDto.cnpj },
        });
        if (existingCompany) {
          throw new ConflictException('CNPJ já registrado');
        }
      }

      const company = this.companiesRepository.create(
        createCompanyDto as Partial<Company>,
      );
      const savedCompany = await this.companiesRepository.save(company);

      // Assign access to all active modules
      const activeModules = await this.modulesRepository.find({
        where: { is_active: true },
      });
      const accessEntries = activeModules.map((module) =>
        this.accessRepository.create({
          module_id: module.id,
          company_id: savedCompany.id,
        }),
      );
      await this.accessRepository.save(accessEntries);

      return savedCompany;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error('[CreateCompanyError]', error);
      throw new BadRequestException('Erro ao criar empresa');
    }
  }

  async registerCompanyWithAdmin(
    registerDto: any,
  ): Promise<{ company: Company; user: User }> {
    try {
      // Validar dados obrigatórios
      if (
        !registerDto.companyName ||
        !registerDto.cnpj ||
        !registerDto.fullName ||
        !registerDto.email ||
        !registerDto.password
      ) {
        throw new BadRequestException(
          'Campos obrigatórios: companyName, cnpj, fullName, email, password',
        );
      }

      // Validar se empresa já existe
      const existingCompany = await this.companiesRepository.findOne({
        where: { cnpj: registerDto.cnpj },
      });
      if (existingCompany) {
        throw new ConflictException('CNPJ já registrado');
      }

      // Validar se email já existe
      const existingUser = await this.usersRepository.findOne({
        where: { email: registerDto.email },
      });
      if (existingUser) {
        throw new ConflictException('Email já registrado');
      }

      // Criar empresa
      const company = this.companiesRepository.create({
        name: registerDto.companyName,
        cnpj: registerDto.cnpj,
        is_active: true,
      });
      const savedCompany = await this.companiesRepository.save(company);

      // Assign access to all active modules
      const activeModules = await this.modulesRepository.find({
        where: { is_active: true },
      });
      const accessEntries = activeModules.map((module) =>
        this.accessRepository.create({
          module_id: module.id,
          company_id: savedCompany.id,
        }),
      );
      await this.accessRepository.save(accessEntries);

      try {
        // Criar usuário admin para a empresa
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(registerDto.password, salt);

        const user = this.usersRepository.create({
          name: registerDto.fullName,
          email: registerDto.email,
          password_hash: hash,
          role: Role.ADMIN,
          company_id: savedCompany.id,
        });
        const savedUser = await this.usersRepository.save(user);
        const { password_hash, ...userResult } = savedUser;

        return { company: savedCompany, user: userResult as any };
      } catch (userError) {
        // Se falhar ao criar usuário, remove a empresa criada para evitar órfãos
        console.error('[UserCreationError]', userError);
        try {
          await this.companiesRepository.remove(savedCompany);
        } catch (rollbackError) {
          console.error('[RollbackError]', rollbackError);
        }
        throw new BadRequestException(
          `Erro ao criar administrador: ${userError.message}`,
        );
      }
    } catch (error) {
      // Re-throw erros conhecidos
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      // Logar e retornar erro genérico
      console.error('[RegisterCompanyError]', error);
      throw new BadRequestException(
        'Erro ao registrar empresa. Tente novamente.',
      );
    }
  }

  async findAll(): Promise<Company[]> {
    try {
      return await this.companiesRepository.find();
    } catch (error) {
      console.error('[FindAllCompaniesError]', error);
      throw new BadRequestException('Erro ao listar empresas');
    }
  }

  async findOne(id: number): Promise<Company> {
    try {
      const company = await this.companiesRepository.findOne({ where: { id } });
      if (!company) {
        throw new NotFoundException(`Empresa #${id} não encontrada`);
      }
      return company;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('[FindOneCompanyError]', error);
      throw new BadRequestException('Erro ao buscar empresa');
    }
  }

  async update(id: number, updateCompanyDto: any): Promise<Company> {
    try {
      const company = await this.findOne(id);
      this.companiesRepository.merge(company, updateCompanyDto);
      return await this.companiesRepository.save(company);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('[UpdateCompanyError]', error);
      throw new BadRequestException('Erro ao atualizar empresa');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const company = await this.findOne(id);
      await this.companiesRepository.remove(company);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('[RemoveCompanyError]', error);
      throw new BadRequestException('Erro ao remover empresa');
    }
  }

  async assignAllModulesToCompany(companyId: number): Promise<void> {
    try {
      const company = await this.findOne(companyId);
      // Remove existing accesses to avoid duplicates
      await this.accessRepository.delete({ company_id: companyId });

      // Assign access to all active modules
      const activeModules = await this.modulesRepository.find({
        where: { is_active: true },
      });
      const accessEntries = activeModules.map((module) =>
        this.accessRepository.create({
          module_id: module.id,
          company_id: companyId,
        }),
      );
      await this.accessRepository.save(accessEntries);
    } catch (error) {
      console.error('[AssignModulesError]', error);
      throw new BadRequestException('Erro ao atribuir módulos à empresa');
    }
  }
}
