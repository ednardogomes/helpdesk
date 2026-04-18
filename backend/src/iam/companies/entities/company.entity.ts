import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ModuleCompanyAccess } from 'src/helpdesk-modules/entities/module-company-access.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 14, unique: true })
  cnpj: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => ModuleCompanyAccess, (access) => access.company)
  moduleAccesses: ModuleCompanyAccess[];

  @OneToMany(() => User, (user) => user.company)
  users: User[];
}
