<?php
/**
 * @copyright © TMS-Plugins. All rights reserved.
 * @licence   See LICENCE.md for license details.
 */

namespace AmeliaBooking\Application\Services\Notification;

use AmeliaBooking\Application\Services\Booking\BookingApplicationService;
use AmeliaBooking\Domain\Collection\Collection;
use AmeliaBooking\Domain\Common\Exceptions\InvalidArgumentException;
use AmeliaBooking\Domain\Entity\Booking\Event\Event;
use AmeliaBooking\Domain\Entity\Booking\Event\EventPeriod;
use AmeliaBooking\Domain\Entity\Entities;
use AmeliaBooking\Domain\Entity\Notification\Notification;
use AmeliaBooking\Domain\Services\DateTime\DateTimeService;
use AmeliaBooking\Domain\ValueObjects\String\NotificationStatus;
use AmeliaBooking\Domain\ValueObjects\String\NotificationType;
use AmeliaBooking\Infrastructure\Common\Container;
use AmeliaBooking\Infrastructure\Common\Exceptions\NotFoundException;
use AmeliaBooking\Infrastructure\Common\Exceptions\QueryExecutionException;
use AmeliaBooking\Infrastructure\Repository\Notification\NotificationLogRepository;
use AmeliaBooking\Infrastructure\Repository\Notification\NotificationRepository;
use Exception;
use Interop\Container\Exception\ContainerException;
use Slim\Exception\ContainerValueNotFoundException;

/**
 * Class AbstractNotificationService
 *
 * @package AmeliaBooking\Application\Services\Notification
 */
abstract class AbstractNotificationService
{
    /** @var Container */
    protected $container;

    /** @var string */
    protected $type;

    /**
     * ProviderApplicationService constructor.
     *
     * @param Container $container
     * @param string    $type
     */
    public function __construct(Container $container, $type)
    {
        $this->container = $container;

        $this->type = $type;
    }

    /**
     * @param array        $appointmentArray
     * @param Notification $notification
     * @param bool         $logNotification
     * @param null         $bookingKey
     *
     * @return mixed
     */
    abstract public function sendNotification(
        $appointmentArray,
        $notification,
        $logNotification,
        $bookingKey = null
    );


    /**
     * @throws NotFoundException
     * @throws QueryExecutionException
     * @throws InvalidArgumentException
     * @throws ContainerException
     * @throws Exception
     */
    abstract public function sendBirthdayGreetingNotifications();

    /**
     *
     * @param string $name
     * @param string $type
     *
     * @return mixed
     *
     * @throws QueryExecutionException
     */
    public function getByNameAndType($name, $type)
    {
        /** @var NotificationRepository $notificationRepo */
        $notificationRepo = $this->container->get('domain.notification.repository');

        return $notificationRepo->getByNameAndType($name, $type);
    }

    /**
     * @param array $appointmentArray
     * @param bool  $forcedStatusChange - True when appointment status is changed to 'pending' because minimum capacity
     * condition is not satisfied
     * @param bool  $logNotification
     *
     * @throws ContainerValueNotFoundException
     * @throws QueryExecutionException
     */
    public function sendAppointmentStatusNotifications($appointmentArray, $forcedStatusChange, $logNotification)
    {
        /** @var BookingApplicationService $bookingAS */
        $bookingAS = $this->container->get('application.booking.booking.service');

        $recurringPrefix = array_key_exists('recurring', $appointmentArray)
          && count($appointmentArray['recurring']) > 0 ? "_recurring" : "";

        // Notify provider
        /** @var Notification $providerNotification */
        $providerNotification = $this->getByNameAndType(
            "provider_{$appointmentArray['type']}_{$appointmentArray['status']}{$recurringPrefix}",
            $this->type
        );

        if ($providerNotification && $providerNotification->getStatus()->getValue() === NotificationStatus::ENABLED) {
            $this->sendNotification(
                $appointmentArray,
                $providerNotification,
                $logNotification
            );
        }

        // Notify customers
        if ($appointmentArray['notifyParticipants']) {

            /** @var Notification $customerNotification */
            $customerNotification = $this->getByNameAndType(
                "customer_{$appointmentArray['type']}_{$appointmentArray['status']}{$recurringPrefix}",
                $this->type
            );

            if ($customerNotification->getStatus()->getValue() === NotificationStatus::ENABLED) {
                // If appointment status is changed to 'pending' because minimum capacity condition is not satisfied,
                // return all 'approved' bookings and send them notification that appointment is now 'pending'.
                if ($forcedStatusChange === true) {
                    $appointmentArray['bookings'] = $bookingAS->filterApprovedBookings($appointmentArray['bookings']);
                }

                // Notify each customer from customer bookings
                foreach (array_keys($appointmentArray['bookings']) as $bookingKey) {
                    if (!$appointmentArray['bookings'][$bookingKey]['isChangedStatus'] ||
                        (
                            isset($appointmentArray['bookings'][$bookingKey]['skipNotification']) &&
                            $appointmentArray['bookings'][$bookingKey]['skipNotification']
                        )
                    ) {
                        continue;
                    }

                    $this->sendNotification(
                        $appointmentArray,
                        $customerNotification,
                        $logNotification,
                        $bookingKey
                    );
                }
            }
        }
    }

    /**
     * @param array $appointmentArray
     * @param array $bookingsArray
     * @param bool  $forcedStatusChange
     *
     * @throws QueryExecutionException
     */
    public function sendAppointmentEditedNotifications($appointmentArray, $bookingsArray, $forcedStatusChange)
    {
        /** @var BookingApplicationService $bookingAS */
        $bookingAS = $this->container->get('application.booking.booking.service');

        // Notify customers
        if ($appointmentArray['notifyParticipants']) {
            // If appointment status is 'pending', remove all 'approved' bookings because they can't receive
            // notification that booking is 'approved' until appointment status is changed to 'approved'
            if ($appointmentArray['status'] === 'pending') {
                $bookingsArray = $bookingAS->removeBookingsByStatuses($bookingsArray, ['approved']);
            }

            // If appointment status is changed, because minimum capacity condition is satisfied or not,
            // remove all 'approved' bookings because notification is already sent to them.
            if ($forcedStatusChange === true) {
                $bookingsArray = $bookingAS->removeBookingsByStatuses($bookingsArray, ['approved']);
            }

            if (!$appointmentArray['employee_changed']) {
                $appointmentArray['bookings'] = $bookingsArray;
            }

            foreach (array_keys($appointmentArray['bookings']) as $bookingKey) {
                /** @var Notification $customerNotification */
                $customerNotification =
                    $this->getByNameAndType(
                        "customer_appointment_{$appointmentArray['bookings'][$bookingKey]['status']}",
                        $this->type
                    );

                if ($customerNotification->getStatus()->getValue() === NotificationStatus::ENABLED) {
                    if (!$appointmentArray['bookings'][$bookingKey]['isChangedStatus'] &&
                        !$appointmentArray['employee_changed']
                    ) {
                        continue;
                    }

                    $this->sendNotification(
                        $appointmentArray,
                        $customerNotification,
                        true,
                        $bookingKey
                    );

                    if ($appointmentArray['employee_changed']) {
                        // Notify provider
                        /** @var Notification $providerNotification */
                        $providerNotification = $this->getByNameAndType(
                            "provider_{$appointmentArray['type']}_rescheduled",
                            $this->type
                        );

                        if ($providerNotification->getStatus()->getValue() === NotificationStatus::ENABLED) {
                            $this->sendNotification(
                                $appointmentArray,
                                $providerNotification,
                                true
                            );
                        }
                    }
                }
            }
        }
    }

    /**
     * @param $appointmentArray
     *
     * @throws QueryExecutionException
     */
    public function sendAppointmentRescheduleNotifications($appointmentArray)
    {
        // Notify customers
        if ($appointmentArray['notifyParticipants']) {

            /** @var Notification $customerNotification */
            $customerNotification = $this->getByNameAndType(
                "customer_{$appointmentArray['type']}_rescheduled",
                $this->type
            );

            if ($customerNotification->getStatus()->getValue() === NotificationStatus::ENABLED) {
                // Notify each customer from customer bookings
                foreach (array_keys($appointmentArray['bookings']) as $bookingKey) {
                    $this->sendNotification(
                        $appointmentArray,
                        $customerNotification,
                        true,
                        $bookingKey
                    );
                }
            }
        }

        // Notify provider
        /** @var Notification $providerNotification */
        $providerNotification = $this->getByNameAndType(
            "provider_{$appointmentArray['type']}_rescheduled",
            $this->type
        );

        if ($providerNotification->getStatus()->getValue() === NotificationStatus::ENABLED) {
            $this->sendNotification(
                $appointmentArray,
                $providerNotification,
                true
            );
        }
    }

    /**
     * @param array $appointmentArray
     * @param array $bookingArray
     * @param bool  $logNotification
     *
     * @throws QueryExecutionException
     */
    public function sendBookingAddedNotifications($appointmentArray, $bookingArray, $logNotification)
    {
      
      $recurringPrefix = array_key_exists('recurring', $appointmentArray)
        && count($appointmentArray['recurring']) > 0 ? "_recurring" : "";

      /** @var Notification $customerNotification */
        $customerNotification = $this->getByNameAndType(
            "customer_{$appointmentArray['type']}_{$appointmentArray['status']}{$recurringPrefix}",
            $this->type
        );

        if ($customerNotification->getStatus()->getValue() === NotificationStatus::ENABLED) {
            // Notify customer that scheduled the appointment
            $this->sendNotification(
                $appointmentArray,
                $customerNotification,
                $logNotification,
                array_search($bookingArray['id'], array_column($appointmentArray['bookings'], 'id'), true)
            );
        }

        // Notify provider
        /** @var Notification $providerNotification */
        $providerNotification =
            $this->getByNameAndType("provider_{$appointmentArray['type']}_{$appointmentArray['status']}{$recurringPrefix}", $this->type);

        if ($providerNotification && $providerNotification->getStatus()->getValue() === NotificationStatus::ENABLED) {
            $this->sendNotification(
                $appointmentArray,
                $providerNotification,
                $logNotification
            );
        }
    }

    /**
     * Notify the customer when he change his booking status.
     *
     * @param $appointmentArray
     * @param $bookingArray
     *
     * @throws QueryExecutionException
     */
    public function sendCustomerBookingNotification($appointmentArray, $bookingArray)
    {
        // Notify customers
        if ($appointmentArray['notifyParticipants']) {

            /** @var Notification $customerNotification */
            $customerNotification =
                $this->getByNameAndType("customer_{$appointmentArray['type']}_{$bookingArray['status']}", $this->type);

            if ($customerNotification->getStatus()->getValue() === NotificationStatus::ENABLED) {
                // Notify customer
                $bookingKey = array_search(
                    $bookingArray['id'],
                    array_column($appointmentArray['bookings'], 'id'),
                    true
                );

                $this->sendNotification(
                    $appointmentArray,
                    $customerNotification,
                    true,
                    $bookingKey
                );
            }
        }
    }

    /**
     * Notify the provider when he customer cancel event booking.
     *
     * @param $eventArray
     * @param $bookingArray
     *
     * @throws QueryExecutionException
     */
    public function sendProviderEventCancelledNotification($eventArray, $bookingArray)
    {
        /** @var Notification $providerNotification */
        $providerNotification = $this->getByNameAndType(
            "provider_event_canceled",
            $this->type
        );

        $eventArray['bookings'] = [$bookingArray];

        if ($providerNotification && $providerNotification->getStatus()->getValue() === NotificationStatus::ENABLED) {
            $this->sendNotification(
                $eventArray,
                $providerNotification,
                false,
                null
            );
        }
    }

    /**
     * Returns an array of next day reminder notifications that have to be sent to customers with cron
     *
     * @param string $entityType
     *
     * @return void
     * @throws QueryExecutionException
     * @throws InvalidArgumentException
     * @throws Exception
     */
    public function sendNextDayReminderNotifications($entityType)
    {
        /** @var NotificationLogRepository $notificationLogRepo */
        $notificationLogRepo = $this->container->get('domain.notificationLog.repository');

        /** @var Notification $customerNotification */
        $customerNotification = $this->getByNameAndType("customer_{$entityType}_next_day_reminder", $this->type);

        $reservations = new Collection();

        // Check if notification is enabled and it is time to send notification
        if ($customerNotification->getStatus()->getValue() === NotificationStatus::ENABLED &&
            DateTimeService::getNowDateTimeObject() >=
            DateTimeService::getCustomDateTimeObject($customerNotification->getTime()->getValue())
        ) {
            switch ($entityType) {
                case Entities::APPOINTMENT:
                    $reservations = $notificationLogRepo->getCustomersNextDayAppointments($this->type);

                    break;
                case Entities::EVENT:
                    $reservations = $notificationLogRepo->getCustomersNextDayEvents($this->type);

                    break;
            }

            $this->sendBookingsNotifications($customerNotification, $reservations);
        }

        /** @var Notification $providerNotification */
        $providerNotification = $this->getByNameAndType("provider_{$entityType}_next_day_reminder", $this->type);

        // Check if notification is enabled and it is time to send notification
        if ($providerNotification->getStatus()->getValue() === NotificationStatus::ENABLED &&
            DateTimeService::getNowDateTimeObject() >=
            DateTimeService::getCustomDateTimeObject($providerNotification->getTime()->getValue())
        ) {
            switch ($entityType) {
                case Entities::APPOINTMENT:
                    $reservations = $notificationLogRepo->getProvidersNextDayAppointments($this->type);

                    break;
                case Entities::EVENT:
                    $reservations = $notificationLogRepo->getProvidersNextDayEvents($this->type);

                    break;
            }

            foreach ((array)$reservations->toArray() as $reservationArray) {
                $this->sendNotification(
                    $reservationArray,
                    $providerNotification,
                    true
                );
            }
        }
    }

    /**
     * @param string $entityType
     *
     * @throws QueryExecutionException
     * @throws InvalidArgumentException
     */
    public function sendFollowUpNotifications($entityType)
    {
        /** @var Notification $notification */
        $notification = $this->getByNameAndType("customer_{$entityType}_follow_up", $this->type);

        if ($notification->getStatus()->getValue() === NotificationStatus::ENABLED) {
            /** @var NotificationLogRepository $notificationLogRepo */
            $notificationLogRepo = $this->container->get('domain.notificationLog.repository');

            $reservations = new Collection();

            switch ($entityType) {
                case Entities::APPOINTMENT:
                    $reservations = $notificationLogRepo->getFollowUpAppointments($notification);

                    break;
                case Entities::EVENT:
                    $reservations = $notificationLogRepo->getFollowUpEvents($notification);

                    $currentDateTime = DateTimeService::getNowDateTimeObject();
                    $lastPossibleNotificationMoment = DateTimeService::getNowDateTimeObject();

                    /** @var Event $event */
                    foreach ($reservations->getItems() as $eventKey => $event) {
                        $periodsPassedCount = 0;

                        /** @var EventPeriod $period */
                        foreach ($event->getPeriods()->getItems() as $periodKey => $period) {
                            $afterPeriodEndDateTime = DateTimeService::getCustomDateTimeObject(
                                $period->getPeriodEnd()->getValue()->format('Y-m-d H:i:s')
                            )->modify("+{$notification->getTimeAfter()->getValue()} seconds");

                            $lastPossibleNotificationMoment = DateTimeService::getCustomDateTimeObject(
                                $period->getPeriodEnd()->getValue()->format('Y-m-d H:i:s')
                            )->modify('+172800 seconds');

                            if ($currentDateTime > $afterPeriodEndDateTime) {
                                $periodsPassedCount++;
                            }
                        }

                        if ($currentDateTime > $lastPossibleNotificationMoment ||
                            $event->getPeriods()->length() !== $periodsPassedCount
                        ) {
                            $reservations->deleteItem($eventKey);
                        }
                    }

                    break;
            }

            $this->sendBookingsNotifications($notification, $reservations);
        }
    }

    /**
     * Send passed notification for all passed bookings and save log in the database
     *
     * @param Notification $notification
     * @param Collection   $appointments
     */
    private function sendBookingsNotifications($notification, $appointments)
    {
        /** @var array $appointmentArray */
        foreach ($appointments->toArray() as $appointmentArray) {
            // Notify each customer from customer bookings
            foreach (array_keys($appointmentArray['bookings']) as $bookingKey) {
                $this->sendNotification(
                    $appointmentArray,
                    $notification,
                    true,
                    $bookingKey
                );
            }
        }
    }

    /**
     * @param array  $data
     * @param bool   $logNotification
     *
     * @throws QueryExecutionException
     */
    public function sendPackagePurchasedNotifications($data, $logNotification)
    {
        /** @var Notification $customerNotification */
        $customerNotification = $this->getByNameAndType(
            "customer_package_purchased",
            $this->type
        );

        $data['isForCustomer'] = true;

        if ($customerNotification->getStatus()->getValue() === NotificationStatus::ENABLED) {
            $this->sendNotification(
                $data,
                $customerNotification,
                $logNotification
            );
        }

        /** @var Notification $providerNotification */
        $providerNotification = $this->getByNameAndType(
            "provider_package_purchased",
            $this->type
        );

        $data['isForCustomer'] = false;

        if ($providerNotification->getStatus()->getValue() === NotificationStatus::ENABLED) {
            $this->sendNotification(
                $data,
                $providerNotification,
                $logNotification
            );
        }
    }

    /**
     * Get User info for notification
     *
     * @param string $userType
     * @param array  $entityData
     * @param int    $bookingKey
     * @param array  $emailData
     *
     * @return array
     */
    protected function getUsersInfo($userType, $entityData, $bookingKey, $emailData)
    {
        $usersInfo = [];

        switch ($userType) {
            case (Entities::CUSTOMER):
                switch ($entityData['type']) {
                    case (Entities::APPOINTMENT):
                    case (Entities::EVENT):
                        if ($bookingKey !== null) {
                            $usersInfo[$entityData['bookings'][$bookingKey]['customerId']] = [
                                'id'    => $entityData['bookings'][$bookingKey]['customerId'],
                                'email' => $emailData['customer_email'],
                                'phone' => $emailData['customer_phone']
                            ];
                        }

                        break;

                    case (Entities::PACKAGE):
                        $usersInfo[$entityData['customer']['id']] = [
                            'id'    => $entityData['customer']['id'],
                            'email' => $entityData['customer']['email'],
                            'phone' => $entityData['customer']['phone']
                        ];

                        break;
                }


                break;

            case (Entities::PROVIDER):
                switch ($entityData['type']) {
                    case (Entities::APPOINTMENT):
                        $usersInfo[$entityData['providerId']] = [
                            'id'    => $entityData['providerId'],
                            'email' => $emailData['employee_email'],
                            'phone' => $emailData['employee_phone']
                        ];

                        break;

                    case (Entities::EVENT):
                        foreach ((array)$entityData['providers'] as $provider) {
                            $usersInfo[$provider['id']] = [
                                'id'    => $provider['id'],
                                'email' => $provider['email'],
                                'phone' => $provider['phone']
                            ];
                        }

                        break;

                    case (Entities::PACKAGE):
                        foreach ($entityData['recurring'] as $reservation) {
                            $usersInfo[$reservation['appointment']['provider']['id']] = [
                                'id'    => $reservation['appointment']['provider']['id'],
                                'email' => $reservation['appointment']['provider']['email'],
                                'phone' => $reservation['appointment']['provider']['phone']
                            ];
                        }

                        break;
                }

                break;
        }

        return $usersInfo;
    }
}
