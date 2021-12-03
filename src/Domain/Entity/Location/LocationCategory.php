<?php

namespace AmeliaBooking\Domain\Entity\Location;

use AmeliaBooking\Domain\ValueObjects\Number\Integer\Id;
use AmeliaBooking\Domain\ValueObjects\String\Name;
use AmeliaBooking\Domain\ValueObjects\String\Slug;

/**
 * Class LocationCategory
 *
 * @package AmeliaBooking\Domain\Entity\Location
 */
class LocationCategory
{
    /** @var Id */
    private $id;

    /** @var Slug */
    private $slug;

    /** @var Name */
    private $name;

    /**
     * @return Id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param Id $id
     */
    public function setId(Id $id)
    {
        $this->id = $id;
    }

    /**
     * @param Slug $slug
     */
    public function setSlug(Slug $slug)
    {
        $this->slug = $slug;
    }

    /**
     * @return Slug
     */
    public function getSlug()
    {
        return $this->slug;
    }
    
    /**
     * @return Name
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param Name $name
     */
    public function setName(Name $name)
    {
        $this->name = $name;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return [
            'id'               => null !== $this->getId() ? $this->getId()->getValue() : null,
            'slug'             => null !== $this->getSlug() ? $this->getSlug()->getValue() : null,
            'name'             => $this->getName()->getValue(),
        ];
    }
}
