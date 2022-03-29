<?php

namespace AmeliaBooking\Domain\Entity\Notification;

use AmeliaBooking\Domain\ValueObjects\Number\Integer\Id;
use AmeliaBooking\Domain\ValueObjects\BooleanValueObject;

/**
 * Class Notification 
 * 
 * Appointments/events notifications by location and coach director
 * 
 * @package AmeliaBooking\Domain\Entity\Notification
*/  
class NotificationAdmin {

    /** 
     * @var Id 
    */
    private $id;

    /** 
     * @var Id 
    */
    private $wpUserId;

    /** 
     * @var Id 
    */
    private $locationId;

    /**
     * @var BooleanValueObject 
    */
    private $isAdmin;

    /**
     * Get the value of id
     *
     * @return  Id
     */ 
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set the value of id
     *
     * @param  Id  $id
     *
     * @return  self
     */ 
    public function setId(Id $id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Get the value of wpUserId
     *
     * @return  Id
     */ 
    public function getWpUserId()
    {
        return $this->wpUserId;
    }

    /**
     * Set the value of wpUserId
     *
     * @param  Id  $wpUserId
     *
     * @return  self
     */ 
    public function setWpUserId(Id $wpUserId)
    {
        $this->wpUserId = $wpUserId;

        return $this;
    }

    /**
     * Get the value of locationId
     *
     * @return  Id
     */ 
    public function getLocationId()
    {
        return $this->locationId;
    }

    /**
     * Set the value of locationId
     *
     * @param  Id  $locationId
     *
     * @return  self
     */ 
    public function setLocationId(Id $locationId)
    {
        $this->locationId = $locationId;

        return $this;
    }

    /**
     * Get the value of isAdmin
     *
     * @return  BooleanValueObject
     */ 
    public function getIsAdmin()
    {
        return $this->isAdmin;
    }

    /**
     * Set the value of isAdmin
     *
     * @param  BooleanValueObject  $isAdmin
     *
     * @return  self
     */ 
    public function setIsAdmin(BooleanValueObject $isAdmin)
    {
        $this->isAdmin = $isAdmin;

        return $this;
    }

    public function toArray() {
        return [
            'id'           => null !== $this->getId() ? $this->getId()->getValue() : null,
            'locationId'   => $this->getLocationId() !== null ? $this->getLocationId()->getValue() : null,
            'wpUserId'     => $this->getWpUserId()->getValue(),
            'isAdmin'      => $this->getIsAdmin()->getValue(),
        ];
    }

}