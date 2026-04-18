import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { HelpdeskModule } from './helpdesk-module.entity';
import { Company } from '../../iam/companies/entities/company.entity';

@Entity('module_company_access')
export class ModuleCompanyAccess {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  module_id: number;

  @Column()
  company_id: number;

  @ManyToOne(() => HelpdeskModule, (module) => module.companyAccesses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'module_id' })
  module: HelpdeskModule;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'company_id',
    foreignKeyConstraintName: 'fk_access_company'
  })
  company: Company;

  @CreateDateColumn()
  created_at: Date;
}
