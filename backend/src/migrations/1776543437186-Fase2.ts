import { MigrationInterface, QueryRunner } from "typeorm";

export class Fase21776543437186 implements MigrationInterface {
    name = 'Fase21776543437186'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "helpdesk_modules" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" text, "icon" character varying(100), "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1dfde6cf9a2bbc52be34d53861a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "module_company_access" ("id" SERIAL NOT NULL, "module_id" integer NOT NULL, "company_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5a35a1687c7d523bc1cea1b662a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "module_company_access" ADD CONSTRAINT "FK_da4664d3b74f9b378e2dd5c1634" FOREIGN KEY ("module_id") REFERENCES "helpdesk_modules"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "module_company_access" ADD CONSTRAINT "FK_4c1a05a5db684ad17905dbca5c9" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "module_company_access" DROP CONSTRAINT "FK_4c1a05a5db684ad17905dbca5c9"`);
        await queryRunner.query(`ALTER TABLE "module_company_access" DROP CONSTRAINT "FK_da4664d3b74f9b378e2dd5c1634"`);
        await queryRunner.query(`DROP TABLE "module_company_access"`);
        await queryRunner.query(`DROP TABLE "helpdesk_modules"`);
    }

}
