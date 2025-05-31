import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUser1748691462955 implements MigrationInterface {
    name = 'CreateUser1748691462955'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("_id" uuid NOT NULL DEFAULT gen_random_uuid(), "id" uuid NOT NULL, "email" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_cace4a159ff9f2512dd42373760" UNIQUE ("id"), CONSTRAINT "PK_457bfa3e35350a716846b03102d" PRIMARY KEY ("_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
