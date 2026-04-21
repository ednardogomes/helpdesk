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
import { RegisterCompanyWithAdminDto } from './dto/register-company-with-admin.dto';
import { CreateCompanyDto } from './dto/create-company.dto';

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

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    try {
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
      if (error instanceof ConflictException) throw error;
      console.error('[CreateCompanyError]', error);
      throw new BadRequestException('Erro ao criar empresa');
    }
  }

  async registerCompanyWithAdmin(
    registerDto: RegisterCompanyWithAdminDto,
  ): Promise<any> {
    try {
      // 1. Validar se empresa já existe
      const existingCompany = await this.companiesRepository.findOne({
        where: { cnpj: registerDto.cnpj },
      });
      if (existingCompany) {
        throw new ConflictException('CNPJ já registrado');
      }

      // 2. Validar se email já existe
      const existingUser = await this.usersRepository.findOne({
        where: { email: registerDto.email },
      });
      if (existingUser) {
        throw new ConflictException('Email já registrado');
      }

      // 3. Criar empresa
      const company = this.companiesRepository.create({
        name: registerDto.companyName,
        cnpj: registerDto.cnpj,
        is_active: true,
      });
      const savedCompany = await this.companiesRepository.save(company);

      // 4. Atribuir módulos
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
        // 5. Criar usuário admin para a empresa
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

        return { company: savedCompany, user: userResult };
      } catch (userError) {
        // Rollback: se falhar o usuário, remove a empresa
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
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('[RegisterCompanyError]', error);
      throw new BadRequestException('Erro ao registrar empresa.');
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
    const company = await this.companiesRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Empresa #${id} não encontrada`);
    }
    return company;
  }

  async update(id: number, updateCompanyDto: any): Promise<Company> {
    const company = await this.findOne(id);
    this.companiesRepository.merge(company, updateCompanyDto);
    return await this.companiesRepository.save(company);
  }

  async remove(id: number): Promise<void> {
    const company = await this.findOne(id);
    await this.companiesRepository.remove(company);
  }

  async assignAllModulesToCompany(companyId: number): Promise<void> {
    try {
      await this.findOne(companyId);
      await this.accessRepository.delete({ company_id: companyId });

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
