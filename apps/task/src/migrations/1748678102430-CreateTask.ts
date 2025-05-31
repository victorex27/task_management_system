import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTask1748678102430 implements MigrationInterface {
    name = 'CreateTask1748678102430'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "title" character varying NOT NULL, "description" character varying NOT NULL, "assignedTo" uuid NOT NULL, "createdBy" uuid NOT NULL, "status" character varying NOT NULL, "priority" character varying NOT NULL, "isDeleted" boolean NOT NULL DEFAULT false, "dueDate" TIMESTAMP, "completedAt" TIMESTAMP, "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "task"`);
    }

}
