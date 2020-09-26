import { MigrationInterface, QueryRunner } from "typeorm"
import UserRole from '../models/UserRole'
import UserPermission from '../models/UserPermission'
import UserRolePermissionsSeed from '../seed/UserRolePermissionsSeed'

export class InitialSchema1600970828879 implements MigrationInterface {
  name = 'InitialSchema1600970828879'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("CREATE TABLE `company_register_configs` (`id` int NOT NULL AUTO_INCREMENT, `store_nationality` tinyint NOT NULL DEFAULT 0, `store_address` tinyint NOT NULL DEFAULT 0, `store_phone_number` tinyint NOT NULL DEFAULT 0, `store_birthplace` tinyint NOT NULL DEFAULT 0, `store_birth_date` tinyint NOT NULL DEFAULT 0, `store_mother_name` tinyint NOT NULL DEFAULT 0, `store_company` tinyint NOT NULL DEFAULT 0, `register_guest_card` tinyint NOT NULL DEFAULT 0, `track_actual_exit` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (`id`)) ENGINE=InnoDB")
    await queryRunner.query("CREATE TABLE `guest_cards` (`id` int NOT NULL AUTO_INCREMENT, `identifier_number` varchar(255) NOT NULL, UNIQUE INDEX `IDX_825048cf13c566c094cdb2abb5` (`identifier_number`), PRIMARY KEY (`id`)) ENGINE=InnoDB")
    await queryRunner.query("CREATE TABLE `guests` (`id` int NOT NULL AUTO_INCREMENT, `nationality` varchar(255) NULL, `phone_number` varchar(255) NULL, `birthplace` varchar(255) NULL, `birth_date` varchar(255) NULL, `mother_name` varchar(255) NULL, `image_url` varchar(255) NULL, `identifier_card_type` enum ('identity_card', 'student_card', 'driving_license') NOT NULL, `identifier_card_number` varchar(255) NULL, `signature_image_url` varchar(255) NULL, `participation_status` enum ('invited', 'confirmed', 'canceled', 'participated', 'missed') NOT NULL, `actual_entry` timestamp NULL, `actual_exit` timestamp NULL, `user_id` int NOT NULL, `address_id` int NULL, `receptionist_id` int NULL, `guest_card_id` int NULL, UNIQUE INDEX `REL_3200408b8709b1d26efa9a0979` (`user_id`), UNIQUE INDEX `REL_23176a4bf8976cdcafaff76092` (`receptionist_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB")
    await queryRunner.query("CREATE TABLE `visits` (`id` int NOT NULL AUTO_INCREMENT, `planned_entry` timestamp NOT NULL, `purpose` enum ('meeting', 'interview') NOT NULL, `room` varchar(255) NOT NULL, `expiration` timestamp NULL, `business_host_id` int NULL, UNIQUE INDEX `REL_75c90117f412a007723b8659ac` (`business_host_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB")
    await queryRunner.query("CREATE TABLE `consent_form_versions` (`id` int NOT NULL AUTO_INCREMENT, `content` text NOT NULL, `version_number` int NOT NULL, `consent_form_id` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB")
    await queryRunner.query("CREATE TABLE `consent_forms` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `type` enum ('global', 'local') NOT NULL, `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `active_version_id` int NULL, `office_building_id` int NULL, `company_id` int NULL, UNIQUE INDEX `REL_ba80c0d878ca584dc0e5259b77` (`active_version_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB")
    await queryRunner.query("CREATE TABLE `companies` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `registration_number` varchar(255) NOT NULL, `is_active` tinyint NOT NULL DEFAULT 1, `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deleted_at` timestamp(6) NULL DEFAULT NULL, `address_id` int NULL, `office_building_id` int NULL, `register_config_id` int NOT NULL, `admin_id` int NULL, UNIQUE INDEX `IDX_3dacbb3eb4f095e29372ff8e13` (`name`), UNIQUE INDEX `IDX_21bc5437316daf4448d2db3380` (`registration_number`), UNIQUE INDEX `REL_8997ad7f2d7c7d677903a808ee` (`register_config_id`), UNIQUE INDEX `REL_4b6ba77c89a9ef7461fa133738` (`admin_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB")
    await queryRunner.query("CREATE TABLE `user_permissions` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, UNIQUE INDEX `IDX_aeb53de83cb0f23e59e87e6e8d` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB")
    await queryRunner.query("CREATE TABLE `user_roles` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, UNIQUE INDEX `IDX_4a77d431a6b2ac981c342b13c9` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB")
    await queryRunner.query("CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `first_name` varchar(255) NOT NULL, `last_name` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `is_active` tinyint NOT NULL DEFAULT 1, `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deleted_at` timestamp(6) NULL DEFAULT NULL, `role_id` int NULL, `company_id` int NULL, UNIQUE INDEX `IDX_97672ac88f789774dd47f7c8be` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB")
    await queryRunner.query("CREATE TABLE `office_buildings` (`id` int NOT NULL AUTO_INCREMENT, `is_active` tinyint NOT NULL DEFAULT 1, `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deleted_at` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `address_id` int NULL, `admin_id` int NOT NULL, UNIQUE INDEX `REL_fb68ae56d91d47561add00bba9` (`admin_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB")
    await queryRunner.query("CREATE TABLE `addresses` (`id` int NOT NULL AUTO_INCREMENT, `country` varchar(255) NOT NULL, `zip_code` varchar(255) NOT NULL, `city` varchar(255) NOT NULL, `street_address` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB")
    await queryRunner.query("CREATE TABLE `guest_consent_forms_acceptance` (`guest_id` int NOT NULL, `consent_form_version_id` int NOT NULL, INDEX `IDX_d2f2aa1f61a37918cd44e490f3` (`guest_id`), INDEX `IDX_2497d34ccd60fbaed0bfc98fc0` (`consent_form_version_id`), PRIMARY KEY (`guest_id`, `consent_form_version_id`)) ENGINE=InnoDB")
    await queryRunner.query("CREATE TABLE `visit_participation` (`visit_id` int NOT NULL, `guest_id` int NOT NULL, INDEX `IDX_828ba8934095a36c8d044b505b` (`visit_id`), INDEX `IDX_0f8942cc36f41b3703c691da41` (`guest_id`), PRIMARY KEY (`visit_id`, `guest_id`)) ENGINE=InnoDB")
    await queryRunner.query("CREATE TABLE `visit_consent_forms_log` (`visit_id` int NOT NULL, `consent_form_version_id` int NOT NULL, INDEX `IDX_53a714db5b1e2384322be2440c` (`visit_id`), INDEX `IDX_b4068a365f21a29e523aacff02` (`consent_form_version_id`), PRIMARY KEY (`visit_id`, `consent_form_version_id`)) ENGINE=InnoDB")
    await queryRunner.query("CREATE TABLE `user_role_permissions` (`role_id` int NOT NULL, `permission_id` int NOT NULL, INDEX `IDX_3eb2fe2bf4c1d096d224bfe8e4` (`role_id`), INDEX `IDX_8b96e1d08d00d10f645b8d2f95` (`permission_id`), PRIMARY KEY (`role_id`, `permission_id`)) ENGINE=InnoDB")
    await queryRunner.query("ALTER TABLE `guests` ADD CONSTRAINT `FK_3200408b8709b1d26efa9a09794` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION")
    await queryRunner.query("ALTER TABLE `guests` ADD CONSTRAINT `FK_20fda02470295f2bf4756119283` FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION")
    await queryRunner.query("ALTER TABLE `guests` ADD CONSTRAINT `FK_23176a4bf8976cdcafaff760921` FOREIGN KEY (`receptionist_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION")
    await queryRunner.query("ALTER TABLE `guests` ADD CONSTRAINT `FK_e9da2bf937373866e3c85e6309c` FOREIGN KEY (`guest_card_id`) REFERENCES `guest_cards`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION")
    await queryRunner.query("ALTER TABLE `visits` ADD CONSTRAINT `FK_75c90117f412a007723b8659aca` FOREIGN KEY (`business_host_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION")
    await queryRunner.query("ALTER TABLE `consent_form_versions` ADD CONSTRAINT `FK_9798bc6fe9e0e2368ea6b9b53be` FOREIGN KEY (`consent_form_id`) REFERENCES `consent_forms`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION")
    await queryRunner.query("ALTER TABLE `consent_forms` ADD CONSTRAINT `FK_ba80c0d878ca584dc0e5259b774` FOREIGN KEY (`active_version_id`) REFERENCES `consent_form_versions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION")
    await queryRunner.query("ALTER TABLE `consent_forms` ADD CONSTRAINT `FK_ae2676c442949ee0a8af27203ca` FOREIGN KEY (`office_building_id`) REFERENCES `office_buildings`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION")
    await queryRunner.query("ALTER TABLE `consent_forms` ADD CONSTRAINT `FK_abcd42277a95f5a0c36f7674662` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION")
    await queryRunner.query("ALTER TABLE `companies` ADD CONSTRAINT `FK_ad150e1e829fc0c9013267f3e4c` FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION")
    await queryRunner.query("ALTER TABLE `companies` ADD CONSTRAINT `FK_430acd04f836b02750181094a06` FOREIGN KEY (`office_building_id`) REFERENCES `office_buildings`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION")
    await queryRunner.query("ALTER TABLE `companies` ADD CONSTRAINT `FK_8997ad7f2d7c7d677903a808ee9` FOREIGN KEY (`register_config_id`) REFERENCES `company_register_configs`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION")
    await queryRunner.query("ALTER TABLE `companies` ADD CONSTRAINT `FK_4b6ba77c89a9ef7461fa133738b` FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION")
    await queryRunner.query("ALTER TABLE `users` ADD CONSTRAINT `FK_a2cecd1a3531c0b041e29ba46e1` FOREIGN KEY (`role_id`) REFERENCES `user_roles`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION")
    await queryRunner.query("ALTER TABLE `users` ADD CONSTRAINT `FK_7ae6334059289559722437bcc1c` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION")
    await queryRunner.query("ALTER TABLE `office_buildings` ADD CONSTRAINT `FK_c955e34f17cc3afe78b1cb507ee` FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION")
    await queryRunner.query("ALTER TABLE `office_buildings` ADD CONSTRAINT `FK_fb68ae56d91d47561add00bba9e` FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION")
    await queryRunner.query("ALTER TABLE `guest_consent_forms_acceptance` ADD CONSTRAINT `FK_d2f2aa1f61a37918cd44e490f36` FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION")
    await queryRunner.query("ALTER TABLE `guest_consent_forms_acceptance` ADD CONSTRAINT `FK_2497d34ccd60fbaed0bfc98fc01` FOREIGN KEY (`consent_form_version_id`) REFERENCES `consent_form_versions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION")
    await queryRunner.query("ALTER TABLE `visit_participation` ADD CONSTRAINT `FK_828ba8934095a36c8d044b505b9` FOREIGN KEY (`visit_id`) REFERENCES `visits`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION")
    await queryRunner.query("ALTER TABLE `visit_participation` ADD CONSTRAINT `FK_0f8942cc36f41b3703c691da416` FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION")
    await queryRunner.query("ALTER TABLE `visit_consent_forms_log` ADD CONSTRAINT `FK_53a714db5b1e2384322be2440cd` FOREIGN KEY (`visit_id`) REFERENCES `visits`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION")
    await queryRunner.query("ALTER TABLE `visit_consent_forms_log` ADD CONSTRAINT `FK_b4068a365f21a29e523aacff027` FOREIGN KEY (`consent_form_version_id`) REFERENCES `consent_form_versions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION")
    await queryRunner.query("ALTER TABLE `user_role_permissions` ADD CONSTRAINT `FK_3eb2fe2bf4c1d096d224bfe8e4d` FOREIGN KEY (`role_id`) REFERENCES `user_roles`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION")
    await queryRunner.query("ALTER TABLE `user_role_permissions` ADD CONSTRAINT `FK_8b96e1d08d00d10f645b8d2f952` FOREIGN KEY (`permission_id`) REFERENCES `user_permissions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION")

    // Seed default user role permissions
    const roleRepository = queryRunner.connection.getRepository(UserRole)
    const permissionRepository = queryRunner.connection.getRepository(UserPermission)

    for (const { roleData, rolePermissions } of UserRolePermissionsSeed) {
      const role = await roleRepository.save(roleData)
      const permissions: UserPermission[] = []

      for (const rolePermission of rolePermissions) {
        let permission = await permissionRepository.findOne({ where: { name: rolePermission.name } })
        
        if (!permission) {
          permission = await permissionRepository.save(rolePermission)
        }
        permissions.push(permission)
      }

      role.permissions = permissions
      await roleRepository.save(role)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `user_role_permissions` DROP FOREIGN KEY `FK_8b96e1d08d00d10f645b8d2f952`")
    await queryRunner.query("ALTER TABLE `user_role_permissions` DROP FOREIGN KEY `FK_3eb2fe2bf4c1d096d224bfe8e4d`")
    await queryRunner.query("ALTER TABLE `visit_consent_forms_log` DROP FOREIGN KEY `FK_b4068a365f21a29e523aacff027`")
    await queryRunner.query("ALTER TABLE `visit_consent_forms_log` DROP FOREIGN KEY `FK_53a714db5b1e2384322be2440cd`")
    await queryRunner.query("ALTER TABLE `visit_participation` DROP FOREIGN KEY `FK_0f8942cc36f41b3703c691da416`")
    await queryRunner.query("ALTER TABLE `visit_participation` DROP FOREIGN KEY `FK_828ba8934095a36c8d044b505b9`")
    await queryRunner.query("ALTER TABLE `guest_consent_forms_acceptance` DROP FOREIGN KEY `FK_2497d34ccd60fbaed0bfc98fc01`")
    await queryRunner.query("ALTER TABLE `guest_consent_forms_acceptance` DROP FOREIGN KEY `FK_d2f2aa1f61a37918cd44e490f36`")
    await queryRunner.query("ALTER TABLE `office_buildings` DROP FOREIGN KEY `FK_fb68ae56d91d47561add00bba9e`")
    await queryRunner.query("ALTER TABLE `office_buildings` DROP FOREIGN KEY `FK_c955e34f17cc3afe78b1cb507ee`")
    await queryRunner.query("ALTER TABLE `users` DROP FOREIGN KEY `FK_7ae6334059289559722437bcc1c`")
    await queryRunner.query("ALTER TABLE `users` DROP FOREIGN KEY `FK_a2cecd1a3531c0b041e29ba46e1`")
    await queryRunner.query("ALTER TABLE `companies` DROP FOREIGN KEY `FK_4b6ba77c89a9ef7461fa133738b`")
    await queryRunner.query("ALTER TABLE `companies` DROP FOREIGN KEY `FK_8997ad7f2d7c7d677903a808ee9`")
    await queryRunner.query("ALTER TABLE `companies` DROP FOREIGN KEY `FK_430acd04f836b02750181094a06`")
    await queryRunner.query("ALTER TABLE `companies` DROP FOREIGN KEY `FK_ad150e1e829fc0c9013267f3e4c`")
    await queryRunner.query("ALTER TABLE `consent_forms` DROP FOREIGN KEY `FK_abcd42277a95f5a0c36f7674662`")
    await queryRunner.query("ALTER TABLE `consent_forms` DROP FOREIGN KEY `FK_ae2676c442949ee0a8af27203ca`")
    await queryRunner.query("ALTER TABLE `consent_forms` DROP FOREIGN KEY `FK_ba80c0d878ca584dc0e5259b774`")
    await queryRunner.query("ALTER TABLE `consent_form_versions` DROP FOREIGN KEY `FK_9798bc6fe9e0e2368ea6b9b53be`")
    await queryRunner.query("ALTER TABLE `visits` DROP FOREIGN KEY `FK_75c90117f412a007723b8659aca`")
    await queryRunner.query("ALTER TABLE `guests` DROP FOREIGN KEY `FK_e9da2bf937373866e3c85e6309c`")
    await queryRunner.query("ALTER TABLE `guests` DROP FOREIGN KEY `FK_23176a4bf8976cdcafaff760921`")
    await queryRunner.query("ALTER TABLE `guests` DROP FOREIGN KEY `FK_20fda02470295f2bf4756119283`")
    await queryRunner.query("ALTER TABLE `guests` DROP FOREIGN KEY `FK_3200408b8709b1d26efa9a09794`")
    await queryRunner.query("DROP INDEX `IDX_8b96e1d08d00d10f645b8d2f95` ON `user_role_permissions`")
    await queryRunner.query("DROP INDEX `IDX_3eb2fe2bf4c1d096d224bfe8e4` ON `user_role_permissions`")
    await queryRunner.query("DROP TABLE `user_role_permissions`")
    await queryRunner.query("DROP INDEX `IDX_b4068a365f21a29e523aacff02` ON `visit_consent_forms_log`")
    await queryRunner.query("DROP INDEX `IDX_53a714db5b1e2384322be2440c` ON `visit_consent_forms_log`")
    await queryRunner.query("DROP TABLE `visit_consent_forms_log`")
    await queryRunner.query("DROP INDEX `IDX_0f8942cc36f41b3703c691da41` ON `visit_participation`")
    await queryRunner.query("DROP INDEX `IDX_828ba8934095a36c8d044b505b` ON `visit_participation`")
    await queryRunner.query("DROP TABLE `visit_participation`")
    await queryRunner.query("DROP INDEX `IDX_2497d34ccd60fbaed0bfc98fc0` ON `guest_consent_forms_acceptance`")
    await queryRunner.query("DROP INDEX `IDX_d2f2aa1f61a37918cd44e490f3` ON `guest_consent_forms_acceptance`")
    await queryRunner.query("DROP TABLE `guest_consent_forms_acceptance`")
    await queryRunner.query("DROP TABLE `addresses`")
    await queryRunner.query("DROP INDEX `REL_fb68ae56d91d47561add00bba9` ON `office_buildings`")
    await queryRunner.query("DROP TABLE `office_buildings`")
    await queryRunner.query("DROP INDEX `IDX_97672ac88f789774dd47f7c8be` ON `users`")
    await queryRunner.query("DROP TABLE `users`")
    await queryRunner.query("DROP INDEX `IDX_4a77d431a6b2ac981c342b13c9` ON `user_roles`")
    await queryRunner.query("DROP TABLE `user_roles`")
    await queryRunner.query("DROP INDEX `IDX_aeb53de83cb0f23e59e87e6e8d` ON `user_permissions`")
    await queryRunner.query("DROP TABLE `user_permissions`")
    await queryRunner.query("DROP INDEX `REL_4b6ba77c89a9ef7461fa133738` ON `companies`")
    await queryRunner.query("DROP INDEX `REL_8997ad7f2d7c7d677903a808ee` ON `companies`")
    await queryRunner.query("DROP INDEX `IDX_21bc5437316daf4448d2db3380` ON `companies`")
    await queryRunner.query("DROP INDEX `IDX_3dacbb3eb4f095e29372ff8e13` ON `companies`")
    await queryRunner.query("DROP TABLE `companies`")
    await queryRunner.query("DROP INDEX `REL_ba80c0d878ca584dc0e5259b77` ON `consent_forms`")
    await queryRunner.query("DROP TABLE `consent_forms`")
    await queryRunner.query("DROP TABLE `consent_form_versions`")
    await queryRunner.query("DROP INDEX `REL_75c90117f412a007723b8659ac` ON `visits`")
    await queryRunner.query("DROP TABLE `visits`")
    await queryRunner.query("DROP INDEX `REL_23176a4bf8976cdcafaff76092` ON `guests`")
    await queryRunner.query("DROP INDEX `REL_3200408b8709b1d26efa9a0979` ON `guests`")
    await queryRunner.query("DROP TABLE `guests`")
    await queryRunner.query("DROP INDEX `IDX_825048cf13c566c094cdb2abb5` ON `guest_cards`")
    await queryRunner.query("DROP TABLE `guest_cards`")
    await queryRunner.query("DROP TABLE `company_register_configs`")
  }
}
