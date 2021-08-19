<?php

namespace AmeliaBooking\Infrastructure\WP\InstallActions\DB\CustomField;

use AmeliaBooking\Domain\Common\Exceptions\InvalidArgumentException;
use AmeliaBooking\Infrastructure\WP\InstallActions\DB\AbstractDatabaseTable;

/**
 * Class CustomFieldsConditionsTable
 *
 * @package AmeliaBooking\Infrastructure\WP\InstallActions\DB\CustomField
 */
class CustomFieldsConditionsTable extends AbstractDatabaseTable
{
    const TABLE = 'custom_fields_conditions';
}
