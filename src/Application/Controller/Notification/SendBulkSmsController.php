<?php

namespace AmeliaBooking\Application\Controller\Notification;

use AmeliaBooking\Application\Commands\Notification\SendBulkSmsCommand;
use AmeliaBooking\Application\Controller\Controller;
use Slim\Http\Request;

/**
 * Class SendBulkSmsController
 *
 * @package AmeliaBooking\Application\Controller\Notification
 */
class SendBulkSmsController extends Controller
{
    /**
     * Fields for SMS Bulk that can be received from front-end
     *
     * @var array
     */
    protected $allowedFields = [
        'customers',
        'eventId'
    ];

    /**
     * Instantiates the Send Amelia SMS API Request command to hand it over to the Command Handler
     *
     * @param Request $request
     * @param         $args
     *
     * @return SendBulkSmsCommand
     */
    protected function instantiateCommand(Request $request, $args)
    {
        $command = new SendBulkSmsCommand($args);
        $requestBody = $request->getParsedBody();
        $this->setCommandFields($command, $requestBody);

        return $command;
    }
}
