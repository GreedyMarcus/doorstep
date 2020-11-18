import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddReceptionistsToOfficeBuildings1605717711383 implements MigrationInterface {
  name = 'AddReceptionistsToOfficeBuildings1605717711383'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `users` ADD `office_building_id` int NULL')
    await queryRunner.query('ALTER TABLE `users` ADD CONSTRAINT `FK_7ee5d94c4da969aa1c3613844ca` FOREIGN KEY (`office_building_id`) REFERENCES `office_buildings`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `users` DROP FOREIGN KEY `FK_7ee5d94c4da969aa1c3613844ca`')
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `office_building_id`')
  }
}
