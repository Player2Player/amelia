<?php

namespace AmeliaBooking\Application\Commands\Booking\Appointment;

use AmeliaBooking\Application\Commands\CommandHandler;
use AmeliaBooking\Application\Commands\CommandResult;
use AmeliaBooking\Application\Common\Exceptions\AccessDeniedException;
use AmeliaBooking\Application\Services\Bookable\BookableApplicationService;
use AmeliaBooking\Application\Services\Booking\AppointmentApplicationService;
use AmeliaBooking\Application\Services\Booking\BookingApplicationService;
use AmeliaBooking\Application\Services\CustomField\CustomFieldApplicationService;
use AmeliaBooking\Application\Services\Payment\PaymentApplicationService;
use AmeliaBooking\Application\Services\User\UserApplicationService;
use AmeliaBooking\Domain\Collection\Collection;
use AmeliaBooking\Domain\Common\Exceptions\AuthorizationException;
use AmeliaBooking\Domain\Common\Exceptions\InvalidArgumentException;
use AmeliaBooking\Domain\Entity\Bookable\Service\Service;
use AmeliaBooking\Domain\Entity\Booking\Appointment\Appointment;
use AmeliaBooking\Domain\Entity\Booking\Appointment\CustomerBooking;
use AmeliaBooking\Domain\Entity\Entities;
use AmeliaBooking\Domain\Entity\User\AbstractUser;
use AmeliaBooking\Domain\Factory\Booking\Appointment\CustomerBookingFactory;
use AmeliaBooking\Domain\Services\Settings\SettingsService;
use AmeliaBooking\Domain\ValueObjects\BooleanValueObject;
use AmeliaBooking\Infrastructure\Common\Exceptions\NotFoundException;
use AmeliaBooking\Infrastructure\Common\Exceptions\QueryExecutionException;
use AmeliaBooking\Infrastructure\Repository\Booking\Appointment\AppointmentRepository;
use AmeliaBooking\Infrastructure\Repository\User\ProviderRepository;
use AmeliaBooking\Infrastructure\Services\Zoom\ZoomService;
use AmeliaBooking\Infrastructure\WP\Translations\FrontendStrings;
use Exception;
use Interop\Container\Exception\ContainerException;

/**
 * Class UpdateAppointmentCommandHandler
 *
 * @package AmeliaBooking\Application\Commands\Booking\Appointment
 */
class UpdateAppointmentCommandHandler extends CommandHandler
{
    /**
     * @var array
     */
    public $mandatoryFields = [
        'bookings',
        'bookingStart',
        'notifyParticipants',
        'serviceId',
        'providerId',
        'id'
    ];

    /**
     * @param UpdateAppointmentCommand $command
     *
     * @return CommandResult
     * @throws AccessDeniedException
     * @throws InvalidArgumentException
     * @throws QueryExecutionException
     * @throws NotFoundException
     * @throws ContainerException
     * @throws Exception
     */
    public function handle(UpdateAppointmentCommand $command)
    {
        $result = new CommandResult();

        $this->checkMandatoryFields($command);

        /** @var AppointmentRepository $appointmentRepo */
        $appointmentRepo = $this->container->get('domain.booking.appointment.repository');
        /** @var AppointmentApplicationService $appointmentAS */
        $appointmentAS = $this->container->get('application.booking.appointment.service');
        /** @var BookingApplicationService $bookingAS */
        $bookingAS = $this->container->get('application.booking.booking.service');
        /** @var BookableApplicationService $bookableAS */
        $bookableAS = $this->container->get('application.bookable.service');
        /** @var CustomFieldApplicationService $customFieldService */
        $customFieldService = $this->container->get('application.customField.service');
        /** @var ZoomService $zoomService */
        $zoomService = $this->container->get('infrastructure.zoom.service');
        /** @var UserApplicationService $userAS */
        $userAS = $this->getContainer()->get('application.user.service');
        /** @var SettingsService $settingsDS */
        $settingsDS = $this->container->get('domain.settings.service');
        /** @var PaymentApplicationService $paymentAS */
        $paymentAS = $this->container->get('application.payment.service');
        /** @var ProviderRepository $providerRepository */
        $providerRepository = $this->container->get('domain.users.providers.repository');

        try {
            /** @var AbstractUser $user */
            $user = $userAS->authorization(
                $command->getPage() === 'cabinet' ? $command->getToken() : null,
                $command->getCabinetType()
            );
        } catch (AuthorizationException $e) {
            $result->setResult(CommandResult::RESULT_ERROR);
            $result->setData(
                [
                    'reauthorize' => true
                ]
            );

            return $result;
        }

        if ($userAS->isProvider($user) && !$settingsDS->getSetting('roles', 'allowWriteAppointments')) {
            throw new AccessDeniedException('You are not allowed to update appointment');
        }

        /** @var Service $service */
        $service = $bookableAS->getAppointmentService(
            $command->getFields()['serviceId'],
            $command->getFields()['providerId']
        );

        $appointmentData = $command->getFields();

        $appointmentAS->convertTime($appointmentData);

        /** @var Appointment $appointment */
        $appointment = $appointmentAS->build($appointmentData, $service);

        /** @var Appointment $oldAppointment */
        $oldAppointment = $appointmentRepo->getById($appointment->getId()->getValue());

        $payments = [];
        /** @var CustomerBooking $newBooking */
        foreach ($appointment->getBookings()->getItems() as $newBooking) {
            /** @var CustomerBooking $oldBooking */
            foreach ($oldAppointment->getBookings()->getItems() as $oldBooking) {
                foreach($oldBooking->getPayments()->getItems() as $key => $payment) {
                    if (!array_key_exists($key, $payments)) {
                      $payments += [ $key => $payment];
                    }
                }    
                if ($newBooking->getId() &&
                    $newBooking->getId()->getValue() === $oldBooking->getId()->getValue()
                ) {
                    if ($oldBooking->getUtcOffset()) {
                        $newBooking->setUtcOffset($oldBooking->getUtcOffset());
                    }

                    if ($oldBooking->getInfo()) {
                        $newBooking->setInfo($oldBooking->getInfo());
                    }
                }
            }
        }

        $appointmentEmployeeChanged = null;

        $appointmentZoomUserChanged = false;

        $appointmentZoomUsersLicenced = false;

        if ($appointment->getProviderId()->getValue() !== $oldAppointment->getProviderId()->getValue()) {
            $appointmentEmployeeChanged = $oldAppointment->getProviderId()->getValue();

            $provider = $providerRepository->getById($appointment->getProviderId()->getValue());

            $oldProvider = $providerRepository->getById($oldAppointment->getProviderId()->getValue());

            if ($provider && $oldProvider && $provider->getZoomUserId() && $oldProvider->getZoomUserId() &&
                $provider->getZoomUserId()->getValue() !== $oldProvider->getZoomUserId()->getValue()) {
                $appointmentZoomUserChanged = true;

                $zoomUserType = 0;

                $zoomOldUserType = 0;

                $zoomResult = $zoomService->getUsers();

                if (!(isset($zoomResult['code']) && $zoomResult['code'] === 124) &&
                    !($zoomResult['users'] === null && isset($zoomResult['message']))) {
                    $zoomUsers = $zoomResult['users'];
                    foreach ($zoomUsers as $key => $val) {
                        if ($val['id'] === $provider->getZoomUserId()->getValue()) {
                            $zoomUserType = $val['type'];
                        }
                        if ($val['id'] === $oldProvider->getZoomUserId()->getValue()) {
                            $zoomOldUserType = $val['type'];
                        }
                    }
                }
                if ($zoomOldUserType > 1 && $zoomUserType > 1) {
                    $appointmentZoomUsersLicenced = true;
                }
            }
        }

        if ($oldAppointment->getZoomMeeting()) {
            $appointment->setZoomMeeting($oldAppointment->getZoomMeeting());
        }

        if ($bookingAS->isBookingApprovedOrPending($appointment->getStatus()->getValue()) &&
            $bookingAS->isBookingCanceledOrRejected($oldAppointment->getStatus()->getValue())
        ) {
            /** @var AbstractUser $user */
            $user = $this->container->get('logged.in.user');

            if (!$appointmentAS->canBeBooked($appointment, $userAS->isCustomer($user))) {
                $result->setResult(CommandResult::RESULT_ERROR);
                $result->setMessage(FrontendStrings::getCommonStrings()['time_slot_unavailable']);
                $result->setData(
                    [
                        'timeSlotUnavailable' => true
                    ]
                );

                return $result;
            }
        }

        $appointment->setGoogleCalendarEventId($oldAppointment->getGoogleCalendarEventId());
        $appointment->setOutlookCalendarEventId($oldAppointment->getOutlookCalendarEventId());

        $appointmentRepo->beginTransaction();

        /** @var Collection $removedBookings */
        $removedBookings = new Collection();

        foreach ($command->getField('removedBookings') as $removedBookingData) {
            $removedBookings->addItem(CustomerBookingFactory::create($removedBookingData), $removedBookingData['id']);
        }

        try {
            $appointmentAS->update(
                $oldAppointment,
                $appointment,
                $removedBookings,
                $service,
                $command->getField('payment')
            );
            $paymentAS->processPaymentsIntent($payments, $oldAppointment, $oldAppointment->getStatus()->getValue(), $appointment->getStatus()->getValue());
        } catch (QueryExecutionException $e) {
            $appointmentRepo->rollback();
            throw $e;
        }

        $appointmentRepo->commit();

        $appointmentStatusChanged = $appointmentAS->isAppointmentStatusChanged($appointment, $oldAppointment);

        $appRescheduled = $appointmentAS->isAppointmentRescheduled($appointment, $oldAppointment);

        if ($appRescheduled) {
            $appointment->setRescheduled(new BooleanValueObject(true));
        }

        $appointmentArray = $appointment->toArray();

        $oldAppointmentArray = $oldAppointment->toArray();

        $bookingsWithChangedStatus = $bookingAS->getBookingsWithChangedStatus($appointmentArray, $oldAppointmentArray);

        $result->setResult(CommandResult::RESULT_SUCCESS);
        $result->setMessage('Successfully updated appointment');
        $result->setData(
            [
            Entities::APPOINTMENT       => $appointmentArray,
                'appointmentStatusChanged'  => $appointmentStatusChanged,
                'appointmentRescheduled'    => $appRescheduled,
                'bookingsWithChangedStatus' => $bookingsWithChangedStatus,
                'appointmentEmployeeChanged'=> $appointmentEmployeeChanged,
                'appointmentZoomUserChanged'=> $appointmentZoomUserChanged,
                'appointmentZoomUsersLicenced'=> $appointmentZoomUsersLicenced
            ]
        );

        $customFieldService->deleteUploadedFilesForDeletedBookings(
            $appointment->getBookings(),
            $oldAppointment->getBookings()
        );

        return $result;
    }
}
