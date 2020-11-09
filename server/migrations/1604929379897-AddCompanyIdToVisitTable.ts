import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddCompanyIdToVisitTable1604929379897 implements MigrationInterface {
  name = 'AddCompanyIdToVisitTable1604929379897'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `visits` ADD `company_id` int NULL')
    await queryRunner.query('ALTER TABLE `visits` ADD CONSTRAINT `FK_fa4dbf8d80e7fea535367cd94e9` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `visits` DROP FOREIGN KEY `FK_fa4dbf8d80e7fea535367cd94e9`')
    await queryRunner.query('ALTER TABLE `visits` DROP COLUMN `company_id`')
  }
}
