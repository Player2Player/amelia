<?php
/**
 * @copyright © TMS-Plugins. All rights reserved.
 * @licence   See LICENCE.md for license details.
 */

namespace AmeliaBooking\Domain\Factory\Coupon;

use AmeliaBooking\Domain\Collection\Collection;
use AmeliaBooking\Domain\Entity\Coupon\Coupon;
use AmeliaBooking\Domain\Factory\Bookable\Service\ServiceFactory;
use AmeliaBooking\Domain\Factory\Booking\Event\EventFactory;
use AmeliaBooking\Domain\ValueObjects\BooleanValueObject;
use AmeliaBooking\Domain\ValueObjects\DateTime\DateTimeValue;
use AmeliaBooking\Domain\ValueObjects\DiscountFixedValue;
use AmeliaBooking\Domain\ValueObjects\DiscountPercentageValue;
use AmeliaBooking\Domain\Services\DateTime\DateTimeService;
use AmeliaBooking\Domain\ValueObjects\Number\Integer\WholeNumber;
use AmeliaBooking\Domain\ValueObjects\String\CouponCode;
use AmeliaBooking\Domain\ValueObjects\String\Status;
use AmeliaBooking\Domain\ValueObjects\Number\Integer\Id;
use AmeliaBooking\Domain\ValueObjects\String\Name;

/**
 * Class CouponFactory
 *
 * @package AmeliaBooking\Domain\Factory\Coupon
 */
class CouponFactory
{
    /**
     * @param $data
     *
     * @return Coupon
     * @throws \AmeliaBooking\Domain\Common\Exceptions\InvalidArgumentException
     */
    public static function create($data)
    {
        $coupon = new Coupon(
            new CouponCode($data['code']),
            new DiscountPercentageValue($data['discount']),
            new DiscountFixedValue($data['deduction']),
            new WholeNumber($data['limit']),
            new Status($data['status'])
        );

        if (isset($data['id'])) {
            $coupon->setId(new Id($data['id']));
        }

        $serviceList = new Collection();

        if (isset($data['serviceList'])) {
            foreach ((array)$data['serviceList'] as $key => $value) {
                $serviceList->addItem(
                    ServiceFactory::create($value),
                    $key
                );
            }
        }

        $eventList = new Collection();

        if (isset($data['eventList'])) {
            foreach ((array)$data['eventList'] as $key => $value) {
                $eventList->addItem(
                    EventFactory::create($value),
                    $key
                );
            }
        }

        if (isset($data['customerLimit'])) {
            $coupon->setCustomerLimit(new WholeNumber($data['customerLimit']));
        }

        if (isset($data['notificationInterval'])) {
            $coupon->setNotificationInterval(new WholeNumber($data['notificationInterval']));
        }

        if (isset($data['notificationRecurring'])) {
            $coupon->setNotificationRecurring(new BooleanValueObject($data['notificationRecurring']));
        }

        if (isset($data['used'])) {
            $coupon->setUsed(new WholeNumber($data['used']));
        }

        if (isset($data['autoApply'])) {
          $coupon->setAutoApply(new BooleanValueObject($data['autoApply']));
        }

        if (isset($data['description'])) {
          $coupon->setDescription(new Name($data['description']));
        }

        if (isset($data['appointmentsFree'])) {
          $coupon->setAppointmentsFree(new WholeNumber($data['appointmentsFree']));
        }

        if (isset($data['appointmentsMin'])) {
          $coupon->setAppointmentsMin(new WholeNumber($data['appointmentsMin']));
        }

        if (isset($data['appointmentsMax'])) {
          $coupon->setAppointmentsMax(new WholeNumber($data['appointmentsMax']));
        }

        if (!$data['neverExpire'] && isset($data['dateRange'])) {
          $start = DateTimeService::getCustomDateTimeObjectInUtc($data['dateRange']['start']);
          $end = DateTimeService::getCustomDateTimeObjectInUtc($data['dateRange']['end']);
          $coupon->setValidFrom(new DateTimeValue($start));
          $coupon->setValidTo(new DateTimeValue($end));
        }

        if (isset($data['noLimit'])) {
          $coupon->setNoLimit(new BooleanValueObject($data['noLimit']));
          if ($data['noLimit']) {
            $coupon->setLimit(new WholeNumber(0));
            $coupon->setCustomerLimit(new WholeNumber(0));
          }
        }

        $coupon->setServiceList($serviceList);
        $coupon->setEventList($eventList);

        return $coupon;
    }

    /**
     * @param array $rows
     *
     * @return Collection
     * @throws \AmeliaBooking\Domain\Common\Exceptions\InvalidArgumentException
     */
    public static function createCollection($rows)
    {
        $coupons = [];

        foreach ($rows as $row) {
            $couponId = $row['coupon_id'];
            $serviceId = isset($row['service_id']) ? $row['service_id'] : null;
            $eventId = isset($row['event_id']) ? $row['event_id'] : null;
            $bookingId = isset($row['booking_id']) ? $row['booking_id'] : null;

            $coupons[$couponId]['id'] = $couponId;
            $coupons[$couponId]['code'] = $row['coupon_code'];
            $coupons[$couponId]['discount'] = $row['coupon_discount'];
            $coupons[$couponId]['deduction'] = $row['coupon_deduction'];
            $coupons[$couponId]['limit'] = $row['coupon_limit'];
            $coupons[$couponId]['customerLimit'] = $row['coupon_customerLimit'];
            $coupons[$couponId]['notificationInterval'] = $row['coupon_notificationInterval'];
            $coupons[$couponId]['notificationRecurring'] = $row['coupon_notificationRecurring'];
            $coupons[$couponId]['status'] = $row['coupon_status'];
            //setting up new props  
            $coupons[$couponId]['autoApply'] = $row['coupon_autoApply'];
            $coupons[$couponId]['description'] = $row['coupon_description'];
            $coupons[$couponId]['appointmentsFree'] = $row['coupon_appointmentsFree'];
            $coupons[$couponId]['appointmentsMin'] = $row['coupon_appointmentsMin'];
            $coupons[$couponId]['appointmentsMax'] = $row['coupon_appointmentsMax'];
            $coupons[$couponId]['noLimit'] = $row['coupon_noLimit'];
            if ($row['coupon_validFrom']) {
              $start = $row['coupon_validFrom'];
              $end   = $row['coupon_validTo'];
              $coupons[$couponId]['dateRange'] = [
                'start' => $start,
                'end'   => $end
              ];  
            }
            else {
              $coupons[$couponId]['dateRange'] = null;
            }

            if ($bookingId) {
                $coupons[$couponId]['bookings'][$bookingId] = $bookingId;
            }

            if ($serviceId) {
                $coupons[$couponId]['serviceList'][$serviceId]['id'] = $serviceId;
                $coupons[$couponId]['serviceList'][$serviceId]['name'] = $row['service_name'];
                $coupons[$couponId]['serviceList'][$serviceId]['description'] = $row['service_description'];
                $coupons[$couponId]['serviceList'][$serviceId]['color'] = $row['service_color'];
                $coupons[$couponId]['serviceList'][$serviceId]['status'] = $row['service_status'];
                $coupons[$couponId]['serviceList'][$serviceId]['categoryId'] = $row['service_categoryId'];
                $coupons[$couponId]['serviceList'][$serviceId]['duration'] = $row['service_duration'];
                $coupons[$couponId]['serviceList'][$serviceId]['price'] = $row['service_price'];
                $coupons[$couponId]['serviceList'][$serviceId]['minCapacity'] = $row['service_minCapacity'];
                $coupons[$couponId]['serviceList'][$serviceId]['maxCapacity'] = $row['service_maxCapacity'];
            }

            if ($eventId) {
                $coupons[$couponId]['eventList'][$eventId]['id'] = $eventId;
                $coupons[$couponId]['eventList'][$eventId]['name'] = $row['event_name'];
                $coupons[$couponId]['eventList'][$eventId]['price'] = $row['event_price'];
            }
        }

        $couponsCollection = new Collection();

        foreach ($coupons as $couponKey => $couponArray) {
            $couponArray['used'] = isset($couponArray['bookings']) ? sizeof($couponArray['bookings']) : 0;

            $couponsCollection->addItem(
                self::create($couponArray),
                $couponKey
            );
        }

        return $couponsCollection;
    }
}
