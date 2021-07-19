<?php

namespace AmeliaBooking\Application\Commands\Notification;

use AmeliaBooking\Application\Commands\CommandHandler;
use AmeliaBooking\Application\Commands\CommandResult;
use AmeliaBooking\Application\Services\Booking\AppointmentStatusService;
use AmeliaBooking\Infrastructure\Common\Exceptions\QueryExecutionException;
use AmeliaBooking\Infrastructure\Repository\Notification\NotificationSMSHistoryRepository;
use AmeliaBooking\Infrastructure\Repository\User\UserRepository;
use AmeliaBooking\Domain\Entity\User\AbstractUser;
use AmeliaBooking\Domain\ValueObjects\String\BookingStatus;
use AmeliaBooking\Infrastructure\Common\Exceptions\NotFoundException;

/**
 * Class TwilioSMSWebhookCommandHandler
 *
 * @package AmeliaBooking\Application\Commands\Notification
 */
class TwilioSMSWebhookCommandHandler extends CommandHandler
{
    
    
  public static $providerAppointmentPending = 24;

  /**
   * @param TwilioSMSWebhookCommand $command
   *
   * @return CommandResult
   * @throws QueryExecutionException
   * @throws \Interop\Container\Exception\ContainerException
   */
  public function handle(TwilioSMSWebhookCommand $command)
  {
    $result = new CommandResult();
    $result->setXmlRoot('Response');

    $signtureMessage = "Thank you,\n Player2Player";
    $userPhoneNumber = $command->getField('From');
    $bodyMessage = trim(strtolower($command->getField('Body')));
    $message = null;

    //Validate body message
    if ($bodyMessage !== 'yes' && $bodyMessage !== 'no') {
      $result->setResult(CommandResult::RESULT_SUCCESS);
      $result->setData(['Message' => 'You must reply with YES or NO']);
      return $result;
    }

    /** @var NotificationSMSHistoryRepository $notificationsSMSHistoryRepo */
    $notificationsSMSHistoryRepo = $this->container->get('domain.notificationSMSHistory.repository');
    /** @var UserRepository $userRepo */
    $userRepo = $this->container->get('domain.users.repository');

    /** @var AbstractUser $user */
    $user = $userRepo->findByPhone($userPhoneNumber, AbstractUser::USER_ROLE_PROVIDER);

    if (!$user) {
      $result->setResult(CommandResult::RESULT_SUCCESS);
      $result->setData(['Message' => 'Your phone is not registered']);
      return $result;  
    }

    $criteria = [
      'notificationId' => self::$providerAppointmentPending,
      'phone' => $userPhoneNumber,
    ];
    $changeStatusAppointment = false;   
    try {        
      $notificationData = $notificationsSMSHistoryRepo->getLastNotificationDelivered($criteria);
      $bookingStatus = $notificationData['appointmentStatus'];
      $appointmentId = $notificationData['appointmentId'];
      $changeStatusAppointment = $bookingStatus === BookingStatus::PENDING;
      switch($bookingStatus) {
        case BookingStatus::APPROVED:
          $message = 'Your appointment is already approved';
          break;    
        case BookingStatus::CANCELED:
          $message = 'Your appointment is already canceled';
          break;    
        case BookingStatus::REJECTED:
          $message = 'Your appointment is already rejected';
          break;    
        }
    } catch (NotFoundException $exc) {
      $message = 'You don\'t have any sms message for appointment pending';
    }    

    if ($changeStatusAppointment) {      
      $requestedStatus = $bodyMessage === 'yes' ? BookingStatus::APPROVED : BookingStatus::REJECTED;
      /** @var AppointmentStatusService $appointmentStatusService */
      $appointmentStatusService = $this->container->get('application.booking.appointment.status.service');
      $appointmentResult = $appointmentStatusService->Update($user, $appointmentId, $requestedStatus);
      if ($appointmentResult->getResult() === CommandResult::RESULT_ERROR) {
        $message = $appointmentResult->getMessage();
      } else {
        $message = $requestedStatus === BookingStatus::APPROVED 
          ? 'Your appointment has been approved'
          : 'Your appointment has been rejected';
      }
    }

    $result->setResult(CommandResult::RESULT_SUCCESS);
    $result->setData(['Message' => "Hi {$user->getFullName()},\n $message \n\n{$signtureMessage}"]);

    return $result;
  }

}
