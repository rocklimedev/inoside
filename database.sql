-- --------------------------------------------------------
-- Host:                         116.206.104.225
-- Server version:               5.7.23-23 - Percona Server (GPL), Release 23, Revision 500fcf5
-- Server OS:                    Linux
-- HeidiSQL Version:             12.17.0.7270
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table spsyn8lm_construction_db.activity_logs
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `activityLogId` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contextTag` enum('AUTH','USER','PROJECT','INVENTORY','BOQ','VENDOR','CLIENT','SITE','TASK','DRAWING','COST_ESTIMATE','CDN','RBAC') COLLATE utf8mb4_unicode_ci NOT NULL,
  `subContext` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` enum('CREATE','UPDATE','DELETE','VIEW','LOGIN','LOGOUT','ASSIGN','APPROVE','REJECT','DOWNLOAD','UPLOAD') COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `referenceId` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referenceType` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `ipAddress` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userAgent` text COLLATE utf8mb4_unicode_ci,
  `isSystemGenerated` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `severity` enum('INFO','WARNING','ERROR','CRITICAL') COLLATE utf8mb4_unicode_ci DEFAULT 'INFO',
  `moduleName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oldValues` json DEFAULT NULL,
  `newValues` json DEFAULT NULL,
  PRIMARY KEY (`activityLogId`),
  KEY `idx_activity_user` (`userId`),
  KEY `idx_activity_context` (`contextTag`),
  KEY `idx_activity_action` (`action`),
  KEY `idx_activity_reference` (`referenceId`),
  KEY `idx_activity_created` (`createdAt`),
  KEY `idx_activity_context_action` (`contextTag`,`action`),
  KEY `idx_activity_user_created` (`userId`,`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.addresses
CREATE TABLE IF NOT EXISTS `addresses` (
  `id` char(36) NOT NULL,
  `line1` varchar(255) NOT NULL,
  `line2` varchar(255) DEFAULT NULL,
  `landmark` varchar(255) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT 'India',
  `pincode` varchar(20) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `google_map_link` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.boq_categories
CREATE TABLE IF NOT EXISTS `boq_categories` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(100) DEFAULT NULL,
  `description` text,
  `sort_order` int(11) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_boq_category_code` (`code`) USING BTREE,
  KEY `idx_boq_categories_name` (`name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.boq_items
CREATE TABLE IF NOT EXISTS `boq_items` (
  `id` char(36) NOT NULL,
  `boq_id` char(36) NOT NULL,
  `section_id` char(36) NOT NULL,
  `subheading_id` char(36) DEFAULT NULL,
  `inventory_master_id` char(36) DEFAULT NULL,
  `unit_id` char(36) DEFAULT NULL,
  `sno` varchar(50) DEFAULT NULL,
  `item_code` varchar(100) DEFAULT NULL,
  `item_name` text NOT NULL,
  `description` text,
  `specification` text,
  `brand` varchar(255) DEFAULT NULL,
  `qty` decimal(14,3) DEFAULT '0.000',
  `rate` decimal(14,2) DEFAULT '0.00',
  `wastage_percent` decimal(5,2) DEFAULT '0.00',
  `discount_percent` decimal(5,2) DEFAULT '0.00',
  `tax_percent` decimal(5,2) DEFAULT '0.00',
  `base_amount` decimal(16,2) GENERATED ALWAYS AS ((`qty` * `rate`)) STORED,
  `tax_amount` decimal(16,2) GENERATED ALWAYS AS ((((`qty` * `rate`) * `tax_percent`) / 100)) STORED,
  `final_amount` decimal(16,2) GENERATED ALWAYS AS (((`qty` * `rate`) + (((`qty` * `rate`) * `tax_percent`) / 100))) STORED,
  `remarks` text,
  `sort_order` int(11) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_boq_items_boq` (`boq_id`),
  KEY `fk_boq_items_section` (`section_id`),
  KEY `fk_boq_items_unit` (`unit_id`),
  KEY `idx_boq_items_subheading` (`subheading_id`) USING BTREE,
  KEY `idx_boq_items_inventory` (`inventory_master_id`) USING BTREE,
  CONSTRAINT `fk_boq_items_boq` FOREIGN KEY (`boq_id`) REFERENCES `boqs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_boq_items_inventory_master` FOREIGN KEY (`inventory_master_id`) REFERENCES `inventory_master` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_boq_items_section` FOREIGN KEY (`section_id`) REFERENCES `boq_sections` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_boq_items_subheading` FOREIGN KEY (`subheading_id`) REFERENCES `boq_subheadings` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_boq_items_unit` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.boq_sections
CREATE TABLE IF NOT EXISTS `boq_sections` (
  `id` char(36) NOT NULL,
  `boq_id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `sort_order` int(11) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_boq_sections_boq` (`boq_id`),
  CONSTRAINT `fk_boq_sections_boq` FOREIGN KEY (`boq_id`) REFERENCES `boqs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.boq_subheadings
CREATE TABLE IF NOT EXISTS `boq_subheadings` (
  `id` char(36) NOT NULL,
  `boq_id` char(36) NOT NULL,
  `section_id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `sort_order` int(11) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_boq_subheadings_boq` (`boq_id`),
  KEY `idx_boq_subheadings_section` (`section_id`),
  CONSTRAINT `fk_boq_subheadings_boq` FOREIGN KEY (`boq_id`) REFERENCES `boqs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_boq_subheadings_section` FOREIGN KEY (`section_id`) REFERENCES `boq_sections` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.boqs
CREATE TABLE IF NOT EXISTS `boqs` (
  `id` char(36) NOT NULL,
  `project_id` char(36) DEFAULT NULL,
  `client_id` char(36) DEFAULT NULL,
  `boq_category_id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `code` varchar(100) DEFAULT NULL,
  `revision_no` varchar(50) DEFAULT 'Rev-01',
  `status` enum('draft','submitted','approved','rejected','revised') DEFAULT 'draft',
  `notes` text,
  `subtotal` decimal(16,2) DEFAULT '0.00',
  `tax_amount` decimal(16,2) DEFAULT '0.00',
  `grand_total` decimal(16,2) DEFAULT '0.00',
  `prepared_by` char(36) DEFAULT NULL,
  `approved_by` char(36) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_boqs_project` (`project_id`),
  KEY `fk_boq_category` (`boq_category_id`),
  KEY `fk_boq_prepared_by` (`prepared_by`),
  KEY `fk_boq_approved_by` (`approved_by`),
  KEY `fk_boq_client` (`client_id`) USING BTREE,
  CONSTRAINT `fk_boq_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_boq_category` FOREIGN KEY (`boq_category_id`) REFERENCES `boq_categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_boq_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_boq_prepared_by` FOREIGN KEY (`prepared_by`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_boq_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.brands
CREATE TABLE IF NOT EXISTS `brands` (
  `id` char(36) NOT NULL,
  `name` varchar(150) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_brands_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.cdn_files
CREATE TABLE IF NOT EXISTS `cdn_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `original_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `filename` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` int(11) NOT NULL,
  `mime_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.clients
CREATE TABLE IF NOT EXISTS `clients` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `contact_number` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `preferred_communication` enum('Call','WhatsApp','Email') DEFAULT NULL,
  `is_owner` tinyint(1) DEFAULT '1',
  `representative_involved` tinyint(1) DEFAULT '0',
  `representative_comment` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.comments
CREATE TABLE IF NOT EXISTS `comments` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `entity_type` varchar(50) NOT NULL,
  `entity_id` char(36) NOT NULL,
  `parent_comment_id` char(36) DEFAULT NULL,
  `comment` text NOT NULL,
  `created_by_user_id` char(36) NOT NULL,
  `is_internal` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_project` (`project_id`),
  KEY `idx_user` (`created_by_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.daily_progress_reports
CREATE TABLE IF NOT EXISTS `daily_progress_reports` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `report_date` date NOT NULL,
  `supervisor_id` char(36) DEFAULT NULL,
  `current_stage` varchar(100) DEFAULT NULL,
  `work_executed` text,
  `manpower_count` int(11) DEFAULT NULL,
  `materials_used` text,
  `issues_faced` text,
  `progress_photos` json DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `supervisor_id` (`supervisor_id`),
  CONSTRAINT `daily_progress_reports_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `daily_progress_reports_ibfk_2` FOREIGN KEY (`supervisor_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.drawing_approval_logs
CREATE TABLE IF NOT EXISTS `drawing_approval_logs` (
  `id` char(36) NOT NULL,
  `drawing_id` char(36) NOT NULL,
  `client_id` char(36) DEFAULT NULL,
  `approved_by` char(36) DEFAULT NULL,
  `action` enum('approved','rejected','revision_requested','commented') NOT NULL DEFAULT 'commented',
  `approved` tinyint(1) NOT NULL DEFAULT '0',
  `remarks` text,
  `internal_note` text,
  `attachment_url` varchar(500) DEFAULT NULL,
  `drawing_version` int(11) DEFAULT NULL,
  `revision_requested` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `drawing_id` (`drawing_id`),
  KEY `client_id` (`client_id`),
  KEY `idx_drawing_approval_logs_action` (`action`) USING BTREE,
  KEY `idx_drawing_approval_logs_approved_by` (`approved_by`) USING BTREE,
  KEY `idx_drawing_approval_logs_created_at` (`created_at`) USING BTREE,
  CONSTRAINT `drawing_approval_logs_ibfk_1` FOREIGN KEY (`drawing_id`) REFERENCES `project_drawings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `drawing_approval_logs_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`),
  CONSTRAINT `drawing_approval_logs_ibfk_3` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.execution_activities
CREATE TABLE IF NOT EXISTS `execution_activities` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `stage_id` char(36) DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT '1',
  `title` varchar(255) NOT NULL,
  `description` text,
  `activity_date` date NOT NULL,
  `planned_start_date` date DEFAULT NULL,
  `planned_end_date` date DEFAULT NULL,
  `planned_quantity` decimal(12,2) DEFAULT NULL,
  `completed_quantity` decimal(12,2) DEFAULT NULL,
  `progress_percentage` decimal(5,2) NOT NULL DEFAULT '0.00',
  `unit` varchar(50) DEFAULT NULL,
  `status` enum('pending','ongoing','completed','delayed') DEFAULT 'pending',
  `created_by` char(36) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_execution_activities_project` (`project_id`),
  KEY `idx_execution_activities_stage` (`stage_id`),
  KEY `idx_execution_activities_date` (`activity_date`),
  KEY `fk_execution_activity_user` (`created_by`),
  KEY `idx_execution_activities_order` (`stage_id`,`order`),
  CONSTRAINT `fk_execution_activity_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_execution_activity_stage` FOREIGN KEY (`stage_id`) REFERENCES `execution_stages` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_execution_activity_user` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.execution_stages
CREATE TABLE IF NOT EXISTS `execution_stages` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `order` int(11) NOT NULL DEFAULT '1',
  `name` varchar(255) NOT NULL,
  `description` text,
  `planned_start_date` date DEFAULT NULL,
  `planned_end_date` date DEFAULT NULL,
  `actual_start_date` date DEFAULT NULL,
  `actual_end_date` date DEFAULT NULL,
  `progress_percentage` decimal(5,2) DEFAULT '0.00',
  `status` enum('pending','in_progress','completed','blocked') DEFAULT 'pending',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_execution_stages_project` (`project_id`),
  KEY `idx_execution_stages_status` (`status`),
  KEY `idx_execution_stages_order` (`project_id`,`order`),
  CONSTRAINT `fk_execution_stage_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.handovers
CREATE TABLE IF NOT EXISTS `handovers` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `handover_date` datetime DEFAULT NULL,
  `planned_vs_actual_timeline` text,
  `completion_confirmation` tinyint(1) DEFAULT '1',
  `outstanding_items` text,
  `warranty_notes` text,
  `sign_off_client` tinyint(1) DEFAULT '0',
  `sign_off_firm` tinyint(1) DEFAULT '0',
  `handover_pdf_url` varchar(500) DEFAULT NULL,
  `full_drawings_set_url` varchar(500) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_id` (`project_id`),
  CONSTRAINT `handovers_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.inventory_categories
CREATE TABLE IF NOT EXISTS `inventory_categories` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int(11) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_category_name` (`name`),
  KEY `idx_category_parent` (`parent_id`),
  CONSTRAINT `fk_category_parent` FOREIGN KEY (`parent_id`) REFERENCES `inventory_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.inventory_dispatches
CREATE TABLE IF NOT EXISTS `inventory_dispatches` (
  `id` char(36) NOT NULL,
  `request_id` char(36) NOT NULL,
  `dispatch_date` datetime DEFAULT NULL,
  `dispatch_quantity` decimal(12,3) NOT NULL,
  `vehicle_challan` varchar(100) DEFAULT NULL,
  `driver_name` varchar(100) DEFAULT NULL,
  `received_quantity` decimal(12,2) DEFAULT NULL,
  `damage_shortage` tinyint(1) DEFAULT '0',
  `shortage_quantity` decimal(12,3) DEFAULT NULL,
  `supervisor_confirmation` tinyint(1) DEFAULT '0',
  `delivery_photo_url` varchar(500) DEFAULT NULL,
  `remarks` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_dispatch_request` (`request_id`),
  CONSTRAINT `inventory_dispatches_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `inventory_requests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.inventory_master
CREATE TABLE IF NOT EXISTS `inventory_master` (
  `id` char(36) NOT NULL,
  `item_code` varchar(100) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `category_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text,
  `unit_id` char(36) DEFAULT NULL,
  `default_rate` decimal(14,2) DEFAULT '0.00',
  `gst_percent` decimal(5,2) DEFAULT '18.00',
  `hsn_code` varchar(20) DEFAULT NULL,
  `min_stock_level` decimal(12,3) DEFAULT '0.000',
  `specification` text,
  `is_active` tinyint(1) DEFAULT '1',
  `is_serialized` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `brand_id` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uk_inventory_item_code` (`item_code`) USING BTREE,
  KEY `idx_inventory_item_name` (`item_name`) USING BTREE,
  KEY `fk_inventory_unit` (`unit_id`) USING BTREE,
  KEY `idx_inventory_brand_id` (`brand_id`),
  KEY `idx_master_category` (`category_id`),
  CONSTRAINT `fk_inventory_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_inventory_unit` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_master_category` FOREIGN KEY (`category_id`) REFERENCES `inventory_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.inventory_requests
CREATE TABLE IF NOT EXISTS `inventory_requests` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `project_material_id` char(36) NOT NULL,
  `quantity_required` decimal(12,2) DEFAULT NULL,
  `required_date` date DEFAULT NULL,
  `vendor_id` char(36) DEFAULT NULL,
  `source_type` enum('Vendor','Warehouse','Site Stock') DEFAULT 'Vendor',
  `status` enum('requested','approved','dispatched','delivered','rejected','cancelled') DEFAULT 'requested',
  `remarks` text,
  `requested_by` char(36) DEFAULT NULL,
  `approved_by` char(36) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `requested_by` (`requested_by`),
  KEY `approved_by` (`approved_by`),
  KEY `idx_inventory_project` (`project_id`),
  KEY `idx_req_project` (`project_id`),
  KEY `idx_req_project_material` (`project_material_id`),
  KEY `idx_req_vendor` (`vendor_id`),
  KEY `idx_req_status` (`status`),
  CONSTRAINT `fk_req_project_material` FOREIGN KEY (`project_material_id`) REFERENCES `project_materials` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_req_vendor` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`) ON DELETE SET NULL,
  CONSTRAINT `inventory_requests_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `inventory_requests_ibfk_4` FOREIGN KEY (`requested_by`) REFERENCES `users` (`id`),
  CONSTRAINT `inventory_requests_ibfk_5` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.issue_logs
CREATE TABLE IF NOT EXISTS `issue_logs` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `issue_description` text,
  `responsible_party` varchar(100) DEFAULT NULL,
  `target_resolution_date` date DEFAULT NULL,
  `status` enum('Open','Closed') DEFAULT 'Open',
  `before_photo_url` varchar(500) DEFAULT NULL,
  `after_photo_url` varchar(500) DEFAULT NULL,
  `reported_by` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `reported_by` (`reported_by`),
  CONSTRAINT `issue_logs_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `issue_logs_ibfk_2` FOREIGN KEY (`reported_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.materials
CREATE TABLE IF NOT EXISTS `materials` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.permissions
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `module` varchar(50) NOT NULL,
  `action` varchar(50) NOT NULL,
  `description` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.pitch_comments
CREATE TABLE IF NOT EXISTS `pitch_comments` (
  `id` char(36) NOT NULL,
  `pitch_id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `content` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `pitch_comments_pitch_id_index` (`pitch_id`) USING BTREE,
  KEY `pitch_comments_user_id_index` (`user_id`) USING BTREE,
  CONSTRAINT `pitch_comments_pitch_fk` FOREIGN KEY (`pitch_id`) REFERENCES `project_pitch` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pitch_comments_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.pitch_references
CREATE TABLE IF NOT EXISTS `pitch_references` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `reference_type` enum('image','link','portfolio') DEFAULT NULL,
  `url` text,
  `description` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `pitch_references_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.project_brief
CREATE TABLE IF NOT EXISTS `project_brief` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `rooms_spaces_required` json DEFAULT NULL,
  `parking_required` tinyint(1) DEFAULT NULL,
  `first_construction_project` tinyint(1) DEFAULT NULL,
  `decision_readiness` varchar(50) DEFAULT NULL,
  `end_to_end_services` tinyint(1) DEFAULT NULL,
  `output_client_profile` json DEFAULT NULL,
  `output_project_profile` json DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Pending',
  `is_approved` tinyint(1) NOT NULL DEFAULT '0',
  `approved_by` char(36) DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `changes_note` text,
  `changes_requested_by` char(36) DEFAULT NULL,
  `changes_requested_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_id` (`project_id`),
  KEY `project_brief_ibfk_2` (`approved_by`),
  KEY `project_brief_ibfk_3` (`changes_requested_by`),
  CONSTRAINT `project_brief_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_brief_ibfk_2` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `project_brief_ibfk_3` FOREIGN KEY (`changes_requested_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.project_cost_estimates
CREATE TABLE IF NOT EXISTS `project_cost_estimates` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `estimate_type` enum('Consultation','Turnkey','Constructional') DEFAULT NULL,
  `consultation_fee` decimal(12,2) DEFAULT NULL,
  `tentative_total_cost` decimal(15,2) DEFAULT NULL,
  `material_labour_estimate` json DEFAULT NULL,
  `payment_plan` json DEFAULT NULL,
  `annexure_url` varchar(500) DEFAULT NULL,
  `contract_url` varchar(500) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `project_cost_estimates_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.project_documents
CREATE TABLE IF NOT EXISTS `project_documents` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `module_name` varchar(50) DEFAULT NULL,
  `document_type` varchar(100) DEFAULT NULL,
  `file_url` varchar(500) NOT NULL,
  `version` int(11) DEFAULT '1',
  `uploaded_by` char(36) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `uploaded_by` (`uploaded_by`),
  CONSTRAINT `project_documents_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_documents_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.project_drawings
CREATE TABLE IF NOT EXISTS `project_drawings` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `drawing_type` enum('Design','Execution','Technical','Construction','Working') DEFAULT NULL,
  `version` int(11) DEFAULT '1',
  `area_floor` varchar(100) DEFAULT NULL,
  `file_url` varchar(500) NOT NULL,
  `uploaded_by` char(36) DEFAULT NULL,
  `uploaded_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `approved` tinyint(1) DEFAULT '0',
  `approval_date` datetime DEFAULT NULL,
  `approved_by` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `uploaded_by` (`uploaded_by`),
  KEY `approved_by` (`approved_by`),
  KEY `idx_drawings_project` (`project_id`),
  CONSTRAINT `project_drawings_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_drawings_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`),
  CONSTRAINT `project_drawings_ibfk_3` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.project_materials
CREATE TABLE IF NOT EXISTS `project_materials` (
  `id` char(36) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `project_id` char(36) NOT NULL,
  `inventory_master_id` char(36) DEFAULT NULL,
  `item_code` varchar(100) DEFAULT NULL,
  `description` text,
  `specification` text,
  `unit_id` char(36) DEFAULT NULL,
  `brand_id` char(36) DEFAULT NULL,
  `quantity_estimated` decimal(14,3) DEFAULT '0.000',
  `quantity_required` decimal(14,3) DEFAULT '0.000',
  `quantity_received` decimal(14,3) DEFAULT '0.000',
  `quantity_used` decimal(14,3) DEFAULT '0.000',
  `rate` decimal(14,2) DEFAULT NULL,
  `gst_percent` decimal(5,2) DEFAULT '18.00',
  `status` enum('planned','ordered','received','in_use','closed') DEFAULT 'planned',
  `remarks` text,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_pm_unit` (`unit_id`),
  KEY `fk_pm_brand` (`brand_id`),
  KEY `idx_pm_project` (`project_id`),
  KEY `idx_pm_master` (`inventory_master_id`),
  KEY `idx_pm_status` (`status`),
  CONSTRAINT `fk_pm_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_pm_master` FOREIGN KEY (`inventory_master_id`) REFERENCES `inventory_master` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_pm_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pm_unit` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.project_pitch
CREATE TABLE IF NOT EXISTS `project_pitch` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `created_by` char(36) DEFAULT NULL,
  `preferred_design_style` varchar(100) DEFAULT NULL,
  `color_tone` enum('Light','Dark','Mixed','Not Sure') DEFAULT NULL,
  `luxury_level` enum('Low','Medium','High') DEFAULT NULL,
  `functional_vs_aesthetic` text,
  `budget_flexibility` tinyint(1) DEFAULT NULL,
  `priority_areas` json DEFAULT NULL,
  `likes_dislikes` text,
  `non_negotiables` text,
  `special_requirements` text,
  `moodboard_pdf_url` varchar(500) DEFAULT NULL,
  `pitch_pdf_url` varchar(500) DEFAULT NULL,
  `status` enum('Draft','Pending Review','Approved','Rejected') NOT NULL DEFAULT 'Draft',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_id` (`project_id`),
  KEY `project_pitch_created_by_fk` (`created_by`),
  CONSTRAINT `project_pitch_created_by_fk` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `project_pitch_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.project_vendors
CREATE TABLE IF NOT EXISTS `project_vendors` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `vendor_id` char(36) DEFAULT NULL,
  `selected` tinyint(1) DEFAULT '0',
  `selection_reason` text,
  `approved_estimate_value` decimal(15,2) DEFAULT NULL,
  `scope_summary` text,
  `final_estimate_url` varchar(500) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `vendor_id` (`vendor_id`),
  CONSTRAINT `project_vendors_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_vendors_ibfk_2` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.projects
CREATE TABLE IF NOT EXISTS `projects` (
  `id` char(36) NOT NULL,
  `client_id` char(36) NOT NULL,
  `site_id` char(36) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `project_type` enum('New Construction','Renovation','Interior Fit-out') NOT NULL,
  `service_type` enum('Construction','Interior','Renovation') DEFAULT NULL,
  `purpose` enum('Residential','Commercial','Mixed') DEFAULT NULL,
  `number_of_floors` int(11) DEFAULT NULL,
  `approximate_area_sqft` decimal(12,2) DEFAULT NULL,
  `budget_range` varchar(100) DEFAULT NULL,
  `timeline_expectation` enum('Immediate','Flexible','Fixed Date') DEFAULT NULL,
  `design_preference` varchar(50) DEFAULT NULL,
  `status` enum('brief','pitch','reki_pending','reki_done','scope_done','boq_done','design','execution','vendor_selection','inventory','quality','handover','completed','cancelled','on_hold') DEFAULT 'brief',
  `current_stage` varchar(50) DEFAULT NULL,
  `progress_percentage` decimal(5,2) DEFAULT '0.00',
  `token_received` tinyint(1) DEFAULT '0',
  `is_archived` tinyint(1) NOT NULL DEFAULT '0',
  `is_completed` tinyint(1) NOT NULL DEFAULT '0',
  `estimated_start_date` date DEFAULT NULL,
  `estimated_end_date` date DEFAULT NULL,
  `actual_start_date` date DEFAULT NULL,
  `actual_end_date` date DEFAULT NULL,
  `estimated_budget` decimal(15,2) DEFAULT NULL,
  `final_budget` decimal(15,2) DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `assigned_to` char(36) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `site_id` (`site_id`),
  KEY `idx_projects_client` (`client_id`),
  KEY `idx_projects_status` (`status`),
  KEY `idx_projects_created_by` (`created_by`),
  KEY `idx_projects_assigned_to` (`assigned_to`) USING BTREE,
  KEY `idx_projects_archived` (`is_archived`) USING BTREE,
  KEY `idx_projects_completed` (`is_completed`) USING BTREE,
  CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`site_id`) REFERENCES `sites` (`id`) ON DELETE SET NULL,
  CONSTRAINT `projects_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `projects_ibfk_assigned_to` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.quality_checks
CREATE TABLE IF NOT EXISTS `quality_checks` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `stage_name` varchar(100) DEFAULT NULL,
  `quality_met` tinyint(1) DEFAULT NULL,
  `deviations` tinyint(1) DEFAULT NULL,
  `corrective_action_required` tinyint(1) DEFAULT NULL,
  `supervisor_remarks` text,
  `checked_date` date DEFAULT NULL,
  `checked_by` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `checked_by` (`checked_by`),
  CONSTRAINT `quality_checks_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `quality_checks_ibfk_2` FOREIGN KEY (`checked_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.reki_photos
CREATE TABLE IF NOT EXISTS `reki_photos` (
  `id` char(36) NOT NULL,
  `reki_report_id` char(36) NOT NULL,
  `photo_type` varchar(50) DEFAULT NULL,
  `photo_url` varchar(500) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `reki_report_id` (`reki_report_id`),
  CONSTRAINT `reki_photos_ibfk_1` FOREIGN KEY (`reki_report_id`) REFERENCES `reki_reports` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.reki_reports
CREATE TABLE IF NOT EXISTS `reki_reports` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `supervisor_id` char(36) DEFAULT NULL,
  `visit_date` date NOT NULL,
  `client_present` tinyint(1) DEFAULT NULL,
  `road_access` tinyint(1) DEFAULT NULL,
  `unloading_space` tinyint(1) DEFAULT NULL,
  `area_type` varchar(30) DEFAULT NULL,
  `neighbouring_buildings` tinyint(1) DEFAULT NULL,
  `working_time_restrictions` text,
  `plot_type` varchar(50) DEFAULT NULL,
  `existing_structure` tinyint(1) DEFAULT NULL,
  `construction_type` varchar(50) DEFAULT NULL,
  `existing_floors` int(11) DEFAULT NULL,
  `structural_cracks` tinyint(1) DEFAULT NULL,
  `built_up_area` decimal(12,2) DEFAULT NULL,
  `floor_to_floor_height` decimal(6,2) DEFAULT NULL,
  `slab_thickness` decimal(6,2) DEFAULT NULL,
  `columns_beams_visible` tinyint(1) DEFAULT NULL,
  `wall_condition` varchar(20) DEFAULT NULL,
  `floor_condition` varchar(20) DEFAULT NULL,
  `dampness` tinyint(1) DEFAULT NULL,
  `dampness_location` text,
  `termite_damage` tinyint(1) DEFAULT NULL,
  `electrical_wiring` tinyint(1) DEFAULT NULL,
  `electrical_panel_location` text,
  `plumbing_lines` tinyint(1) DEFAULT NULL,
  `water_inlet_outlet` text,
  `tanks_present` tinyint(1) DEFAULT NULL,
  `demolition_required` tinyint(1) DEFAULT NULL,
  `demolition_type` varchar(20) DEFAULT NULL,
  `safety_concerns` tinyint(1) DEFAULT NULL,
  `load_bearing_changes` varchar(20) DEFAULT NULL,
  `beam_cutting` tinyint(1) DEFAULT NULL,
  `core_drilling` tinyint(1) DEFAULT NULL,
  `structural_consultant_required` tinyint(1) DEFAULT NULL,
  `power_supply` tinyint(1) DEFAULT NULL,
  `water_supply` tinyint(1) DEFAULT NULL,
  `drainage_available` tinyint(1) DEFAULT NULL,
  `fire_safety_norms` tinyint(1) DEFAULT NULL,
  `major_constraints` text,
  `risk_factors` text,
  `suggestions` text,
  `client_instructions` text,
  `reki_pdf_url` varchar(500) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_id` (`project_id`),
  KEY `supervisor_id` (`supervisor_id`),
  KEY `idx_reki_project` (`project_id`),
  CONSTRAINT `reki_reports_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reki_reports_ibfk_2` FOREIGN KEY (`supervisor_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.role_permissions
CREATE TABLE IF NOT EXISTS `role_permissions` (
  `id` char(36) NOT NULL,
  `role_id` char(36) NOT NULL,
  `permission_id` char(36) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_role_permission` (`role_id`,`permission_id`),
  KEY `permission_id` (`permission_id`),
  CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` char(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `display_name` varchar(100) NOT NULL,
  `description` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.scope_of_work
CREATE TABLE IF NOT EXISTS `scope_of_work` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `scope_summary` text,
  `civil_works` json DEFAULT NULL,
  `mep_works` json DEFAULT NULL,
  `interior_works` json DEFAULT NULL,
  `finishes` json DEFAULT NULL,
  `area_summary` json DEFAULT NULL,
  `scope_pdf_url` varchar(500) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_id` (`project_id`),
  CONSTRAINT `scope_of_work_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.sites
CREATE TABLE IF NOT EXISTS `sites` (
  `id` char(36) NOT NULL,
  `client_id` char(36) NOT NULL,
  `address_id` char(36) NOT NULL,
  `ownership_status` enum('Owned','Rented','Under Process') DEFAULT NULL,
  `access_available` tinyint(1) DEFAULT '1',
  `existing_structure` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_sites_address` (`address_id`),
  KEY `idx_sites_client` (`client_id`),
  CONSTRAINT `sites_ibfk_1` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`),
  CONSTRAINT `sites_ibfk_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.team_tasks
CREATE TABLE IF NOT EXISTS `team_tasks` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `created_by_user_id` char(36) NOT NULL,
  `assigned_to_user_id` char(36) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `module` varchar(255) DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
  `task_type` enum('General','Design upload','Revision response','Site visit','Vendor follow-up','Inventory dispatch','Quality check','Client response','Internal documentation') NOT NULL DEFAULT 'General',
  `status` enum('todo','in_progress','review','completed','blocked') NOT NULL DEFAULT 'todo',
  `description` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_team_tasks_project_id` (`project_id`),
  KEY `idx_team_tasks_created_by_user_id` (`created_by_user_id`),
  KEY `idx_team_tasks_assigned_to_user_id` (`assigned_to_user_id`),
  CONSTRAINT `fk_team_tasks_assigned_user` FOREIGN KEY (`assigned_to_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_team_tasks_created_by_user` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_team_tasks_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.units
CREATE TABLE IF NOT EXISTS `units` (
  `id` char(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `short_name` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `short_name` (`short_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` char(36) NOT NULL,
  `role_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `avatar_url` varchar(500) DEFAULT NULL,
  `avatar_thumbnail` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `last_login` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_email_verified` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.vendor_type_vendor
CREATE TABLE IF NOT EXISTS `vendor_type_vendor` (
  `vendor_id` char(36) NOT NULL,
  `type_id` char(36) NOT NULL,
  PRIMARY KEY (`vendor_id`,`type_id`),
  KEY `fk_vendor_type_vendor_type` (`type_id`),
  CONSTRAINT `fk_vendor_type_vendor_type` FOREIGN KEY (`type_id`) REFERENCES `vendor_types` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_vendor_type_vendor_vendor` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.vendor_types
CREATE TABLE IF NOT EXISTS `vendor_types` (
  `id` char(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_vendor_type_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.vendors
CREATE TABLE IF NOT EXISTS `vendors` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `mobile_number` varchar(20) NOT NULL,
  `brand_company_id` char(36) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `position` varchar(150) DEFAULT NULL,
  `type_of_business` varchar(150) DEFAULT NULL,
  `optional_mobile` varchar(20) DEFAULT NULL,
  `notes` text,
  `area_covered` varchar(255) DEFAULT NULL,
  `is_architect` tinyint(1) DEFAULT '0',
  `is_interior` tinyint(1) DEFAULT '0',
  `is_furniture` tinyint(1) DEFAULT '0',
  `age` int(11) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `reference_name` varchar(255) DEFAULT NULL,
  `reference_mobile` varchar(20) DEFAULT NULL,
  `address` json DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `trade_type` varchar(100) DEFAULT NULL,
  `contact_details` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
