<?php

namespace AmeliaBooking\Application\Commands\Notification;

use AmeliaBooking\Application\Commands\CommandHandler;
use AmeliaBooking\Application\Commands\CommandResult;
use AmeliaBooking\Application\Services\Notification\SMSAPIService;
use AmeliaBooking\Application\Services\Notification\TwilioAPIService;

/**
 * Class SendAmeliaSmsApiRequestCommandHandler
 *
 * @package AmeliaBooking\Application\Commands\Notification
 */
class SendAmeliaSmsApiRequestCommandHandler extends CommandHandler
{
    /**
     * @param SendAmeliaSmsApiRequestCommand $command
     *
     * @return CommandResult
     *
     * @throws \Interop\Container\Exception\ContainerException
     */
    public function handle(SendAmeliaSmsApiRequestCommand $command)
    {
        $result = new CommandResult();

        /** @var SMSAPIService $smsApiService */
        $smsApiService = $this->getContainer()->get('application.smsApi.service');

        $apiResponse = null;

        // Call test notification with twilio
        if ($command->getField('action') === 'testNotification') {
          /** @var TwilioAPIService $twilioApiService */
          $twilioApiService = $this->getContainer()->get('application.twilioApi.service');
          $apiResponse = $twilioApiService->testNotification($command->getField('data'));  
        }
        else {
          // Call method dynamically and pass data to the function. Method name is the request field.
          $apiResponse = $smsApiService->{$command->getField('action')}($command->getField('data'));
        }
        $result->setResult(CommandResult::RESULT_SUCCESS);
        $result->setMessage('Amelia SMS API request successful');
        $result->setData($apiResponse);

        return $result;
    }
}
