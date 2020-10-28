import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddPasswordTokenToUserTable1603813774335 implements MigrationInterface {
  name = 'AddPasswordTokenToUserTable1603813774335'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `users` ADD `password_token` varchar(255) NULL')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `password_token`')
  }
}
