<?php

namespace AmeliaBooking\Infrastructure\WP\InstallActions\DB\Notification;

use AmeliaBooking\Domain\Common\Exceptions\InvalidArgumentException;
use AmeliaBooking\Infrastructure\WP\InstallActions\DB\AbstractDatabaseTable;

/**
 * Class NotificationsAdminTable
 *
 * @package AmeliaBooking\Infrastructure\WP\InstallActions\DB\Notification
 */
class NotificationsAdminTable extends AbstractDatabaseTable
{

    const TABLE = 'notifications_admin';

    /**
     * @return string
     * @throws InvalidArgumentException
     */
    public static function buildTable()
    {
        global $wpdb;

        $table = self::getTableName();

        if ($wpdb->get_var("SHOW TABLES LIKE '{$table}'") === $table &&
            $wpdb->query("SHOW KEYS FROM {$table} WHERE Key_name = 'name'")
        ) {
            $wpdb->query("ALTER TABLE {$table} DROP INDEX name");
        }

        return "CREATE TABLE {$table} 
        (
            id         int auto_increment   primary key,
            wpUserId   bigint               not null,
            locationId int                  null,
            isAdmin    tinyint(1) default 0 not null
        ) DEFAULT CHARSET=utf8 COLLATE utf8_general_ci";
    }
}
