<?php

namespace AmeliaBooking\Application\Controller\PaymentGateway\Webhook;

use AmeliaBooking\Application\Commands\PaymentGateway\Webhook\StripeWebhookCommand;
use AmeliaBooking\Application\Controller\Controller;
use Slim\Http\Request;

/**
 * Class StripeWebhookController
 *
 * @package AmeliaBooking\Application\Controller\PaymentGateway\Webhook
 */
class StripeWebhookController extends Controller
{
  
    /**
     * Instantiates the Stripe Webhook command to hand it over to the Command Handler
     *
     * @param Request $request
     * @param         $args
     *
     * @return StripeWebhookCommand
     */
    protected function instantiateCommand(Request $request, $args)
    {
        $command = new StripeWebhookCommand($args);
        $signature = $request->getHeaderLine('stripe-signature');
        $rawBody = (string)$request->getBody();
        
        $requestBody = $request->getParsedBody();
        $this->setCommandFields($command, $requestBody);

        $command->setSignature($signature);
        $command->setRawBody($rawBody);

        return $command;
    }
}
