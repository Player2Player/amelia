<?php

namespace AmeliaBooking\Domain\Factory\Location;

use AmeliaBooking\Domain\Common\Exceptions\InvalidArgumentException;
use AmeliaBooking\Domain\Entity\Location\LocationCategory;
use AmeliaBooking\Domain\ValueObjects\Number\Integer\Id;
use AmeliaBooking\Domain\ValueObjects\String\Name;
use AmeliaBooking\Domain\ValueObjects\String\Slug;

/**
 * Class LocationCategoryFactory
 *
 * @package AmeliaBooking\Domain\Factory\Location
 */
class LocationCategoryFactory
{

    /**
     * @param $data
     *
     * @return LocationCategory
     * @throws InvalidArgumentException
     */
    public static function create($data)
    {
        $location = new LocationCategory();

        if (isset($data['id'])) {
            $location->setId(new Id($data['id']));
        }

        if (isset($data['slug'])) {
          $location->setSlug(new Slug($data['slug']));
        }
                
        if (isset($data['name'])) {
            $location->setName(new Name($data['name']));
        }

        return $location;
    }
}
