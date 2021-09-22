CREATE TABLE `wp_amelia_coupons_to_locations` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `couponId` int(11) NOT NULL,
    `locationId` int(11) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8 COLLATE utf8_general_ci