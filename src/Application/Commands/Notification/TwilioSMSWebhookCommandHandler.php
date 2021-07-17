<?php

namespace AmeliaBooking\Application\Commands\Notification;

use AmeliaBooking\Application\Commands\CommandHandler;
use AmeliaBooking\Application\Commands\CommandResult;
use AmeliaBooking\Infrastructure\Common\Exceptions\QueryExecutionException;

/**
 * Class TwilioSMSWebhookCommandHandler
 *
 * @package AmeliaBooking\Application\Commands\Notification
 */
class TwilioSMSWebhookCommandHandler extends CommandHandler
{
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

        $data = $command->getFields();
        $message = 'Your appointment is approved with text ' . $data['Body'];

        $result->setResult(CommandResult::RESULT_SUCCESS);
        $result->setMessage('Successfully updated SMS notification history.');
        $result->setData(['Message' => $message]);

        return $result;
    }
}
