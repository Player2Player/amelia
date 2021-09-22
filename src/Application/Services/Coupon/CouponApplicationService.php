<?php

namespace AmeliaBooking\Application\Services\Coupon;

use AmeliaBooking\Domain\Common\Exceptions\CouponInvalidException;
use AmeliaBooking\Domain\Common\Exceptions\CouponUnknownException;
use AmeliaBooking\Domain\Entity\Bookable\Service\Service;
use AmeliaBooking\Domain\Entity\Location\Location;
use AmeliaBooking\Domain\Entity\Booking\Event\Event;
use AmeliaBooking\Domain\Entity\Coupon\Coupon;
use AmeliaBooking\Domain\Entity\Entities;
use AmeliaBooking\Domain\Entity\User\AbstractUser;
use AmeliaBooking\Domain\ValueObjects\String\BookingStatus;
use AmeliaBooking\Infrastructure\Common\Exceptions\QueryExecutionException;
use AmeliaBooking\Domain\Common\Exceptions\InvalidArgumentException;
use AmeliaBooking\Domain\Services\DateTime\DateTimeService;
use AmeliaBooking\Domain\ValueObjects\Number\Integer\Id;
use AmeliaBooking\Infrastructure\Common\Container;
use AmeliaBooking\Infrastructure\Repository\Booking\Appointment\AppointmentRepository;
use AmeliaBooking\Infrastructure\Repository\Booking\Appointment\CustomerBookingRepository;
use AmeliaBooking\Infrastructure\Repository\Booking\Event\EventRepository;
use AmeliaBooking\Infrastructure\Repository\Coupon\CouponEventRepository;
use AmeliaBooking\Infrastructure\Repository\Coupon\CouponRepository;
use AmeliaBooking\Infrastructure\Repository\Coupon\CouponServiceRepository;
use AmeliaBooking\Infrastructure\Repository\Coupon\CouponLocationRepository;
use AmeliaBooking\Infrastructure\WP\Translations\FrontendStrings;
use Slim\Exception\ContainerValueNotFoundException;

/**
 * Class CouponApplicationService
 *
 * @package AmeliaBooking\Application\Services\Coupon
 */
class CouponApplicationService
{
    private $container;

    /**
     * CouponApplicationService constructor.
     *
     * @param Container $container
     *
     * @throws \InvalidArgumentException
     */
    public function __construct(Container $container)
    {
        $this->container = $container;
    }


    /**
     * @param Coupon $coupon
     *
     * @return boolean
     *
     * @throws ContainerValueNotFoundException
     * @throws QueryExecutionException
     */
    public function add($coupon)
    {
        /** @var CouponRepository $couponRepository */
        $couponRepository = $this->container->get('domain.coupon.repository');

        /** @var CouponServiceRepository $couponServiceRepository */
        $couponServiceRepo = $this->container->get('domain.coupon.service.repository');

        /** @var CouponEventRepository $couponEventRepo */
        $couponEventRepo = $this->container->get('domain.coupon.event.repository');

        /** @var CouponLocationRepository $couponLocationRepo */
        $couponLocationRepo = $this->container->get('domain.coupon.location.repository');

        $couponId = $couponRepository->add($coupon);

        $coupon->setId(new Id($couponId));

        /** @var Location $location */
        foreach ($coupon->getLocationList()->getItems() as $location) {
          $couponLocationRepo->add($coupon, $location);
        }

        /** @var Service $service */
        foreach ($coupon->getServiceList()->getItems() as $service) {
            $couponServiceRepo->add($coupon, $service);
        }

        /** @var Event $event */
        foreach ($coupon->getEventList()->getItems() as $event) {
            $couponEventRepo->add($coupon, $event);
        }

        return $couponId;
    }

    /**
     * @param Coupon $oldCoupon
     * @param Coupon $newCoupon
     *
     * @return boolean
     *
     * @throws ContainerValueNotFoundException
     * @throws QueryExecutionException
     */
    public function update($oldCoupon, $newCoupon)
    {
        /** @var CouponRepository $couponRepository */
        $couponRepository = $this->container->get('domain.coupon.repository');

        /** @var CouponServiceRepository $couponServiceRepository */
        $couponServiceRepository = $this->container->get('domain.coupon.service.repository');

        /** @var CouponLocationRepository $couponLocationRepository */
        $couponLocationRepository = $this->container->get('domain.coupon.location.repository');

        /** @var CouponEventRepository $couponEventRepository */
        $couponEventRepository = $this->container->get('domain.coupon.event.repository');

        $couponRepository->update($oldCoupon->getId()->getValue(), $newCoupon);

        /** @var Location $newLocation */
        foreach ($newCoupon->getLocationList()->getItems() as $key => $newLocation) {
          if (!$oldCoupon->getLocationList()->keyExists($key)) {
              $couponLocationRepository->add($newCoupon, $newLocation);
          }
        }

        /** @var Location $oldLocation */
        foreach ($oldCoupon->getLocationList()->getItems() as $key => $oldLocation) {
            if (!$newCoupon->getLocationList()->keyExists($key)) {
                $couponLocationRepository->deleteForLocation($oldCoupon->getId()->getValue(), $key);
            }
        }
      
        /** @var Service $newService */
        foreach ($newCoupon->getServiceList()->getItems() as $key => $newService) {
            if (!$oldCoupon->getServiceList()->keyExists($key)) {
                $couponServiceRepository->add($newCoupon, $newService);
            }
        }

        /** @var Service $oldService */
        foreach ($oldCoupon->getServiceList()->getItems() as $key => $oldService) {
            if (!$newCoupon->getServiceList()->keyExists($key)) {
                $couponServiceRepository->deleteForService($oldCoupon->getId()->getValue(), $key);
            }
        }


        /** @var Event $newEvent */
        foreach ($newCoupon->getEventList()->getItems() as $key => $newEvent) {
            if (!$oldCoupon->getEventList()->keyExists($key)) {
                $couponEventRepository->add($newCoupon, $newEvent);
            }
        }

        /** @var Event $oldEvent */
        foreach ($oldCoupon->getEventList()->getItems() as $key => $oldEvent) {
            if (!$newCoupon->getEventList()->keyExists($key)) {
                $couponEventRepository->deleteForEvent($oldCoupon->getId()->getValue(), $key);
            }
        }

        return true;
    }

    /**
     * @param Coupon $coupon
     *
     * @return boolean
     *
     * @throws ContainerValueNotFoundException
     * @throws QueryExecutionException
     */
    public function delete($coupon)
    {
        /** @var CouponRepository $couponRepository */
        $couponRepository = $this->container->get('domain.coupon.repository');

        /** @var CouponServiceRepository $couponServiceRepository */
        $couponServiceRepository = $this->container->get('domain.coupon.service.repository');

        /** @var CouponLocationRepository $couponLocationRepository */
        $couponLocationRepository = $this->container->get('domain.coupon.location.repository');

        /** @var CouponEventRepository $couponEventRepository */
        $couponEventRepository = $this->container->get('domain.coupon.event.repository');

        /** @var CustomerBookingRepository $customerBookingRepository */
        $customerBookingRepository = $this->container->get('domain.booking.customerBooking.repository');

        return $couponServiceRepository->deleteByEntityId($coupon->getId()->getValue(), 'couponId') &&
            $couponLocationRepository->deleteByEntityId($coupon->getId()->getValue(), 'couponId') &&
            $couponEventRepository->deleteByEntityId($coupon->getId()->getValue(), 'couponId') &&
            $customerBookingRepository->updateByEntityId($coupon->getId()->getValue(), null, 'couponId') &&
            $couponRepository->delete($coupon->getId()->getValue());
    }

    /** @noinspection MoreThanThreeArgumentsInspection */
    /**
     * @param string $couponCode
     * @param int    $entityId
     * @param string $entityType
     * @param int    $userId
     * @param bool   $inspectCoupon
     *
     * @return Coupon
     *
     * @throws ContainerValueNotFoundException
     * @throws InvalidArgumentException
     * @throws QueryExecutionException
     * @throws CouponUnknownException
     * @throws CouponInvalidException
     */
    public function processCoupon($couponCode, $entityId, $entityType, $userId, $inspectCoupon, $count = 0)
    {
        /** @var CouponRepository $couponRepository */
        $couponRepository = $this->container->get('domain.coupon.repository');

        $coupons = $couponRepository->getAllByCriteria(['code' => $couponCode]);

        /** @var Coupon $coupon */
        $coupon = $coupons->length() ? $coupons->getItem($coupons->keys()[0]) : null;

        $this->inspectCoupon($coupon, $entityId, $entityType, $userId, $inspectCoupon, $count);

        return $coupon;
    }

     /**
     * p2p: Get autoapply valid coupon
     * 
     * @param int    $entityId
     * @param string $entityType
     *
     * @return Coupon
     *
     * @throws ContainerValueNotFoundException
     * @throws InvalidArgumentException
     * @throws QueryExecutionException
     * @throws CouponUnknownException
     * @throws CouponInvalidException
     */
    public function getAutoApplyCoupon($entityId, $entityType, $count) 
    {
        /** @var CouponRepository $couponRepository */
        $couponRepository = $this->container->get('domain.coupon.repository');
        $criteria = ['autoApply' => true];

        switch ($entityType) {
          case Entities::APPOINTMENT:
              $criteria['serviceId'] = $entityId;
              break;
          case Entities::EVENT:
              $criteria['eventId'] = $entityId;
              break;
        }

        $coupons = $couponRepository->getAllByCriteria($criteria);

        /** @var Coupon $coupon */
        $coupon = $coupons->length() ? $coupons->getItem($coupons->keys()[0]) : null;

        $this->inspectCoupon($coupon, $entityId, $entityType, null, true, $count);

        return $coupon;
    }

    /** @noinspection MoreThanThreeArgumentsInspection */
    /**
     * @param Coupon $coupon
     * @param int    $entityId
     * @param string $entityType
     * @param int    $userId
     * @param bool   $inspectCoupon
     *
     * @return boolean
     *
     * @throws ContainerValueNotFoundException
     * @throws CouponUnknownException
     * @throws CouponInvalidException
     * @throws QueryExecutionException
     * @throws InvalidArgumentException
     */
    public function inspectCoupon($coupon, $entityId, $entityType, $userId, $inspectCoupon, $count = 0)
    {
        switch ($entityType) {
            case Entities::APPOINTMENT:
                if (!$coupon || ($entityId !== null && !$coupon->getServiceList()->keyExists($entityId))) {
                    throw new CouponUnknownException(FrontendStrings::getCommonStrings()['coupon_unknown']);
                }

                break;
            case Entities::EVENT:
                if (!$coupon || ($entityId !== null && !$coupon->getEventList()->keyExists($entityId))) {
                    throw new CouponUnknownException(FrontendStrings::getCommonStrings()['coupon_unknown']);
                }

                break;
        }
        
        if ($inspectCoupon && $coupon && ( $coupon->getStatus()->getValue() === 'hidden' ||
              ( !$coupon->getNoLimit()->getValue() &&
                $coupon->getUsed()->getValue() >= $coupon->getLimit()->getValue()
              )
            )
          )
        {
            throw new CouponInvalidException(FrontendStrings::getCommonStrings()['coupon_invalid']);
        }

        //p2p: validate appointmentsMin and appointmentsMax
        if ($inspectCoupon && $coupon && $count > 0) {
          $min = $coupon->getAppointmentsMin()->getValue();
          $max = $coupon->getAppointmentsMax()->getValue();
          if ($max === 0 && $min > 0 && $count < $min) {
            $exc = new CouponInvalidException("For appying must booking at least $min lessons");
            $exc->setCouponDescription($coupon->getDescription()->getValue());
            throw $exc;
          }

          if ($max > 0 && ($count < $min || $count > $max))  {
            $exc = new CouponInvalidException(FrontendStrings::getCommonStrings()['coupon_invalid']);
            $exc->setCouponDescription("For appying must booking from $min and to $max lessons");
            throw $exc;
          }
        }

        //p2p: Validate by validFrom and validTo props
        if ($inspectCoupon && $coupon && !$coupon->getNeverExpire())
        {
          $now = DateTimeService::getNowDateTimeObjectInUtc();
          $validFrom = $coupon->getValidFrom()->getValue()->format('Y-m-d') . ' 00:00:00';  
          $validTo = $coupon->getValidTo()->getValue()->format('Y-m-d') . ' 23:59:00';
          $fromDateTime = DateTimeService::getCustomDateTimeObjectInUtc($validFrom);
          $toDateTime = DateTimeService::getCustomDateTimeObjectInUtc($validTo);
          if ($now < $fromDateTime || $now > $toDateTime)
            throw new CouponInvalidException(FrontendStrings::getCommonStrings()['coupon_invalid']);
        }

        if ($inspectCoupon && $userId && $coupon->getCustomerLimit()->getValue() > 0 &&
            $this->getCustomerCouponUsedCount($coupon->getId()->getValue(), $userId) >=
            $coupon->getCustomerLimit()->getValue()
        ) {
            throw new CouponInvalidException(FrontendStrings::getCommonStrings()['coupon_invalid']);
        }

        return true;
    }

    /**
     * @param int $couponId
     * @param int $userId
     *
     * @return int
     *
     * @throws ContainerValueNotFoundException
     * @throws QueryExecutionException
     * @throws InvalidArgumentException
     */
    public function getCustomerCouponUsedCount($couponId, $userId)
    {
        /** @var AppointmentRepository $appointmentRepo */
        $appointmentRepo = $this->container->get('domain.booking.appointment.repository');

        $customerAppointmentReservations = $appointmentRepo->getFiltered(
            [
                'customerId'      => $userId,
                'status'          => BookingStatus::APPROVED,
                'bookingStatus'   => BookingStatus::APPROVED,
                'bookingCouponId' => $couponId
            ]
        );

        /** @var EventRepository $eventRepository */
        $eventRepository = $this->container->get('domain.booking.event.repository');

        $customerEventReservations = $eventRepository->getFiltered(
            [
                'customerId'      => $userId,
                'bookingStatus'   => BookingStatus::APPROVED,
                'bookingCouponId' => $couponId
            ]
        );

        return $customerAppointmentReservations->length() + $customerEventReservations->length();
    }

    /**
     * @param Coupon       $coupon
     * @param AbstractUser $user
     *
     * @return int
     *
     * @throws ContainerValueNotFoundException
     * @throws QueryExecutionException
     * @throws InvalidArgumentException
     */
    public function getAllowedCouponLimit($coupon, $user)
    {
        if ($coupon->getCustomerLimit()->getValue()) {
            $maxLimit = $coupon->getCustomerLimit()->getValue();

            $used = $user && $user->getId() ?
                $this->getCustomerCouponUsedCount($coupon->getId()->getValue(), $user->getId()->getValue()) : 0;
        } else {
            $maxLimit = $coupon->getLimit()->getValue();

            $used = $coupon->getUsed()->getValue();
        }

        return $maxLimit - $used;
    }
}
