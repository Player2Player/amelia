<?php

namespace AmeliaBooking\Application\Services\Reservation;

use AmeliaBooking\Application\Commands\CommandResult;
use AmeliaBooking\Application\Services\Bookable\PackageApplicationService;
use AmeliaBooking\Application\Services\Booking\AppointmentApplicationService;
use AmeliaBooking\Application\Services\Booking\BookingApplicationService;
use AmeliaBooking\Application\Services\Booking\EventApplicationService;
use AmeliaBooking\Application\Services\Coupon\CouponApplicationService;
use AmeliaBooking\Application\Services\CustomField\CustomFieldApplicationService;
use AmeliaBooking\Application\Services\Payment\PaymentApplicationService;
use AmeliaBooking\Application\Services\User\CustomerApplicationService;
use AmeliaBooking\Domain\Common\Exceptions\BookingCancellationException;
use AmeliaBooking\Domain\Common\Exceptions\BookingUnavailableException;
use AmeliaBooking\Domain\Common\Exceptions\CouponInvalidException;
use AmeliaBooking\Domain\Common\Exceptions\CouponUnknownException;
use AmeliaBooking\Domain\Common\Exceptions\CustomerBookedException;
use AmeliaBooking\Domain\Common\Exceptions\ForbiddenFileUploadException;
use AmeliaBooking\Domain\Common\Exceptions\InvalidArgumentException;
use AmeliaBooking\Domain\Common\Exceptions\PackageBookingUnavailableException;
use AmeliaBooking\Domain\Entity\Bookable\AbstractBookable;
use AmeliaBooking\Domain\Entity\Bookable\Service\Extra;
use AmeliaBooking\Domain\Entity\Bookable\Service\Package;
use AmeliaBooking\Domain\Entity\Bookable\Service\Service;
use AmeliaBooking\Domain\Entity\Booking\Appointment\Appointment;
use AmeliaBooking\Domain\Entity\Booking\Appointment\CustomerBooking;
use AmeliaBooking\Domain\Entity\Booking\Appointment\CustomerBookingExtra;
use AmeliaBooking\Domain\Entity\Booking\Event\Event;
use AmeliaBooking\Domain\Entity\Booking\Reservation;
use AmeliaBooking\Domain\Entity\Coupon\Coupon;
use AmeliaBooking\Domain\Entity\Entities;
use AmeliaBooking\Domain\Entity\Payment\Payment;
use AmeliaBooking\Domain\Entity\User\AbstractUser;
use AmeliaBooking\Domain\Entity\User\Customer;
use AmeliaBooking\Domain\Factory\Payment\PaymentFactory;
use AmeliaBooking\Domain\Services\DateTime\DateTimeService;
use AmeliaBooking\Domain\Services\Reservation\ReservationServiceInterface;
use AmeliaBooking\Domain\Services\Settings\SettingsService;
use AmeliaBooking\Domain\ValueObjects\BooleanValueObject;
use AmeliaBooking\Domain\ValueObjects\Number\Integer\Id;
use AmeliaBooking\Domain\ValueObjects\String\BookingType;
use AmeliaBooking\Domain\ValueObjects\String\DepositType;
use AmeliaBooking\Domain\ValueObjects\String\Label;
use AmeliaBooking\Domain\ValueObjects\String\PaymentStatus;
use AmeliaBooking\Domain\ValueObjects\String\PaymentType;
use AmeliaBooking\Infrastructure\Common\Container;
use AmeliaBooking\Infrastructure\Common\Exceptions\NotFoundException;
use AmeliaBooking\Infrastructure\Common\Exceptions\QueryExecutionException;
use AmeliaBooking\Infrastructure\Repository\Booking\Appointment\CustomerBookingRepository;
use AmeliaBooking\Infrastructure\Repository\Payment\PaymentRepository;
use AmeliaBooking\Infrastructure\Repository\User\CustomerRepository;
use AmeliaBooking\Infrastructure\Repository\User\UserRepository;
use AmeliaBooking\Infrastructure\Services\Recaptcha\RecaptchaService;
use AmeliaBooking\Infrastructure\WP\EventListeners\Booking\Appointment\BookingAddedEventHandler;
use AmeliaBooking\Infrastructure\WP\Translations\FrontendStrings;
use AmeliaBooking\Domain\ValueObjects\String\PaymentData;
use DateTime;
use Exception;
use Interop\Container\Exception\ContainerException;
use Slim\Exception\ContainerValueNotFoundException;

/**
 * Class AbstractReservationService
 *
 * @package AmeliaBooking\Application\Services\Reservation
 */
abstract class AbstractReservationService implements ReservationServiceInterface
{
    protected $container;

    /**
     * AbstractReservationService constructor.
     *
     * @param Container $container
     *
     * @throws \InvalidArgumentException
     */
    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    abstract public function getReservationPaymentAmount($reservation);
    
    /**
     * @param Reservation $reservation
     *
     * @return void
     * @throws QueryExecutionException
     * @throws InvalidArgumentException
     */
    protected function deleteReservation($reservation)
    {
        if ($reservation->getReservation()) {
            switch ($reservation->getReservation()->getType()->getValue()) {
                case (Entities::APPOINTMENT):
                    if ($reservation->getReservation()->getBookings()->length() === 1) {
                        /** @var AppointmentApplicationService $appointmentApplicationService */
                        $appointmentApplicationService =
                            $this->container->get('application.booking.appointment.service');

                        $appointmentApplicationService->delete($reservation->getReservation());
                    } else {
                        /** @var BookingApplicationService $bookingApplicationService */
                        $bookingApplicationService = $this->container->get('application.booking.booking.service');

                        $bookingApplicationService->delete($reservation->getBooking());
                    }

                    break;

                case (Entities::EVENT):
                    /** @var EventApplicationService $eventApplicationService */
                    $eventApplicationService = $this->container->get('application.booking.event.service');

                    $eventApplicationService->deleteEventBooking($reservation->getBooking());

                    break;
            }
        }
    }

    /**
     * @param int|null $newUserId
     * @throws QueryExecutionException
     */
    protected function deleteUserIfNew($newUserId)
    {
        if ($newUserId !== null) {
            /** @var CustomerRepository $customerRepository */
            $customerRepository = $this->container->get('domain.users.customers.repository');

            $customerRepository->delete($newUserId);
        }
    }

    /**
     * @param array       $data
     * @param Reservation $reservation
     * @param bool        $save
     *
     * @return CommandResult
     *
     * @throws ForbiddenFileUploadException
     * @throws ContainerValueNotFoundException
     * @throws InvalidArgumentException
     * @throws QueryExecutionException
     * @throws ContainerException
     * @throws Exception
     */
    public function processRequest($data, $reservation, $save)
    {
        $result = new CommandResult();

        $type = $data['type'] ?: Entities::APPOINTMENT;

        /** @var AbstractUser $currentUser */
        $currentUser = $this->container->get('logged.in.user');

        if (!empty($data['payment']['gateway']) &&
            $data['payment']['gateway'] === 'onSite' &&
            $currentUser &&
            $currentUser->getType() === Entities::CUSTOMER
        ) {
            /** @var SettingsService $settingsService */
            $settingsService = $this->container->get('domain.settings.service');

            $googleRecaptchaSettings = $settingsService->getSetting(
                'general',
                'googleRecaptcha'
            );

            if ($googleRecaptchaSettings['enabled']) {
                /** @var RecaptchaService $recaptchaService */
                $recaptchaService = $this->container->get('infrastructure.recaptcha.service');

                if (!array_key_exists('recaptcha', $data) || !$recaptchaService->verify($data['recaptcha'])) {
                    $result->setResult(CommandResult::RESULT_ERROR);
                    $result->setData(['recaptchaError' => true]);

                    return $result;
                }
            }
        }

        /** @var CustomerBookingRepository $customerBookingRepository */
        $customerBookingRepository = $this->container->get('domain.booking.appointment.repository');
        /** @var PaymentRepository $paymentRepository */
        $paymentRepository = $this->container->get('domain.payment.repository');

        $customerBookingRepository->beginTransaction();

        $this->processBooking($result, $data, $reservation, $save);

        if ($result->getResult() === CommandResult::RESULT_ERROR) {
            $customerBookingRepository->rollback();

            return $result;
        }

        /** @var PaymentApplicationService $paymentAS */
        $paymentAS = $this->container->get('application.payment.service');

        $paymentCompleted = empty($data['bookings'][0]['packageCustomerService']['id']) ?
            $paymentAS->processPayment($result, $data['payment'], $data['bookings'][0]['customer'], $reservation, new BookingType($type)) : true;

        // set payment data returning for the payment gateway
        $intentId = isset($result->getData()['paymentIntentId']) ? $result->getData()['paymentIntentId'] : null;
        if ($intentId) {
          /** @var Payment $payment */
          $payment = $reservation->getBooking()->getPayments()->getItems()[0];
          $paymentData = array('paymentIntentId' => $intentId, 'paymentStatus' => $result->getData()['paymentStatus']);
          $payment->setData(new PaymentData(json_encode($paymentData)));
          $paymentRepository->update($payment->getId()->getValue(), $payment);
        }

        if (!$paymentCompleted || $result->getResult() === CommandResult::RESULT_ERROR) {
            $customerBookingRepository->rollback();

            if ($save) {
                $this->deleteReservation($reservation);

                if ($reservation->getRecurring()) {
                    foreach ($reservation->getRecurring()->getItems() as $recurringReservation) {
                        $this->deleteReservation($recurringReservation);
                    }
                }

                if ($reservation->getPackageReservations()) {
                    foreach ($reservation->getPackageReservations()->getItems() as $packageReservation) {
                        $this->deleteReservation($packageReservation);
                    }
                }

                if ($reservation->getPackageCustomerServices()) {
                    /** @var PackageApplicationService $packageApplicationService */
                    $packageApplicationService = $this->container->get('application.bookable.package');

                    $packageApplicationService->deletePackageCustomer($reservation->getPackageCustomerServices());
                }
            }

            if ($reservation->isNewUser()->getValue() && $reservation->getCustomer()) {
                $this->deleteUserIfNew($reservation->getCustomer()->getId()->getValue());
            }

            return $result;
        }

        $this->finalize($result, $reservation, new BookingType($type));

        $customerBookingRepository->commit();

        return $result;
    }

    /** @noinspection MoreThanThreeArgumentsInspection */
    /**
     * @param CommandResult $result
     * @param array         $appointmentData
     * @param Reservation   $reservation
     * @param bool          $save
     *
     * @return void
     *
     * @throws \Slim\Exception\ContainerException
     * @throws \InvalidArgumentException
     * @throws ContainerValueNotFoundException
     * @throws InvalidArgumentException
     * @throws QueryExecutionException
     * @throws Exception
     * @throws ContainerException
     */
    public function processBooking($result, $appointmentData, $reservation, $save)
    {
        /** @var CouponApplicationService $couponAS */
        $couponAS = $this->container->get('application.coupon.service');

        $appointmentData['bookings'][0]['info'] = json_encode(
            [
                'firstName' => $appointmentData['bookings'][0]['customer']['firstName'],
                'lastName'  => $appointmentData['bookings'][0]['customer']['lastName'],
                'phone'     => $appointmentData['bookings'][0]['customer']['phone'],
                'locale'    => $appointmentData['locale'],
                'timeZone'  => $appointmentData['timeZone'],
            ]
        );

        /** @var Customer $user */
        $user = null;

        $newUserId = null;

        // Create a new user if doesn't exists. For adding appointment from the front-end.
        if (!$appointmentData['bookings'][0]['customerId'] && !$appointmentData['bookings'][0]['customer']['id']) {
            /** @var CustomerApplicationService $customerAS */
            $customerAS = $this->container->get('application.user.customer.service');

            /** @var UserRepository $userRepository */
            $userRepository = $this->container->get('domain.users.repository');

            $user = $customerAS->getNewOrExistingCustomer($appointmentData['bookings'][0]['customer'], $result);

            if ($result->getResult() === CommandResult::RESULT_ERROR) {
                return null;
            }

            if ($save && !$user->getId()) {
                if (!($newUserId = $userRepository->add($user))) {
                    $result->setResult(CommandResult::RESULT_ERROR);
                    $result->setData(['emailError' => true]);

                    return null;
                }

                $user->setId(new Id($newUserId));
            }

            if ($user->getId()) {
                $appointmentData['bookings'][0]['customerId'] = $user->getId()->getValue();

                $appointmentData['bookings'][0]['customer']['id'] = $user->getId()->getValue();
            }
        }

        if ($reservation->hasCustomFieldsValidation()->getValue()) {
            /** @var CustomFieldApplicationService $customFieldService */
            $customFieldService = $this->container->get('application.customField.service');

            $appointmentData['uploadedCustomFieldFilesInfo'] = [];

            if ($appointmentData['bookings'][0]['customFields']) {
                $appointmentData['uploadedCustomFieldFilesInfo'] = $customFieldService->processCustomFields(
                    $appointmentData['bookings'][0]['customFields']
                );
            }
        }

        if ($appointmentData['bookings'][0]['customFields'] &&
            is_array($appointmentData['bookings'][0]['customFields'])
        ) {
            $appointmentData['bookings'][0]['customFields'] = json_encode(
                $appointmentData['bookings'][0]['customFields']
            );
        }

        /** @var Coupon $coupon */
        $coupon = null;

        // Inspect if coupon is existing and valid if sent from the front-end.
        if (!empty($appointmentData['couponCode'])) {
            try {
                $entityId = null;

                switch ($appointmentData['type']) {
                    case Entities::APPOINTMENT:
                        $entityId = $appointmentData['serviceId'];
                        break;

                    case Entities::EVENT:
                        $entityId = $appointmentData['eventId'];

                        break;
                }
                $countLessons = count($appointmentData['recurring']) + 1;
                $coupon = $couponAS->processCoupon(
                    $appointmentData['couponCode'],
                    $entityId,
                    $appointmentData['type'],
                    ($user && $user->getId()) ?
                        $user->getId()->getValue() : $appointmentData['bookings'][0]['customer']['id'],
                    $reservation->hasCouponValidation()->getValue(),
                    $countLessons
                );

                if (isset($appointmentData['recurring']) && $reservation->hasCouponValidation()->getValue()) {
                    $allowedCouponLimit = $couponAS->getAllowedCouponLimit($coupon, $user);

                    $requiredCouponCount = 1;

                    foreach ($appointmentData['recurring'] as $key => $recurringData) {
                        $requiredCouponCount++;

                        $appointmentData['recurring'][$key]['useCoupon'] = $requiredCouponCount <= $allowedCouponLimit;
                    }
                }
            } catch (CouponUnknownException $e) {
                $this->deleteUserIfNew($newUserId);

                $result->setResult(CommandResult::RESULT_ERROR);
                $result->setMessage($e->getMessage());
                $result->setData(
                    [
                        'couponUnknown' => true
                    ]
                );

                return null;
            } catch (CouponInvalidException $e) {
                $this->deleteUserIfNew($newUserId);

                $result->setResult(CommandResult::RESULT_ERROR);
                $result->setMessage($e->getMessage());
                $result->setData(
                    [
                        'couponInvalid' => true
                    ]
                );

                return null;
            }

            if ($coupon) {
                $appointmentData['bookings'][0]['coupon'] = $coupon->toArray();

                $appointmentData['bookings'][0]['couponId'] = $coupon->getId()->getValue();
            }
        }

        try {
            $this->book($appointmentData, $reservation, $save);
        } catch (CustomerBookedException $e) {
            $this->deleteUserIfNew($newUserId);

            $result->setResult(CommandResult::RESULT_ERROR);

            switch ($appointmentData['type']) {
                case Entities::APPOINTMENT:
                case Entities::PACKAGE:
                    $result->setMessage(FrontendStrings::getCommonStrings()['customer_already_booked_app']);
                    break;

                case Entities::EVENT:
                    $result->setMessage(FrontendStrings::getCommonStrings()['customer_already_booked_ev']);

                    break;
            }
            $result->setData(
                [
                    'customerAlreadyBooked' => true
                ]
            );

            return null;
        } catch (BookingUnavailableException $e) {
            $this->deleteUserIfNew($newUserId);

            $result->setResult(CommandResult::RESULT_ERROR);
            $result->setMessage(FrontendStrings::getCommonStrings()['time_slot_unavailable']);
            $result->setData(
                [
                    'timeSlotUnavailable' => true
                ]
            );

            return null;
        } catch (PackageBookingUnavailableException $e) {
            $result->setResult(CommandResult::RESULT_ERROR);
            $result->setMessage(FrontendStrings::getCommonStrings()['package_booking_unavailable']);
            $result->setData(
                [
                    'packageBookingUnavailable' => true
                ]
            );

            return null;
        }

        $reservation->setIsNewUser(new BooleanValueObject($newUserId !== null));

        $reservation->setLocale(new Label($appointmentData['locale']));

        $reservation->setTimezone(new Label($appointmentData['timeZone']));

        if (array_key_exists('uploadedCustomFieldFilesInfo', $appointmentData)) {
            $reservation->setUploadedCustomFieldFilesInfo($appointmentData['uploadedCustomFieldFilesInfo']);
        }
    }

    /**
     * @param CommandResult $result
     * @param Reservation   $reservation
     * @param BookingType   $bookingType
     *
     * @throws ContainerValueNotFoundException
     * @throws ContainerException
     * @throws ForbiddenFileUploadException
     */
    public function finalize($result, $reservation, $bookingType)
    {
        /** @var CustomerApplicationService $customerApplicationService */
        $customerApplicationService = $this->container->get('application.user.customer.service');

        /** @var AbstractUser $loggedInUser */
        $loggedInUser = $this->container->get('logged.in.user');

        $isAdmin = $loggedInUser && $loggedInUser->getType() === AbstractUser::USER_ROLE_ADMIN;

        if (!$isAdmin) {
            $customerApplicationService->setWPUserForCustomer(
                $reservation->getCustomer(),
                $reservation->isNewUser()->getValue()
            );
        }

        if (!$reservation->getBooking() && $reservation->getPackageReservations()->length() === 0) {
            $result->setResult(CommandResult::RESULT_SUCCESS);
            $result->setMessage('Successfully added booking');
            $result->setData(
                [
                    'type'                     => $bookingType->getValue(),
                    'customer'                 => array_merge(
                        $reservation->getCustomer()->toArray(),
                        [
                            'locale'   => $reservation->getLocale()->getValue(),
                            'timeZone' => $reservation->getTimeZone()->getValue()
                        ]
                    ),
                    $bookingType->getValue()   => null,
                    Entities::BOOKING          => null,
                    'utcTime'                  => [],
                    'appointmentStatusChanged' => false,
                    'packageId'                => $reservation->getBookable()->getId()->getValue(),
                    'package'                  => [],
                    'recurring'                => [],
                    'bookable'                 => $reservation->getBookable()->toArray(),
                ]
            );

            return;
        }

        /** @var CustomFieldApplicationService $customFieldService */
        $customFieldService = $this->container->get('application.customField.service');

        if ($reservation->getBooking()) {
            $customFieldService->saveUploadedFiles(
                $reservation->getBooking()->getId()->getValue(),
                $reservation->getUploadedCustomFieldFilesInfo(),
                '',
                $reservation->getRecurring() && $reservation->getRecurring()->length()
            );
        }

        $recurringReservations = [];

        if ($bookingType->getValue() === Entities::APPOINTMENT) {
            /** @var Reservation $recurringReservation */
            foreach ($reservation->getRecurring()->getItems() as $key => $recurringReservation) {
                $customFieldService->saveUploadedFiles(
                    $recurringReservation->getBooking()->getId()->getValue(),
                    $reservation->getUploadedCustomFieldFilesInfo(),
                    '',
                    $key !== $reservation->getRecurring()->length() - 1
                );

                $recurringReservations[] = $this->getResultData($recurringReservation, $bookingType);
            }
        }

        $packageReservations = [];

        if ($bookingType->getValue() === Entities::PACKAGE) {
            /** @var Reservation $packageReservation */
            foreach ($reservation->getPackageReservations()->getItems() as $key => $packageReservation) {
                $customFieldService->saveUploadedFiles(
                    $packageReservation->getBooking()->getId()->getValue(),
                    $reservation->getUploadedCustomFieldFilesInfo(),
                    '',
                    $key !== $reservation->getPackageReservations()->length() - 1
                );

                $packageReservations[] = $this->getResultData(
                    $packageReservation,
                    new BookingType(Entities::APPOINTMENT)
                );
            }
        }

        $result->setResult(CommandResult::RESULT_SUCCESS);
        $result->setMessage('Successfully added booking');
        $result->setData(
            array_merge(
                $this->getResultData($reservation, $bookingType),
                [
                    'recurring' => $recurringReservations,
                    'package'   => $packageReservations,
                    'packageId' => $packageReservations ? $reservation->getBookable()->getId()->getValue() : null,
                    'customer'  => array_merge(
                        $reservation->getCustomer()->toArray(),
                        [
                            'locale'   => $reservation->getLocale()->getValue(),
                            'timeZone' => $reservation->getTimeZone()->getValue()
                        ]
                    ),
                    'bookable'  => $reservation->getBookable()->toArray(),
                ]
            )
        );
    }

    /**
     * @param Reservation   $reservation
     * @param BookingType   $bookingType
     *
     * @return array
     */
    public function getResultData($reservation, $bookingType)
    {
        return [
            'type'                     => $bookingType->getValue(),
            $bookingType->getValue()   => array_merge(
                $reservation->getReservation()->toArray(),
                [
                    'bookings' => $reservation->getBooking() ? [
                        $reservation->getBooking()->toArray()
                    ] : []
                ]
            ),
            Entities::BOOKING          => $reservation->getBooking() ? $reservation->getBooking()->toArray() : null,
            'utcTime'                  => $reservation->getBooking() ? $this->getBookingPeriods(
                $reservation->getReservation(),
                $reservation->getBooking(),
                $reservation->getBookable()
            ) : [],
            'appointmentStatusChanged' => $reservation->isStatusChanged() ?
                $reservation->isStatusChanged()->getValue() : false,
        ];
    }

    /**
     * @param CustomerBooking       $booking
     * @param Service|Event|Package $bookable
     *
     * @return float
     *
     * @throws InvalidArgumentException
     */
    public function getPaymentAmount($booking, $bookable)
    {
        $price = (float)$bookable->getPrice()->getValue() *
            ($this->isAggregatedPrice($bookable) ? $booking->getPersons()->getValue() : 1);

        /** @var CustomerBookingExtra $customerBookingExtra */
        foreach ($booking->getExtras()->getItems() as $customerBookingExtra) {
            /** @var Extra $extra */
            $extra = $bookable->getExtras()->getItem($customerBookingExtra->getExtraId()->getValue());

            $isExtraAggregatedPrice = $extra->getAggregatedPrice() === null ? $this->isAggregatedPrice($bookable) :
                $extra->getAggregatedPrice()->getValue();

            $price += (float)$extra->getPrice()->getValue() *
                ($isExtraAggregatedPrice ? $booking->getPersons()->getValue() : 1) *
                $customerBookingExtra->getQuantity()->getValue();
        }

        if ($booking->getCoupon()) {
            $coupon = $booking->getCoupon();
            $subtraction = $price / 100 *
                ($coupon->getDiscount()->getValue() ?: 0) +
                ($coupon->getDeduction()->getValue() ?: 0) +
                (($coupon->getAppointmentsFree()->getValue() ?: 0) * $price);

            return round($price - $subtraction, 2);
        }

        return $price;
    }

    /** @noinspection MoreThanThreeArgumentsInspection */
    /**
     * @param int       $bookingId
     * @param int       $packageCustomerId
     * @param array     $paymentData
     * @param float     $amount
     * @param DateTime $dateTime
     *
     * @return Payment
     *
     * @throws ContainerValueNotFoundException
     * @throws InvalidArgumentException
     * @throws QueryExecutionException
     */
    public function addPayment($bookingId, $packageCustomerId, $paymentData, $amount, $dateTime)
    {
        /** @var PaymentRepository $paymentRepository */
        $paymentRepository = $this->container->get('domain.payment.repository');
        /** @var SettingsService $settingsService */
        $settingsService = $this->container->get('domain.settings.service');
        $options = $settingsService->getSetting('p2p', 'stripe');   

        $paymentStatus = PaymentStatus::PENDING;

        switch ($paymentData['gateway']) {
            case (PaymentType::WC):
                $paymentStatus = $paymentData['status'];
                break;
            case (PaymentType::MOLLIE):
            case (PaymentType::PAY_PAL):
                $paymentStatus = PaymentStatus::PAID;
                break;
            case (PaymentType::STRIPE):
                $paymentStatus = $options['manualCapture'] === true ? PaymentStatus::PENDING : PaymentStatus::PAID;
                break;
        }

        $paymentAmount = $paymentData['gateway'] === PaymentType::ON_SITE ? 0 : $amount;

        if (!$amount && $paymentData['gateway'] !== PaymentType::ON_SITE) {
            $paymentData['gateway'] = PaymentType::ON_SITE;
        }

        if (!empty($paymentData['deposit'])) {
            $paymentStatus = PaymentStatus::PARTIALLY_PAID;
        }

        if ($paymentData['gateway'] === PaymentType::MOLLIE) {
            $paymentStatus = PaymentStatus::PENDING;
        }

        $paymentEntryData = apply_filters(
            'amelia_before_payment',
            [
                'customerBookingId' => $bookingId,
                'packageCustomerId' => $packageCustomerId,
                'amount'            => $paymentAmount,
                'status'            => $amount > 0 ? $paymentStatus : PaymentStatus::PAID,
                'gateway'           => $paymentData['gateway'],
                'dateTime'          => ($paymentData['gateway'] === PaymentType::ON_SITE) ?
                    $dateTime->format('Y-m-d H:i:s') : DateTimeService::getNowDateTimeObject()->format('Y-m-d H:i:s'),
                'gatewayTitle'      => isset($paymentData['gatewayTitle']) ? $paymentData['gatewayTitle'] : '',
                'parentId'          => !empty($paymentData['parentId']) ? $paymentData['parentId'] : null,
            ],
            $amount
        );

        $payment = PaymentFactory::create($paymentEntryData);

        if (!($payment instanceof Payment)) {
            throw new InvalidArgumentException('Unknown type');
        }

        $paymentId = $paymentRepository->add($payment);

        $payment->setId(new Id($paymentId));

        return $payment;
    }

    /**
     * @param DateTime $bookingStart
     * @param int      $minimumCancelTime
     *
     * @return boolean
     *
     * @throws ContainerValueNotFoundException
     * @throws BookingCancellationException
     */
    public function inspectMinimumCancellationTime($bookingStart, $minimumCancelTime)
    {
        if (DateTimeService::getNowDateTimeObject() >=
            DateTimeService::getCustomDateTimeObject(
                $bookingStart->format('Y-m-d H:i:s')
            )->modify("-{$minimumCancelTime} second")
        ) {
            throw new BookingCancellationException(
                FrontendStrings::getCabinetStrings()['booking_cancel_exception']
            );
        }

        return true;
    }

    /**
     * @param float            $paymentAmount
     * @param AbstractBookable $bookable
     * @param int              $persons
     *
     * @return float
     */
    public function calculateDepositAmount($paymentAmount, $bookable, $persons)
    {
        if ($bookable->getDepositPayment()->getValue() !== DepositType::DISABLED) {
            switch ($bookable->getDepositPayment()->getValue()) {
                case DepositType::FIXED:
                    if ($bookable->getDepositPerPerson() && $bookable->getDepositPerPerson()->getValue()) {
                        if ($paymentAmount > $persons * $bookable->getDeposit()->getValue()) {
                            return $persons * $bookable->getDeposit()->getValue();
                        }
                    } else {
                        if ($paymentAmount > $bookable->getDeposit()->getValue()) {
                            return $bookable->getDeposit()->getValue();
                        }
                    }

                    break;

                case DepositType::PERCENTAGE:
                    $depositAmount = round($paymentAmount / 100 * $bookable->getDeposit()->getValue(), 2);

                    if ($paymentAmount > $depositAmount) {
                        return $depositAmount;
                    }

                    break;
            }
        }

        return $paymentAmount;
    }

    /** @noinspection MoreThanThreeArgumentsInspection */
    /**
     * @param int    $bookingId
     * @param string $type
     * @param array  $recurring
     * @param bool   $appointmentStatusChanged
     * @param int    $packageId
     * @param array  $customerData
     *
     * @return CommandResult
     *
     * @throws InvalidArgumentException
     * @throws ContainerException
     * @throws QueryExecutionException
     */
    public function getSuccessBookingResponse(
        $bookingId,
        $type,
        $recurring,
        $appointmentStatusChanged,
        $packageId,
        $customerData
    ) {
        $result = new CommandResult();

        /** @var ReservationServiceInterface $reservationService */
        $reservationService = $this->container->get('application.reservation.service')->get($type);

        if ($packageId && (int)$bookingId === 0) {
            $result->setResult(CommandResult::RESULT_SUCCESS);
            $result->setMessage('Successfully get booking');
            $result->setData(
                [
                    'type'                     => Entities::APPOINTMENT,
                    Entities::APPOINTMENT      => null,
                    Entities::BOOKING          => null,
                    'appointmentStatusChanged' => false,
                    'packageId'                => $packageId,
                    'customer'                 => $customerData,
                    'recurring'                => []
                ]
            );

            $result->setDataInResponse(false);

            return $result;
        }

        /** @var Appointment|Event $reservation */
        $reservation = $reservationService->getReservationByBookingId((int)$bookingId);

        /** @var CustomerBooking $booking */
        $booking = $reservation->getBookings()->getItem(
            (int)$bookingId
        );

        $booking->setChangedStatus(new BooleanValueObject(true));

        $recurringReservations = [];

        $recurring = isset($recurring) ? $recurring : [];

        foreach ($recurring as $recurringData) {
            /** @var Appointment $recurringReservation */
            $recurringReservation = $reservationService->getReservationByBookingId((int)$recurringData['id']);

            /** @var CustomerBooking $recurringBooking */
            $recurringBooking = $recurringReservation->getBookings()->getItem(
                (int)$recurringData['id']
            );

            $recurringBooking->setChangedStatus(new BooleanValueObject(true));

            $recurringReservations[] = [
                'type'                                       => $recurringReservation->getType()->getValue(),
                $recurringReservation->getType()->getValue() => $recurringReservation->toArray(),
                Entities::BOOKING                            => $recurringBooking->toArray(),
                'appointmentStatusChanged'                   => $recurringData['appointmentStatusChanged'],
            ];
        }

        $result->setResult(CommandResult::RESULT_SUCCESS);
        $result->setMessage('Successfully get booking');
        $result->setData(
            array_merge(
                [
                    'type'                              => $reservation->getType()->getValue(),
                    $reservation->getType()->getValue() => $reservation->toArray(),
                    Entities::BOOKING                   => $booking->toArray(),
                    'appointmentStatusChanged'          => $appointmentStatusChanged,
                ],
                [
                    'customer'  => $customerData,
                    'packageId' => $packageId,
                    'recurring' => $recurringReservations
                ]
            )
        );

        $result->setDataInResponse(false);

        return $result;
    }

    /**
     * @param CommandResult $result
     *
     * @return void
     * @throws ContainerException
     * @throws InvalidArgumentException
     * @throws QueryExecutionException
     * @throws NotFoundException
     */
    public function runPostBookingActions($result)
    {
        if ($result->getResult() === CommandResult::RESULT_SUCCESS) {
            $recurring = [];

            $bookingId = 0;
            $appointmentStatusChanged = false;

            switch ($result->getData()['type']) {
                case (Entities::APPOINTMENT):
                    $bookingId = $result->getData()[Entities::BOOKING]['id'];
                    $appointmentStatusChanged = $result->getData()['appointmentStatusChanged'];

                    foreach ($result->getData()['recurring'] as $recurringData) {
                        $recurring[] = [
                            'id'                       => $recurringData[Entities::BOOKING]['id'],
                            'type'                     => $recurringData['type'],
                            'appointmentStatusChanged' => $recurringData['appointmentStatusChanged'],
                        ];
                    }

                    break;

                case (Entities::EVENT):
                    $bookingId = $result->getData()[Entities::BOOKING]['id'];

                    $appointmentStatusChanged = $result->getData()['appointmentStatusChanged'];

                    break;

                case (Entities::PACKAGE):
                    $packageReservations = $result->getData()['package'];

                    foreach ($packageReservations as $index => $packageData) {
                        if ($index > 0) {
                            $recurring[] = [
                                'id'                       => $packageData[Entities::BOOKING]['id'],
                                'type'                     => $packageData['type'],
                                'appointmentStatusChanged' => $packageData['appointmentStatusChanged'],
                            ];
                        } else {
                            $bookingId = $packageData[Entities::BOOKING]['id'];

                            $appointmentStatusChanged = $packageData['appointmentStatusChanged'];
                        }
                    }

                    break;
            }

            /** @var ReservationServiceInterface $reservationService */
            $reservationService =
                $this->container->get('application.reservation.service')->get($result->getData()['type']);

            BookingAddedEventHandler::handle(
                $reservationService->getSuccessBookingResponse(
                    $bookingId,
                    $result->getData()['type'],
                    $recurring,
                    $appointmentStatusChanged,
                    $result->getData()['packageId'],
                    $result->getData()['customer']
                ),
                $this->container
            );
        }
    }

    /**
     * @param bool $couponValidation
     * @param bool $customFieldsValidation
     * @param bool $availabilityValidation
     *
     * @return Reservation
     */
    public function getNew($couponValidation, $customFieldsValidation, $availabilityValidation)
    {
        /** @var Reservation $entity */
        $entity = new Reservation();

        $entity->setCouponValidation(new BooleanValueObject($couponValidation));

        $entity->setCustomFieldsValidation(new BooleanValueObject($customFieldsValidation));

        $entity->setAvailabilityValidation(new BooleanValueObject($availabilityValidation));

        return $entity;
    }
}
