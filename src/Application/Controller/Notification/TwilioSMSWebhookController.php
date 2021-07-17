<?php

namespace AmeliaBooking\Application\Controller\Notification;

use AmeliaBooking\Application\Commands\Notification\TwilioSMSWebhookCommand;
use AmeliaBooking\Application\Controller\Controller;
use Slim\Http\Request;

/**
 * Class TwilioSMSWebhookController
 *
 * @package AmeliaBooking\Application\Controller\Notification
 */
class TwilioSMSWebhookController extends Controller
{
  
    /**
     * @var array
    */
    protected $allowedFields = [
      'MessageSid',
      'MessagingServiceSid',
      'AccountSid',
      'From',
      'To',
      'Body'
    ];

    /**
     * Instantiates the Twilio SMS Webhook command to hand it over to the Command Handler
     *
     * @param Request $request
     * @param         $args
     *
     * @return TwilioSMSWebhookCommand
     */
    protected function instantiateCommand(Request $request, $args)
    {
        $command = new TwilioSMSWebhookCommand($args);
        $requestBody = $request->getParsedBody();
        $this->setCommandFields($command, $requestBody);

        return $command;
    }
}
