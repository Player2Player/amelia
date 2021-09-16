ALTER TABLE wp_amelia_coupons
ADD COLUMN `autoApply` tinyint(1) NOT NULL DEFAULT 0,
ADD COLUMN `description` VARCHAR(255),
ADD COLUMN `appointmentsFree` INT(11) NOT NULL DEFAULT 0,
ADD COLUMN `appointmentsMin` INT(11) NOT NULL DEFAULT 0,
ADD COLUMN `appointmentsMax` INT(11) NOT NULL DEFAULT 0,
ADD COLUMN `validFrom` datetime,
ADD COLUMN `validTo` datetime,
ADD COLUMN `noLimit` tinyint(1) NOT NULL DEFAULT 0;