<?php

namespace AmeliaBooking\Application\Commands\Booking\Appointment;

use AmeliaBooking\Application\Commands\CommandHandler;
use AmeliaBooking\Application\Commands\CommandResult;
use AmeliaBooking\Application\Common\Exceptions\AccessDeniedException;
use AmeliaBooking\Application\Services\Booking\AppointmentApplicationService;
use AmeliaBooking\Application\Services\Booking\BookingApplicationService;
use AmeliaBooking\Application\Services\User\UserApplicationService;
use AmeliaBooking\Domain\Common\Exceptions\InvalidArgumentException;
use AmeliaBooking\Domain\Entity\Booking\Appointment\Appointment;
use AmeliaBooking\Domain\Entity\Booking\Appointment\CustomerBooking;
use AmeliaBooking\Domain\Entity\Entities;
use AmeliaBooking\Domain\Entity\Payment\Payment;
use AmeliaBooking\Domain\Entity\User\AbstractUser;
use AmeliaBooking\Domain\ValueObjects\String\BookingStatus;
use AmeliaBooking\Infrastructure\Common\Exceptions\QueryExecutionException;
use AmeliaBooking\Infrastructure\Repository\Booking\Appointment\AppointmentRepository;
use AmeliaBooking\Infrastructure\Repository\Booking\Appointment\CustomerBookingRepository;
use AmeliaBooking\Infrastructure\WP\Translations\BackendStrings;
use AmeliaBooking\Infrastructure\WP\Translations\FrontendStrings;
use AmeliaBooking\Application\Services\Payment\PaymentApplicationService;
use Interop\Container\Exception\ContainerException;

/**
 * Class UpdateAppointmentStatusCommandHandler
 *
 * @package AmeliaBooking\Application\Commands\Booking\Appointment
 */
class UpdateAppointmentStatusCommandHandler extends CommandHandler
{
    /**
     * @var array
     */
    public $mandatoryFields = [
        'status'
    ];

    /**
     * @param UpdateAppointmentStatusCommand $command
     *
     * @return CommandResult
     *
     * @throws AccessDeniedException
     * @throws InvalidArgumentException
     * @throws QueryExecutionException
     * @throws ContainerException
     */
    public function handle(UpdateAppointmentStatusCommand $command)
    {
        if (!$this->getContainer()->getPermissionsService()->currentUserCanWriteStatus(Entities::APPOINTMENTS)) {
            throw new AccessDeniedException('You are not allowed to update appointment status');
        }

        $result = new CommandResult();

        $this->checkMandatoryFields($command);

        /** @var CustomerBookingRepository $bookingRepository */
        $bookingRepository = $this->container->get('domain.booking.customerBooking.repository');
        /** @var AppointmentRepository $appointmentRepo */
        $appointmentRepo = $this->container->get('domain.booking.appointment.repository');
        /** @var BookingApplicationService $bookingAS */
        $bookingAS = $this->container->get('application.booking.booking.service');
        /** @var UserApplicationService $userAS */
        $userAS = $this->getContainer()->get('application.user.service');
        /** @var AppointmentApplicationService $appointmentAS */
        $appointmentAS = $this->container->get('application.booking.appointment.service');
        /** @var PaymentApplicationService $paymentAS */
        $paymentAS = $this->container->get('application.payment.service');


        $appointmentId = (int)$command->getArg('id');
        $requestedStatus = $command->getField('status');

        /** @var Appointment $appointment */
        $appointment = $appointmentRepo->getById($appointmentId);
        $oldStatus = $appointment->getStatus()->getValue();

        if ($bookingAS->isBookingApprovedOrPending($requestedStatus) &&
            $bookingAS->isBookingCanceledOrRejected($oldStatus)
        ) {
            /** @var AbstractUser $user */
            $user = $this->container->get('logged.in.user');

            if (!$appointmentAS->canBeBooked($appointment, $userAS->isCustomer($user))) {
                $result->setResult(CommandResult::RESULT_ERROR);
                $result->setMessage(FrontendStrings::getCommonStrings()['time_slot_unavailable']);
                $result->setData([
                    'timeSlotUnavailable' => true,
                    'status'              => $oldStatus
                ]);

                return $result;
            }
        }

        $oldAppointmentArray = $appointment->toArray();
        $payments = [];
        /** @var CustomerBooking $booking */        
        foreach ($appointment->getBookings()->getItems() as $booking) {
            $booking->setStatus(new BookingStatus($requestedStatus));
            foreach($booking->getPayments()->getItems() as $key => $payment) {
              if (!array_key_exists($key, $payments)) {
                $payments += [ $key => $payment];
              }
            }                        
        }

        $appointment->setStatus(new BookingStatus($requestedStatus));

        $appointmentRepo->beginTransaction();

        try {
            $bookingRepository->updateStatusByAppointmentId($appointmentId, $requestedStatus);
            $appointmentRepo->updateStatusById($appointmentId, $requestedStatus);

            if ($oldStatus === BookingStatus::PENDING && $requestedStatus === BookingStatus::APPROVED) {
              /** @var Payment $payment */ 
              foreach($payments as $payment) {
                $paymentAS->processPaymentCapture($payment);
              }
            }

        } catch (QueryExecutionException $e) {
            $appointmentRepo->rollback();
            throw $e;
        }

        $appointmentRepo->commit();

        $appointmentArray = $appointment->toArray();
        $bookingsWithChangedStatus = $bookingAS->getBookingsWithChangedStatus($appointmentArray, $oldAppointmentArray);

        $result->setResult(CommandResult::RESULT_SUCCESS);
        $result->setMessage('Successfully updated appointment status');
        $result->setData([
            Entities::APPOINTMENT       => $appointmentArray,
            'bookingsWithChangedStatus' => $bookingsWithChangedStatus,
            'status'                    => $requestedStatus,
            'oldStatus'                 => $oldStatus,
            'message'                   =>
                BackendStrings::getAppointmentStrings()['appointment_status_changed'] . $requestedStatus
        ]);

        return $result;
    }
}
