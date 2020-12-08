import { MigrationInterface, QueryRunner } from 'typeorm'

export class ModifiedGuestSignatureType1607510889619 implements MigrationInterface {
  name = 'ModifiedGuestSignatureType1607510889619'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `guests` CHANGE `signature_image_url` `signature` varchar(255) NULL')
    await queryRunner.query('ALTER TABLE `guests` DROP COLUMN `signature`')
    await queryRunner.query('ALTER TABLE `guests` ADD `signature` text NULL')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `guests` DROP COLUMN `signature`')
    await queryRunner.query('ALTER TABLE `guests` ADD `signature` varchar(255) NULL')
    await queryRunner.query('ALTER TABLE `guests` CHANGE `signature` `signature_image_url` varchar(255) NULL')
  }
}
