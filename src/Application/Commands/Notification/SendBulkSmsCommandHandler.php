<?php

namespace AmeliaBooking\Application\Commands\Notification;

use AmeliaBooking\Application\Commands\CommandHandler;
use AmeliaBooking\Domain\Services\DateTime\DateTimeService;
use AmeliaBooking\Application\Commands\CommandResult;
use AmeliaBooking\Infrastructure\Common\Exceptions\QueryExecutionException;
use AmeliaBooking\Infrastructure\Repository\Notification\NotificationLogRepository;
use AmeliaBooking\Infrastructure\Repository\Notification\NotificationSMSHistoryRepository;
use AmeliaBooking\Infrastructure\Repository\User\CustomerRepository;
use AmeliaBooking\Application\Services\Placeholder\EventPlaceholderService;
use AmeliaBooking\Infrastructure\Repository\Notification\NotificationRepository;
use AmeliaBooking\Infrastructure\Repository\Booking\Event\EventRepository;
use AmeliaBooking\Application\Services\Notification\TwilioAPIService;
use Interop\Container\Exception\ContainerException;
use AmeliaBooking\Domain\ValueObjects\String\NotificationType;

/**
 * Class SendBulkSmsCommandHandler
 *
 * @package AmeliaBooking\Application\Commands\Notification
 */
class SendBulkSmsCommandHandler extends CommandHandler
{
    /**
     * @param SendBulkSmsCommand $command
     *
     * @return CommandResult
     *
     * @throws \Interop\Container\Exception\ContainerException
     */
    public function handle(SendBulkSmsCommand $command)
    {
        $result = new CommandResult();

        $apiResponse = null;

        $userIds = $command->getField('customers');
        $eventId = $command->getField('eventId');

        /** @var NotificationRepository $notificationRepo */
        $notificationRepo = $this->container->get('domain.notification.repository');
        /** @var CustomerRepository $customersRepo  */
        $customersRepo = $this->container->get('domain.users.customers.repository');
        /** @var NotificationSMSHistoryRepository $notificationsSMSHistoryRepo */
        $notificationsSMSHistoryRepo = $this->container->get('domain.notificationSMSHistory.repository');
        /** @var NotificationLogRepository $notificationLogRepo */
        $notificationLogRepo = $this->container->get('domain.notificationLog.repository');
        
        /** 
         * Replace amelia sms api service with custom account twilio apiservice
         * @var TwilioAPIService $smsApiService 
        */
        $smsApiService = $this->container->get('application.twilioApi.service');

        /** @var EventPlaceholderService $placeholderService */
        $placeholderService = $this->container->get('application.placeholder.event.service');

        $eventNotificationData = $placeholderService->getCompanyData();
        $notification = $notificationRepo->getByNameAndType('p2p_customer_event', NotificationType::SMS);        
        
        if ($eventId) {
          /** @var EventRepository $eventRepo */
          $eventRepo = $this->container->get('domain.booking.event.repository');
          $event = $eventRepo->getById($eventId)->toArray();
          $eventData = $placeholderService->getEventData($event, null, null, NotificationType::SMS);
          $eventNotificationData += $eventData;
        }

        $criteria = [
          'ignoredBookings' => true,
          'customers' => $userIds,
        ];
        $customers = $customersRepo->getFiltered($criteria);

        foreach($customers as $customerArray) {
          $data = [
            'customer_email'      => $customerArray['email'],
            'customer_first_name' => $customerArray['firstName'],
            'customer_last_name'  => $customerArray['lastName'],
            'customer_full_name'  => $customerArray['firstName'] . ' ' . $customerArray['lastName'],
            'customer_phone'      => $customerArray['phone'],
            'customer_id'         => $customerArray['id'],
          ];
          
          $data += $eventNotificationData;
          $text = $placeholderService->applyPlaceholders(
            $notification->getContent()->getValue(),
            $data
          );
          if (!$data['customer_phone']) continue;

          try {
            $historyId = $notificationsSMSHistoryRepo->add([
                'notificationId' => $notification->getId()->getValue(),
                'userId'         => $data['customer_id'],
                'appointmentId'  => null,
                'text'           => $text,
                'phone'          => $data['customer_phone'],
                'alphaSenderId'  => '',
            ]);

            $apiResponse = $smsApiService->send(
                $data['customer_phone'],
                $text,
                AMELIA_ACTION_URL . '/notifications/sms/history/' . $historyId
            );

            if ($apiResponse->status === 'OK') {
                $notificationsSMSHistoryRepo->update($historyId, [
                    'logId'    => $apiResponse->message->logId,
                    'status'   => $apiResponse->message->status,
                    'price'    => $apiResponse->message->price,
                    'dateTime' => DateTimeService::getNowDateTimeInUtc(),
                    'segments' => $apiResponse->message->segments
                ]);

                $notificationLogRepo->add($notification, $customerArray['id']);
            }
            } catch (QueryExecutionException $e) {
            } catch (ContainerException $e) {
          }
        }

        $result->setResult(CommandResult::RESULT_SUCCESS);
        $result->setMessage('Amelia SMS API request successful');

        return $result;
    }
}
