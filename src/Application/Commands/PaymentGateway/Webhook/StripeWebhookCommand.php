<?php

namespace AmeliaBooking\Application\Commands\PaymentGateway\Webhook;

use AmeliaBooking\Application\Commands\Command;

/**
 * Class StripeWebhookCommand
 *
 * @package AmeliaBooking\Application\Commands\PaymentGateway\Webhook
 */
class StripeWebhookCommand extends Command
{
  private $signature;
  private $rawBody;

  public function getSignature() {
    return $this->signature;
  } 

  public function setSignature($signature) {
    $this->signature = $signature;
  } 

  public function getRawBody() {
    return $this->rawBody;
  } 

  public function setRawBody($rawBody) {
    $this->rawBody = $rawBody;
  }
}
