<?php

namespace AmeliaBooking\Domain\Entity\Location;

use AmeliaBooking\Domain\ValueObjects\String\Status;
use AmeliaBooking\Domain\ValueObjects\Picture;
use AmeliaBooking\Domain\ValueObjects\String\Address;
use AmeliaBooking\Domain\ValueObjects\String\Description;
use AmeliaBooking\Domain\ValueObjects\GeoTag;
use AmeliaBooking\Domain\ValueObjects\Number\Integer\Id;
use AmeliaBooking\Domain\ValueObjects\String\Name;
use AmeliaBooking\Domain\ValueObjects\String\Phone;
use AmeliaBooking\Domain\ValueObjects\String\Url;
use AmeliaBooking\Domain\ValueObjects\String\Slug;
use AmeliaBooking\Domain\ValueObjects\Number\Integer\PositiveInteger;

/**
 * Class Location
 *
 * @package AmeliaBooking\Domain\Entity\Location
 */
class Location
{
    /** @var Id */
    private $id;

    /** @var Slug */
    private $slug;

    /** @var Status */
    private $status;

    /** @var Name */
    private $name;

    /** @var Description */
    private $description;

    /** @var Address */
    private $address;

    /** @var Phone */
    private $phone;

    /** @var GeoTag */
    private $coordinates;

    /** @var Picture */
    private $picture;

    /** @var Url */
    private $pin;

    /** @var PositiveInteger */
    private $locationCategoryId;

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
     * @return Status
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * @param Status $status
     */
    public function setStatus(Status $status)
    {
        $this->status = $status;
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
     * @return Description
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @param Description $description
     */
    public function setDescription(Description $description)
    {
        $this->description = $description;
    }

    /**
     * @return Address
     */
    public function getAddress()
    {
        return $this->address;
    }

    /**
     * @param Address $address
     */
    public function setAddress(Address $address)
    {
        $this->address = $address;
    }

    /**
     * @return Phone
     */
    public function getPhone()
    {
        return $this->phone;
    }

    /**
     * @param Phone $phone
     */
    public function setPhone(Phone $phone)
    {
        $this->phone = $phone;
    }

    /**
     * @return GeoTag
     */
    public function getCoordinates()
    {
        return $this->coordinates;
    }

    /**
     * @param GeoTag $coordinates
     */
    public function setCoordinates(GeoTag $coordinates)
    {
        $this->coordinates = $coordinates;
    }

    /**
     * @return Picture
     */
    public function getPicture()
    {
        return $this->picture;
    }

    /**
     * @param Picture $picture
     */
    public function setPicture(Picture $picture)
    {
        $this->picture = $picture;
    }

    /**
     * @return Url
     */
    public function getPin()
    {
        return $this->pin;
    }

    /**
     * @param Url $pin
     */
    public function setPin(Url $pin)
    {
        $this->pin = $pin;
    }

    /**
     * 
     * @param PositiveInteger $locationCategoryId
     */
    public function setLocationCategoryId(PositiveInteger $locationCategoryId) {
        $this->locationCategoryId = $locationCategoryId;
    }

    /**
     * @return PositiveInteger
     */ 
    public function getLocationCategoryId() {
        return $this->locationCategoryId;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return [
            'id'               => null !== $this->getId() ? $this->getId()->getValue() : null,
            'slug'             => null !== $this->getSlug() ? $this->getSlug()->getValue() : null,
            'status'           => null !== $this->getStatus() ? $this->getStatus()->getValue() : null,
            'name'             => $this->getName()->getValue(),
            'description'      => null !== $this->getDescription() ? $this->getDescription()->getValue() : null,
            'address'          => is_null($this->getAddress()) ? null : $this->getAddress()->getValue(),
            'phone'            => is_null($this->getPhone()) ? null : $this->getPhone()->getValue(),
            'latitude'         => is_null($this->getCoordinates()) ? null : $this->getCoordinates()->getLatitude(),
            'longitude'        => is_null($this->getCoordinates()) ? null : $this->getCoordinates()->getLongitude(),
            'pictureFullPath'  => null !== $this->getPicture() ? $this->getPicture()->getFullPath() : null,
            'pictureThumbPath' => null !== $this->getPicture() ? $this->getPicture()->getThumbPath() : null,
            'pin'              => null !== $this->getPin() ? $this->getPin()->getValue() : null,
            'locationCategoryId'  => null !== $this->getLocationCategoryId() ? $this->getLocationCategoryId()->getValue() : null,
        ];
    }
}
