<?php

namespace AmeliaBooking\Application\Services\Payment;

use AmeliaBooking\Application\Commands\CommandResult;
use AmeliaBooking\Application\Services\Bookable\PackageApplicationService;
use AmeliaBooking\Application\Services\Placeholder\PlaceholderService;
use AmeliaBooking\Domain\Collection\Collection;
use AmeliaBooking\Domain\Common\Exceptions\InvalidArgumentException;
use AmeliaBooking\Domain\Entity\Bookable\AbstractBookable;
use AmeliaBooking\Domain\Entity\Booking\Appointment\CustomerBooking;
use AmeliaBooking\Domain\Entity\Booking\Event\Event;
use AmeliaBooking\Domain\Entity\Booking\Reservation;
use AmeliaBooking\Domain\Entity\Cache\Cache;
use AmeliaBooking\Domain\Entity\Entities;
use AmeliaBooking\Domain\Entity\Payment\Payment;
use AmeliaBooking\Domain\Entity\User\AbstractUser;
use AmeliaBooking\Domain\Entity\User\Provider;
use AmeliaBooking\Domain\Services\Reservation\ReservationServiceInterface;
use AmeliaBooking\Domain\Services\Settings\SettingsService;
use AmeliaBooking\Domain\Services\DateTime\DateTimeService;
use AmeliaBooking\Domain\ValueObjects\Number\Float\Price;
use AmeliaBooking\Domain\ValueObjects\String\BookingType;
use AmeliaBooking\Domain\ValueObjects\String\PaymentType;
use AmeliaBooking\Domain\ValueObjects\String\PaymentData;
use AmeliaBooking\Domain\ValueObjects\String\PaymentStatus;
use AmeliaBooking\Domain\ValueObjects\String\BookingStatus;
use AmeliaBooking\Infrastructure\Common\Container;
use AmeliaBooking\Infrastructure\Common\Exceptions\QueryExecutionException;
use AmeliaBooking\Infrastructure\Repository\Booking\Event\EventRepository;
use AmeliaBooking\Infrastructure\Repository\Cache\CacheRepository;
use AmeliaBooking\Infrastructure\Repository\Payment\PaymentRepository;
use AmeliaBooking\Infrastructure\Services\Payment\CurrencyService;
use AmeliaBooking\Infrastructure\Services\Payment\PayPalService;
use AmeliaBooking\Infrastructure\Services\Payment\StripeService;
use AmeliaStripe\PaymentIntent;
use AmeliaStripe\Customer;
use AmeliaStripe\Refund;
use AmeliaBooking\Infrastructure\WP\Translations\FrontendStrings;
use AmeliaStripe\Stripe;
use Exception;
use Slim\Exception\ContainerException;
use Slim\Exception\ContainerValueNotFoundException;

/**
 * Class PaymentApplicationService
 *
 * @package AmeliaBooking\Application\Services\Payment
 */
class PaymentApplicationService
{

    private $container;

    /**
     * PaymentApplicationService constructor.
     *
     * @param Container $container
     */
    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    /**
     * @param array $params
     * @param int   $itemsPerPage
     *
     * @return array
     *
     * @throws ContainerValueNotFoundException
     * @throws QueryExecutionException
     * @throws InvalidArgumentException
     */
    public function getPaymentsData($params, $itemsPerPage)
    {
        /** @var PaymentRepository $paymentRepository */
        $paymentRepository = $this->container->get('domain.payment.repository');

        /** @var EventRepository $eventRepository */
        $eventRepository = $this->container->get('domain.booking.event.repository');

        /** @var PackageApplicationService $packageApplicationService */
        $packageApplicationService = $this->container->get('application.bookable.package');

        $paymentsData = $paymentRepository->getFiltered($params, $itemsPerPage);

        $eventBookingIds = [];

        /** @var Collection $events */
        $events = $eventRepository->getByBookingIds($eventBookingIds);

        $paymentDataValues = array_values($paymentsData);

        $bookingsIds = array_column($paymentDataValues, 'customerBookingId');

        /** @var Event $event */
        foreach ($events->getItems() as $event) {
            /** @var CustomerBooking $booking */
            foreach ($event->getBookings()->getItems() as $booking) {
                if (($key = array_search($booking->getId()->getValue(), $bookingsIds)) !== false) {
                    $paymentsData[$paymentDataValues[$key]['id']]['bookingStart'] =
                        $event->getPeriods()->getItem(0)->getPeriodStart()->getValue()->format('Y-m-d H:i:s');

                    /** @var Provider $provider */
                    foreach ($event->getProviders()->getItems() as $provider) {
                        $paymentsData[$paymentDataValues[$key]['id']]['providers'][] = [
                            'id' => $provider->getId()->getValue(),
                            'fullName' => $provider->getFullName(),
                            'email' => $provider->getEmail()->getValue(),
                        ];
                    }

                    $paymentsData[$paymentDataValues[$key]['id']]['eventId'] = $event->getId()->getValue();

                    $paymentsData[$paymentDataValues[$key]['id']]['name'] = $event->getName()->getValue();
                }
            }
        }

        $packageApplicationService->setPaymentData($paymentsData);

        foreach ($paymentsData as $index => $value) {
            !empty($paymentsData[$index]['providers']) ?
                $paymentsData[$index]['providers'] = array_values($paymentsData[$index]['providers']) : [];
        }

        return $paymentsData;
    }

    /** @noinspection MoreThanThreeArgumentsInspection */
    /**
     * @param CommandResult $result
     * @param array         $paymentData
     * @param array         $customerData
     * @param Reservation   $reservation
     * @param BookingType   $bookingType
     *
     * @return boolean
     *
     * @throws ContainerValueNotFoundException
     * @throws Exception
     * @throws \Interop\Container\Exception\ContainerException
     */
    public function processPayment($result, $paymentData, $customerData, $reservation, $bookingType)
    {
        $bookingTypeValue = $bookingType->getValue();  

        /** @var ReservationServiceInterface $reservationService */
        $reservationService = $this->container->get('application.reservation.service')->get($bookingTypeValue);
        /** @var SettingsService $settingsService */
        $settingsService = $this->container->get('domain.settings.service');
        $options = $settingsService->getSetting('p2p', 'stripe');

        $paymentAmount = $reservationService->getReservationPaymentAmount($reservation);

        if (!$paymentAmount &&
            (
                $paymentData['gateway'] === 'stripe' ||
                $paymentData['gateway'] === 'payPal'
                || $paymentData['gateway'] === 'mollie'
            )) {
            $result->setResult(CommandResult::RESULT_ERROR);
            $result->setMessage(FrontendStrings::getCommonStrings()['payment_error']);
            $result->setData(
                [
                    'paymentSuccessful' => false,
                    'onSitePayment'     => true
                ]
            );

            return false;
        }

        switch ($paymentData['gateway']) {
            case ('payPal'):
                /** @var PayPalService $paymentService */
                $paymentService = $this->container->get('infrastructure.payment.payPal.service');

                $response = $paymentService->complete(
                    [
                        'transactionReference' => $paymentData['data']['transactionReference'],
                        'PayerID'              => $paymentData['data']['PayerId'],
                        'amount'               => $paymentAmount,
                    ]
                );

                if (!$response->isSuccessful()) {
                    $result->setResult(CommandResult::RESULT_ERROR);
                    $result->setMessage(FrontendStrings::getCommonStrings()['payment_error']);
                    $result->setData(
                        [
                            'paymentSuccessful' => false,
                            'message'           => $response->getMessage(),
                        ]
                    );

                    return false;
                }

                return true;

            case ('stripe'):
                /** @var StripeService $paymentService */
                $paymentService = $this->container->get('infrastructure.payment.stripe.service');

                /** @var CurrencyService $currencyService */
                $currencyService = $this->container->get('infrastructure.payment.currency.service');

                $additionalInformation = $this->getBookingInformationForPaymentSettings(
                    $reservation,
                    PaymentType::STRIPE
                );

                try {
                    $stripeParams = [
                        'paymentMethodId' => !empty($paymentData['data']['paymentMethodId']) ?
                            $paymentData['data']['paymentMethodId'] : null,
                        'paymentIntentId' => !empty($paymentData['data']['paymentIntentId']) ?
                            $paymentData['data']['paymentIntentId'] : null,
                        'amount'          => $currencyService->getAmountInFractionalUnit(new Price($paymentAmount)),
                        'metaData'        => $additionalInformation['metaData'],
                        'description'     => $additionalInformation['description'],
                        'manualCapture'   => $options['manualCapture'] === true && $bookingTypeValue === BookingType::APPOINTMENT
                    ];
                    if ($customerData['email']) {
                        $stripeParams['customer'] = $this->createStripeCustomer($customerData);
                    }                    
                    $response = $paymentService->execute($stripeParams);
                } catch (Exception $e) {
                    $result->setResult(CommandResult::RESULT_ERROR);
                    $result->setMessage(FrontendStrings::getCommonStrings()['payment_error']);
                    $result->setData(
                        [
                            'paymentSuccessful' => false,
                            'message'           => $e->getMessage(),
                        ]
                    );

                    return false;
                }

                if (isset($response['requiresAction'])) {
                    $result->setResult(CommandResult::RESULT_SUCCESS);
                    $result->setData(
                        [
                            'paymentIntentClientSecret' => $response['paymentIntentClientSecret'],
                            'requiresAction'            => $response['requiresAction']
                        ]
                    );

                    return false;
                }

                if (empty($response['paymentSuccessful'])) {
                    $result->setResult(CommandResult::RESULT_ERROR);
                    $result->setMessage(FrontendStrings::getCommonStrings()['payment_error']);
                    $result->setData(
                        [
                            'paymentSuccessful' => false
                        ]
                    );

                    return false;
                }
                
                if (isset($response['paymentIntentId'])) {
                  $result->setData(
                      [
                          'paymentIntentId' => $response['paymentIntentId'],
                          'paymentStatus' => $response['paymentStatus']
                      ]
                  );
                }
                
                return true;

            case ('onSite'):
                if ($paymentAmount &&
                    (
                        $reservation->getLoggedInUser() &&
                        $reservation->getLoggedInUser()->getType() === Entities::CUSTOMER
                    ) &&
                    !$this->isAllowedOnSitePaymentMethod($this->getAvailablePayments($reservation->getBookable()))
                ) {
                    return false;
                }

                return true;

            case ('wc'):
            case ('mollie'):
                return true;
        }

        return false;
    }

    /**
     * @param mixed $intentData
     * @param Payment $payment
     * @param Payment $paymentParent
     * @param Appointment $appointment
     * @param string $newStatus
     */
    public function processCapture($intentData, $payment, $paymentParent, $appointment, $newStatus) {
        /** @var PaymentRepository $paymentRepository */
        $paymentRepository = $this->container->get('domain.payment.repository');

        if ($intentData && $intentData->paymentStatus === PaymentIntent::STATUS_REQUIRES_CAPTURE) {
            $paymentForUpdate = $paymentParent ? $paymentParent : $payment;
            /** @var PaymentIntent $intent */    
            $intent = PaymentIntent::retrieve($intentData->paymentIntentId);
            $intent->capture();
            $intentData->paymentStatus = PaymentIntent::STATUS_SUCCEEDED;
            $paymentForUpdate->setData(new PaymentData(json_encode($intentData)));
            $paymentForUpdate->setStatus(new PaymentStatus(PaymentStatus::PAID));
            
            $paymentRepository->update($paymentForUpdate->getId()->getValue(), $paymentForUpdate);
            
            if ($paymentParent) {
                //Update payment children status to PAID
                $paymentRepository->updateFieldByEntityId($paymentParent->getId()->getValue(), 'parentId', PaymentStatus::PAID, 'status');      
            }
        }
    }

    /**
     * @param mixed $intentData
     * @param Payment $payment
     * @param Payment $paymentParent 
     * @param Appointment $appointment
     * @param string $newStatus
     */
    public function processCancel($intentData, $payment, $paymentParent, $appointment, $newStatus) {
        /** @var PaymentRepository $paymentRepository */
        $paymentRepository = $this->container->get('domain.payment.repository');

        if ($intentData && $intentData->paymentStatus === PaymentIntent::STATUS_REQUIRES_CAPTURE) {
            $paymentForUpdate = $paymentParent ? $paymentParent : $payment;            
            /** @var PaymentIntent $intent */    
            $intent = PaymentIntent::retrieve($intentData->paymentIntentId);
            $intent->cancel();
            $intentData->paymentStatus = PaymentIntent::STATUS_CANCELED;
            $paymentForUpdate->setData(new PaymentData(json_encode($intentData)));
            $paymentForUpdate->setStatus(new PaymentStatus(PaymentStatus::CANCELED));
            
            $paymentRepository->update($paymentForUpdate->getId()->getValue(), $paymentForUpdate);
            
            if ($paymentParent) {
                //Update payment children status to CANCELED
                $paymentRepository->updateFieldByEntityId($paymentParent->getId()->getValue(), 'parentId', PaymentStatus::CANCELED, 'status');      
            }
        }
    }

    /**
     * @param mixed $intentData
     * @param Payment $payment
     * @param Payment $paymentParent 
     * @param Appointment $appointment
     * @param string $newStatus
     */
    public function processRefund($intentData, $payment, $paymentParent, $appointment, $newStatus) {

        if (!$intentData) return;

        /** @var PaymentRepository $paymentRepository */
        $paymentRepository = $this->container->get('domain.payment.repository');
        $now = DateTimeService::getNowDateTimeObject();
        $diff = $now->diff($appointment->getBookingStart()->getValue());
        /** @var int $hours */
        $hours = $diff->h;
        $hours = $hours + ($diff->days*24);
        $appointmentId = $appointment->getId()->getValue();
        $paymentId = $payment->getId()->getValue();
        $customerBookingId = $payment->getCustomerBookingId()->getValue();
        $amount = $payment->getAmount()->getValue();
        $refundAmount = 0;
        if ($newStatus === BookingStatus::REJECTED) {
            $refundAmount = round($amount, 2) * 100;
        }
        elseif ($newStatus === BookingStatus::CANCELED) {
            if ($hours < 24) {
                $refundAmount = 0;
            }
            elseif ($hours < 48) {
                $refundAmount = round($amount - 10, 2) * 100;
            }
            else {
                $refundAmount = round($amount, 2) * 100;
            }
        }

        $paymentStatus = "";
        if ($refundAmount === 0) {
            $intentData->paymentStatus = PaymentIntent::STATUS_CANCELED;
            $paymentStatus = PaymentStatus::CANCELED;
        }
        else {
            $intentData->paymentStatus = 'refunded';
            $paymentStatus = PaymentStatus::REFUNDED;
            Refund::create([
                'payment_intent' => $intentData->paymentIntentId,
                'amount' => $refundAmount,
                'metadata' => [
                    'appointmentId' => $appointmentId,
                    'paymentId' => $paymentId,
                    'customerBookingId' => $customerBookingId,
                    'hours' => $hours,
                ],
            ]);    
        }
        $paymentForUpdate = $paymentParent ? $paymentParent : $payment;            

        $paymentRepository->updateFieldById($paymentForUpdate->getId()->getValue(), json_encode($intentData), 'data');
        $paymentRepository->updateFieldById($paymentId, $paymentStatus, 'status');
    }    

    /**
     * @param Payment $payment
     * @param Appointment $appointment
     * @param string $newStatus
     * @param string $action
     * @return bool
     */
    public function processStripePayment($payment, $appointment, $newStatus, $action) 
    {
      /** @var PaymentRepository $paymentRepository */
      $paymentRepository = $this->container->get('domain.payment.repository');
      $stripeSettings = $this->container->get('domain.settings.service')->getSetting('payments', 'stripe');
      Stripe::setApiKey(
        $stripeSettings['testMode'] === true ? $stripeSettings['testSecretKey'] : $stripeSettings['liveSecretKey']
      );
      $paymentData = null;      
      /** @var Payment $paymentParent  */
      $paymentParent = null;
      $paymentParentId = $payment->getParentId();
      if ($paymentParentId) {
        $parentId = $paymentParentId->getValue();
        $paymentParent = $paymentRepository->getById($parentId);
        $paymentData = $paymentParent->getData() ? $paymentParent->getData()->getValue() : null;         
      }
      else {
        $paymentData = $payment->getData() ? $payment->getData()->getValue() : null;
      }

      $intentData = null;
      if ($paymentData) {
        $intentData = json_decode($paymentData);
      }

      
      $this->{"process$action"}($intentData, $payment, $paymentParent, $appointment, $newStatus);      
      
      return true;
    }
    
    /**
     * @param array $payments
     * @param Appointment $appointment
     * @param string $oldStatus
     * @param string $newStatus
     */
    public function processPaymentsIntent($payments, $appointment, $oldStatus, $newStatus) {
        $action = null;
        if ($oldStatus === BookingStatus::APPROVED &&
            ($newStatus === BookingStatus::REJECTED || $newStatus === BookingStatus::CANCELED)
         ) {
            $action = 'Refund';
        }
        elseif ($oldStatus === BookingStatus::PENDING) {        
            if ($newStatus === BookingStatus::APPROVED) {
                $action = 'Capture';
            }
            elseif ($newStatus === BookingStatus::REJECTED || $newStatus === BookingStatus::CANCELED) {
                $action = 'Refund';
            }
        }
        if (!$action) return;
        
        /** @var Payment $payment */ 
        foreach($payments as $payment) {
            $this->processStripePayment($payment, $appointment, $newStatus, $action);    
        }
    }    

    /**
     * @param AbstractBookable $bookable
     *
     * @return array
     *
     * @throws ContainerValueNotFoundException
     */
    public function getAvailablePayments($bookable)
    {
        /** @var SettingsService $settingsService */
        $settingsService = $this->container->get('domain.settings.service');

        $generalPayments = $settingsService->getCategorySettings('payments');

        if ($bookable->getSettings()) {
            $hasAvailablePayments = false;

            $bookableSettings = json_decode($bookable->getSettings()->getValue(), true);

            if ($generalPayments['onSite'] === true &&
                isset($bookableSettings['payments']['onSite']) &&
                $bookableSettings['payments']['onSite'] === true
            ) {
                $hasAvailablePayments = true;
            }

            if ($generalPayments['payPal']['enabled'] === true &&
                isset($bookableSettings['payments']['payPal']['enabled']) &&
                $bookableSettings['payments']['payPal']['enabled'] === true
            ) {
                $hasAvailablePayments = true;
            }

            if ($generalPayments['stripe']['enabled'] === true &&
                isset($bookableSettings['payments']['stripe']['enabled']) &&
                $bookableSettings['payments']['stripe']['enabled'] === true
            ) {
                $hasAvailablePayments = true;
            }

            if ($generalPayments['mollie']['enabled'] === true &&
                isset($bookableSettings['payments']['mollie']['enabled']) &&
                $bookableSettings['payments']['mollie']['enabled'] === false &&
                $bookableSettings['payments']['onSite'] === true
            ) {
                $hasAvailablePayments = true;
            }

            return $hasAvailablePayments ? $bookableSettings['payments'] : $generalPayments;
        }

        return $generalPayments;
    }

    /**
     * @param array $bookablePayments
     *
     * @return boolean
     *
     * @throws ContainerException
     * @throws \InvalidArgumentException
     * @throws ContainerValueNotFoundException
     */
    public function isAllowedOnSitePaymentMethod($bookablePayments)
    {
        /** @var SettingsService $settingsService */
        $settingsService = $this->container->get('domain.settings.service');

        $payments = $settingsService->getCategorySettings('payments');

        if ($payments['onSite'] === false &&
            (isset($bookablePayments['onSite']) ? $bookablePayments['onSite'] === false : true)
        ) {
            /** @var AbstractUser $user */
            $user = $this->container->get('logged.in.user');

            if ($user === null || $user->getType() === Entities::CUSTOMER) {
                return false;
            }
        }

        return true;
    }

    /**
     * @param Reservation       $reservation
     * @param string            $paymentType
     *
     * @return array
     *
     * @throws ContainerValueNotFoundException
     * @throws \Interop\Container\Exception\ContainerException
     */
    public function getBookingInformationForPaymentSettings($reservation, $paymentType)
    {
        $reservationType = $reservation->getReservation()->getType()->getValue();

        /** @var PlaceholderService $placeholderService */
        $placeholderService = $this->container->get("application.placeholder.{$reservationType}.service");

        /** @var SettingsService $settingsService */
        $settingsService = $this->container->get('domain.settings.service');

        $paymentsSettings = $settingsService->getSetting('payments', $paymentType);

        $setDescription = !empty($paymentsSettings['description']);

        $setMetaData = !empty($paymentsSettings['metaData']);

        $placeholderData = [];

        if ($setDescription || $setMetaData) {
            $reservationData = $reservation->getReservation()->toArray();

            $reservationData['bookings'] = $reservation->getBooking() ? [
                $reservation->getBooking()->getId() ?
                    $reservation->getBooking()->getId()->getValue() : 0 => $reservation->getBooking()->toArray()
            ] : [];

            $reservationData['customer'] = $reservation->getCustomer()->toArray();

            try {
                $placeholderData = $placeholderService->getPlaceholdersData(
                    $reservationData,
                    $reservation->getBooking() && $reservation->getBooking()->getId() ?
                        $reservation->getBooking()->getId()->getValue() : 0,
                    null,
                    $reservation->getCustomer()
                );
            } catch (Exception $e) {
                $placeholderData = [];
            }
        }

        $metaData = [];

        $description = '';

        if ($placeholderData && $setDescription) {
            $description = $placeholderService->applyPlaceholders(
                $paymentsSettings['description'][$reservationType],
                $placeholderData
            );
        }

        if ($placeholderData && $setMetaData) {
            foreach ((array)$paymentsSettings['metaData'][$reservationType] as $metaDataKay => $metaDataValue) {
                $metaData[$metaDataKay] = $placeholderService->applyPlaceholders(
                    $metaDataValue,
                    $placeholderData
                );
            }
        }

        return [
            'description' => $description,
            'metaData'    => $metaData,
        ];
    }

    /**
     * @param Payment $payment
     *
     * @return boolean
     *
     * @throws QueryExecutionException
     * @throws InvalidArgumentException
     */
    public function delete($payment)
    {
        /** @var PaymentRepository $paymentRepository */
        $paymentRepository = $this->container->get('domain.payment.repository');

        /** @var CacheRepository $cacheRepository */
        $cacheRepository = $this->container->get('domain.cache.repository');

        /** @var Collection $followingPayments */
        $followingPayments = $paymentRepository->getByEntityId(
            $payment->getId()->getValue(),
            'parentId'
        );

        /** @var Collection $caches */
        $caches = $cacheRepository->getByEntityId(
            $payment->getId()->getValue(),
            'paymentId'
        );

        /** @var Cache $cache */
        foreach ($caches->getItems() as $cache) {
            /** @var Payment $nextPayment */
            $nextPayment = $followingPayments->length() ? $followingPayments->getItem(0) : null;

            if ($nextPayment) {
                $cacheRepository->updateByEntityId(
                    $payment->getId()->getValue(),
                    $nextPayment->getId()->getValue(),
                    'paymentId'
                );
            } else {
                $cacheRepository->updateFieldById(
                    $cache->getId()->getValue(),
                    null,
                    'paymentId'
                );
            }
        }

        if (!$paymentRepository->delete($payment->getId()->getValue())) {
            return false;
        }

        return true;
    }

    /**
     * @param array $customer
     */
    public function createStripeCustomer($customer) {
        $stripeSettings = $this->container->get('domain.settings.service')->getSetting('payments', 'stripe');
        Stripe::setApiKey(
            $stripeSettings['testMode'] === true ? $stripeSettings['testSecretKey'] : $stripeSettings['liveSecretKey']
        );
        $response = Customer::all([
            'email' => $customer['email'],
            'limit' => 1
        ]);
        if ($response->data && count($response->data) > 0) {
            return $response->data[0]->id;
        }

        /** @var Customer $stripeCustomer */
        $stripeCustomer = Customer::create([
            'email' => $customer['email'],
            'name' => $customer['firstName'] . ' ' . $customer['lastName'],
        ]);
        return $stripeCustomer->id;        
    }

}
