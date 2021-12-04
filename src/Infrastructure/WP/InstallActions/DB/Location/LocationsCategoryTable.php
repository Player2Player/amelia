<?php

namespace AmeliaBooking\Infrastructure\WP\InstallActions\DB\Location;

use AmeliaBooking\Domain\Common\Exceptions\InvalidArgumentException;
use AmeliaBooking\Domain\ValueObjects\Picture;
use AmeliaBooking\Domain\ValueObjects\String\Address;
use AmeliaBooking\Domain\ValueObjects\String\Description;
use AmeliaBooking\Domain\ValueObjects\String\Name;
use AmeliaBooking\Domain\ValueObjects\String\Phone;
use AmeliaBooking\Domain\ValueObjects\String\Url;
use AmeliaBooking\Infrastructure\WP\InstallActions\DB\AbstractDatabaseTable;

/**
 * Class LocationsTable
 *
 * @package AmeliaBooking\Infrastructure\WP\InstallActions\DB\Location
 */
class LocationsCategoryTable extends AbstractDatabaseTable
{

    const TABLE = 'locations_categories';

    /**
     * @return string
     * @throws InvalidArgumentException
     */
    public static function buildTable()
    {
    }
}
