<?php

namespace AmeliaBooking\Infrastructure\WP\InstallActions\DB\Payment;

use AmeliaBooking\Infrastructure\WP\InstallActions\DB\AbstractDatabaseTable;

/**
 * Class NotificationsSMSHistoryTable
 *
 * @package AmeliaBooking\Infrastructure\WP\InstallActions\DB\Notification
 *
 * @codingStandardsIgnoreFile
 */
class StripeLogTable extends AbstractDatabaseTable
{

    const TABLE = 'stripe_logs';
}