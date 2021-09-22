<?php
/**
 * @copyright © TMS-Plugins. All rights reserved.
 * @licence   See LICENCE.md for license details.
 */

namespace AmeliaBooking\Domain\Entity\Coupon;

use AmeliaBooking\Domain\Collection\Collection;
use AmeliaBooking\Domain\ValueObjects\BooleanValueObject;
use AmeliaBooking\Domain\ValueObjects\DiscountFixedValue;
use AmeliaBooking\Domain\ValueObjects\DiscountPercentageValue;
use AmeliaBooking\Domain\ValueObjects\Number\Integer\WholeNumber;
use AmeliaBooking\Domain\ValueObjects\String\CouponCode;
use AmeliaBooking\Domain\ValueObjects\String\Status;
use AmeliaBooking\Domain\ValueObjects\String\Name;
use AmeliaBooking\Domain\ValueObjects\DateTime\DateTimeValue;
use AmeliaBooking\Domain\ValueObjects\Number\Integer\Id;

/**
 * Class Coupon
 *
 * @package AmeliaBooking\Domain\Entity\Coupon
 */
class Coupon
{
    /** @var Id */
    private $id;

    /** @var CouponCode */
    private $code;

    /** @var DiscountPercentageValue */
    private $discount;

    /** @var DiscountFixedValue */
    private $deduction;

    /** @var WholeNumber */
    private $limit;

    /** @var WholeNumber */
    private $customerLimit;

    /** @var WholeNumber */
    private $used;

    /** @var WholeNumber */
    private $notificationInterval;

    /** @var BooleanValueObject */
    private $notificationRecurring;

    /** @var Status */
    private $status;

    /** 
     * @var BooleanValueObject 
     * 
     */
    private $autoApply;

    /**
     *  @var Name 
     */
    private $description;

    /**
     *  @var WholeNumber 
     */
    private $appointmentsFree;

    /** 
     * @var WholeNumber 
     */
    private $appointmentsMin;

    /**
     * @var WholeNumber 
     */
    private $appointmentsMax;

    /**
     * @var DateTimeValue 
     */
    private $validFrom;

    /** 
     * @var DateTimeValue 
     */
    private $validTo;

    /**
     * @var BooleanValueObject
     */
    private $noLimit;

    /** @var Collection */
    private $serviceList;

    /** @var Collection */
    private $eventList;

    /**
     * @var Collection 
     * 
     **/
    private $locationList;

    /**
     * Coupon constructor.
     *
     * @param CouponCode              $code
     * @param DiscountPercentageValue $discount
     * @param DiscountFixedValue      $deduction
     * @param WholeNumber             $limit
     * @param Status                  $status
     */
    public function __construct(
        CouponCode $code,
        DiscountPercentageValue $discount,
        DiscountFixedValue $deduction,
        WholeNumber $limit,
        Status $status
    ) {
        $this->code = $code;
        $this->discount = $discount;
        $this->deduction = $deduction;
        $this->limit = $limit;
        $this->status = $status;
    }

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
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return CouponCode
     */
    public function getCode()
    {
        return $this->code;
    }

    /**
     * @param CouponCode $code
     */
    public function setCode(CouponCode $code)
    {
        $this->code = $code;
    }

    /**
     * @return DiscountPercentageValue
     */
    public function getDiscount()
    {
        return $this->discount;
    }

    /**
     * @param DiscountPercentageValue $discount
     */
    public function setDiscount(DiscountPercentageValue $discount)
    {
        $this->discount = $discount;
    }

    /**
     * @return DiscountFixedValue
     */
    public function getDeduction()
    {
        return $this->deduction;
    }

    /**
     * @param DiscountFixedValue $deduction
     */
    public function setDeduction(DiscountFixedValue $deduction)
    {
        $this->deduction = $deduction;
    }

    /**
     * @return WholeNumber
     */
    public function getLimit()
    {
        return $this->limit;
    }

    /**
     * @param WholeNumber $limit
     */
    public function setLimit($limit)
    {
        $this->limit = $limit;
    }

    /**
     * @return WholeNumber
     */
    public function getCustomerLimit()
    {
        return $this->customerLimit;
    }

    /**
     * @param WholeNumber $customerLimit
     */
    public function setCustomerLimit($customerLimit)
    {
        $this->customerLimit = $customerLimit;
    }

    /**
     * @return WholeNumber
     */
    public function getUsed()
    {
        return $this->used;
    }

    /**
     * @param WholeNumber $used
     */
    public function setUsed($used)
    {
        $this->used = $used;
    }

    /**
     * @return WholeNumber
     */
    public function getNotificationInterval()
    {
        return $this->notificationInterval;
    }

    /**
     * @param WholeNumber $notificationInterval
     */
    public function setNotificationInterval($notificationInterval)
    {
        $this->notificationInterval = $notificationInterval;
    }

    /**
     * @return BooleanValueObject
     */
    public function getNotificationRecurring()
    {
        return $this->notificationRecurring;
    }

    /**
     * @param BooleanValueObject $notificationRecurring
     */
    public function setNotificationRecurring($notificationRecurring)
    {
        $this->notificationRecurring = $notificationRecurring;
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
     * @return Collection
     */
    public function getServiceList()
    {
        return $this->serviceList;
    }

    /**
     * @param Collection $serviceList
     */
    public function setServiceList(Collection $serviceList)
    {
        $this->serviceList = $serviceList;
    }

    /**
     * @return Collection
     */
    public function getEventList()
    {
        return $this->eventList;
    }

    /**
     * @param Collection $eventList
     */
    public function setEventList(Collection $eventList)
    {
        $this->eventList = $eventList;
    }

    /**
     * Get the value of autoApply
     *
     * @return  BooleanValueObject
     */ 
    public function getAutoApply()
    {
        return $this->autoApply;
    }

    /**
     * Set the value of autoApply
     *
     * @param  BooleanValueObject  $autoApply
     *
     * @return  self
     */ 
    public function setAutoApply(BooleanValueObject $autoApply)
    {
        $this->autoApply = $autoApply;

        return $this;
    }

    /**
     * Get the value of description
     *
     * @return  Name
     */ 
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set the value of description
     *
     * @param  Name  $description
     *
     * @return  self
     */ 
    public function setDescription(Name $description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get the value of appointmentsFree
     *
     * @return  WholeNumber
     */ 
    public function getAppointmentsFree()
    {
        return $this->appointmentsFree;
    }

    /**
     * Set the value of appointmentsFree
     *
     * @param  WholeNumber  $appointmentsFree
     *
     * @return  self
     */ 
    public function setAppointmentsFree(WholeNumber $appointmentsFree)
    {
        $this->appointmentsFree = $appointmentsFree;

        return $this;
    }

    /**
     * Get the value of appointmentsMin
     *
     * @return  WholeNumber
     */ 
    public function getAppointmentsMin()
    {
        return $this->appointmentsMin;
    }

    /**
     * Set the value of appointmentsMin
     *
     * @param  WholeNumber  $appointmentsMin
     *
     * @return  self
     */ 
    public function setAppointmentsMin(WholeNumber $appointmentsMin)
    {
        $this->appointmentsMin = $appointmentsMin;

        return $this;
    }

    /**
     * Get the value of appointmentsMax
     *
     * @return  WholeNumber
     */ 
    public function getAppointmentsMax()
    {
        return $this->appointmentsMax;
    }

    /**
     * Set the value of appointmentsMax
     *
     * @param  WholeNumber  $appointmentsMax
     *
     * @return  self
     */ 
    public function setAppointmentsMax(WholeNumber $appointmentsMax)
    {
        $this->appointmentsMax = $appointmentsMax;

        return $this;
    }

    /**
     * Get the value of validFrom
     *
     * @return  DateTimeValue
     */ 
    public function getValidFrom()
    {
        return $this->validFrom;
    }

    /**
     * Set the value of validFrom
     *
     * @param  DateTimeValue  $validFrom
     *
     * @return  self
     */ 
    public function setValidFrom(DateTimeValue $validFrom)
    {
        $this->validFrom = $validFrom;

        return $this;
    }

    /**
     * Get the value of validTo
     *
     * @return  DateTimeValue
     */ 
    public function getValidTo()
    {
        return $this->validTo;
    }

    /** @return Boolean */
    public function getNeverExpire()
    {
        return !$this->validFrom && !$this->validTo;
    }

    /**
     * Set the value of validTo
     *
     * @param  DateTimeValue  $validTo
     *
     * @return  self
     */ 
    public function setValidTo(DateTimeValue $validTo)
    {
        $this->validTo = $validTo;

        return $this;
    }

    /**
     * Get the value of noLimit
     *
     * @return  BooleanValueObject
     */ 
    public function getNoLimit()
    {
        return $this->noLimit;
    }

    /**
     * Set the value of noLimit
     *
     * @param  BooleanValueObject  $noLimit
     *
     * @return  self
     */ 
    public function setNoLimit(BooleanValueObject $noLimit)
    {
        $this->noLimit = $noLimit;

        return $this;
    }

    /**
     * Get the value of locationList
     *
     * @return  Collection
     */ 
    public function getLocationList()
    {
        return $this->locationList;
    }

    /**
     * Set the value of locationList
     *
     * @param  Collection  $locationList
     *
     * @return  self
     */ 
    public function setLocationList(Collection $locationList)
    {
        $this->locationList = $locationList;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return [
            'id'                    => null !== $this->getId() ? $this->getId()->getValue() : null,
            'code'                  => $this->getCode()->getValue(),
            'discount'              => $this->getDiscount()->getValue(),
            'deduction'             => $this->getDeduction()->getValue(),
            'limit'                 => $this->getLimit()->getValue(),
            'customerLimit'         => $this->getCustomerLimit()->getValue(),
            'used'                  => $this->getUsed() ? $this->getUsed()->getValue() : 0,
            'notificationInterval'  => $this->getNotificationInterval() ? $this->getNotificationInterval()->getValue() : 0,
            'notificationRecurring' => $this->getNotificationRecurring() ? $this->getNotificationRecurring()->getValue() : 0,
            'status'                => $this->getStatus()->getValue(),
            'serviceList'           => $this->getServiceList() ? $this->getServiceList()->toArray() : [],
            'eventList'             => $this->getEventList() ? $this->getEventList()->toArray() : [],
            'autoApply'             => $this->getAutoApply() ? $this->getAutoApply()->getValue() : 0,
            'description'           => $this->getDescription() ? $this->getDescription()->getValue() : "",
            'appointmentsFree'      => $this->getAppointmentsFree() ? $this->getAppointmentsFree()->getValue() : 0,
            'appointmentsMin'       => $this->getAppointmentsMin() ? $this->getAppointmentsMin()->getValue() : 0,
            'appointmentsMax'       => $this->getAppointmentsMax() ? $this->getAppointmentsMax()->getValue() : 0,
            'validFrom'             => $this->getValidFrom() ? $this->getValidFrom()->getValue()->format('c') : null,
            'validTo'               => $this->getValidTo() ? $this->getValidTo()->getValue()->format('c') : null,
            'noLimit'               => $this->getNoLimit() ? $this->getNoLimit()->getValue() : 0,
            'neverExpire'           => $this->getNeverExpire(),
        ];
    }

}
