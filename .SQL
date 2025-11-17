CREATE TABLE `persons` (
	`id` CHAR(36) NOT NULL COLLATE 'utf8_bin',
	`name` VARCHAR(255) NOT NULL COLLATE 'utf8_unicode_ci',
	`mobile_number` VARCHAR(20) NOT NULL COLLATE 'utf8_unicode_ci',
	`brand_company_id` CHAR(36) NOT NULL COLLATE 'utf8_bin',
	`type_id` CHAR(36) NOT NULL COLLATE 'utf8_bin',
	`company_name` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_unicode_ci',
	`position` VARCHAR(150) NULL DEFAULT NULL COLLATE 'utf8_unicode_ci',
	`type_of_business` VARCHAR(150) NULL DEFAULT NULL COLLATE 'utf8_unicode_ci',
	`optional_mobile` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8_unicode_ci',
	`notes` TEXT NULL DEFAULT NULL COLLATE 'utf8_unicode_ci',
	`area_covered` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_unicode_ci',
	`is_architect` TINYINT(1) NULL DEFAULT '0',
	`is_interior` TINYINT(1) NULL DEFAULT '0',
	`is_furniture` TINYINT(1) NULL DEFAULT '0',
	`age` INT(11) NULL DEFAULT NULL,
	`dob` DATE NULL DEFAULT NULL,
	`reference_name` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_unicode_ci',
	`reference_mobile` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8_unicode_ci',
	`address` JSON NULL DEFAULT NULL,
	`is_active` TINYINT(1) NULL DEFAULT '1',
	`created_by` CHAR(36) NULL DEFAULT NULL COLLATE 'utf8_bin',
	`updated_by` CHAR(36) NULL DEFAULT NULL COLLATE 'utf8_bin',
	`created_at` DATETIME NOT NULL,
	`updated_at` DATETIME NOT NULL,
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `brand_company_id` (`brand_company_id`) USING BTREE,
	INDEX `type_id` (`type_id`) USING BTREE,
	CONSTRAINT `persons_ibfk_1` FOREIGN KEY (`brand_company_id`) REFERENCES `brand_companies` (`id`) ON UPDATE CASCADE ON DELETE NO ACTION,
	CONSTRAINT `persons_ibfk_2` FOREIGN KEY (`type_id`) REFERENCES `person_types` (`id`) ON UPDATE CASCADE ON DELETE NO ACTION
)
COLLATE='utf8_unicode_ci'
ENGINE=InnoDB
;
