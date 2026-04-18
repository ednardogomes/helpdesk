import { MigrationInterface, QueryRunner } from "typeorm";

export class Fase3Ticketing1776546050164 implements MigrationInterface {
    name = 'Fase3Ticketing1776546050164'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_7ae6334059289559722437bcc1c"`);
        await queryRunner.query(`ALTER TABLE "module_company_access" DROP CONSTRAINT "FK_4c1a05a5db684ad17905dbca5c9"`);
        await queryRunner.query(`CREATE TYPE "public"."tickets_status_enum" AS ENUM('OPEN', 'IN_PROGRESS', 'PENDING_USER', 'RESOLVED', 'CLOSED')`);
        await queryRunner.query(`CREATE TYPE "public"."tickets_priority_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH')`);
        await queryRunner.query(`CREATE TABLE "tickets" ("id" SERIAL NOT NULL, "module_id" integer NOT NULL, "requester_id" integer NOT NULL, "assigned_agent_id" integer, "status" "public"."tickets_status_enum" NOT NULL DEFAULT 'OPEN', "priority" "public"."tickets_priority_enum" NOT NULL DEFAULT 'MEDIUM', "subject" character varying(255) NOT NULL, "description" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "resolved_at" TIMESTAMP, CONSTRAINT "PK_343bc942ae261cf7a1377f48fd0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "fk_users_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "module_company_access" ADD CONSTRAINT "fk_access_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD CONSTRAINT "fk_ticket_module" FOREIGN KEY ("module_id") REFERENCES "helpdesk_modules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD CONSTRAINT "fk_ticket_requester" FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD CONSTRAINT "fk_ticket_assigned_agent" FOREIGN KEY ("assigned_agent_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "fk_ticket_assigned_agent"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "fk_ticket_requester"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "fk_ticket_module"`);
        await queryRunner.query(`ALTER TABLE "module_company_access" DROP CONSTRAINT "fk_access_company"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "fk_users_company"`);
        await queryRunner.query(`DROP TABLE "tickets"`);
        await queryRunner.query(`DROP TYPE "public"."tickets_priority_enum"`);
        await queryRunner.query(`DROP TYPE "public"."tickets_status_enum"`);
        await queryRunner.query(`ALTER TABLE "module_company_access" ADD CONSTRAINT "FK_4c1a05a5db684ad17905dbca5c9" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_7ae6334059289559722437bcc1c" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
