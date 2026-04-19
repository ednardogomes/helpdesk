import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedHelpdeskModules1800000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "helpdesk_modules" ("name", "description", "icon", "is_active") VALUES
            ('TI (Tecnologia da Informação)', 'Suporte a Hardware, Software, Rede e Acesso.', 'pi-desktop', true),
            ('RH (Recursos Humanos)', 'Assuntos como Férias, Benefícios, Ponto Eletrônico e Recrutamento.', 'pi-users', true),
            ('Manutenção (Infraestrutura/Predial)', 'Manutenção Elétrica, Hidráulica, Civil e Equipamentos.', 'pi-wrench', true),
            ('Qualidade de Produtos (Controle e Garantia da Qualidade)', 'Controle de Não Conformidade e Defeitos.', 'pi-check-circle', true);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "helpdesk_modules" WHERE "name" IN (
                'TI (Tecnologia da Informação)',
                'RH (Recursos Humanos)',
                'Manutenção (Infraestrutura/Predial)',
                'Qualidade de Produtos (Controle e Garantia da Qualidade)'
            );
        `);
    }
}
