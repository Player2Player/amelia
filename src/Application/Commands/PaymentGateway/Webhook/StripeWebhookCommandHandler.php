<?php

namespace AmeliaBooking\Application\Commands\PaymentGateway\Webhook;

use AmeliaBooking\Application\Commands\CommandHandler;
use AmeliaBooking\Infrastructure\Repository\Payment\StripeLogRepository;
use AmeliaBooking\Application\Commands\CommandResult;
use AmeliaBooking\Infrastructure\Common\Exceptions\QueryExecutionException;
use AmeliaBooking\Domain\Services\Notification\MailServiceInterface;
use AmeliaBooking\Domain\Services\Settings\SettingsService;
use AmeliaBooking\Application\Common\Exceptions\AccessDeniedException;
use AmeliaStripe\Webhook;
use AmeliaStripe\Stripe;
use AmeliaStripe\StripeObject;
use AmeliaStripe\Error\SignatureVerification;
use AmeliaStripe\Event;

/**
 * Class StripeWebhookCommandHandler
 *
 * @package AmeliaBooking\Application\Commands\PaymentGateway\Webhook
 */
class StripeWebhookCommandHandler extends CommandHandler
{
        
  
  protected $stripeOptions;
  
  /**
   * @param StripeWebhookCommand $command
   *
   * @return CommandResult
   * @throws QueryExecutionException
   * @throws \Interop\Container\Exception\ContainerException
   */
  public function handle(StripeWebhookCommand $command)
  {    
    if (empty($command->getSignature())) 
      throw new AccessDeniedException("You are not allowed to execute this endpoint");
    
    $result = new CommandResult();
    $event = null;
    /** @var SettingsService $settingsService */
    $settingsService = $this->container->get('domain.settings.service');
    $stripeSettings = $settingsService->getSetting('payments', 'stripe');
    $options = $settingsService->getCategorySettings('p2p');
    
    if (!$options || !isset($options['stripe'])) 
      throw new \Exception("Must setup option stripe in p2p_settings json string");
    
    $this->stripeOptions = $options['stripe'];
    $endpointSecret = $this->stripeOptions['webhook'];
    Stripe::setApiKey(
        $stripeSettings['testMode'] === true ? $stripeSettings['testSecretKey'] : $stripeSettings['liveSecretKey']
    );
    
    try {
      $event = Webhook::constructEvent(
          $command->getRawBody(), 
          $command->getSignature(),
          $endpointSecret
      );
    }
    catch(\UnexpectedValueException $e) {
        // Invalid payload
        $result->setResult(CommandResult::RESULT_ERROR);
        $result->setMessage('Invalid payload');
        return $result;
    }
    catch(SignatureVerification $e) {
        // Invalid signature
        $result->setResult(CommandResult::RESULT_ERROR);
        $result->setMessage('Invalid signature');
        return $result;
    }

    // Handle the event
    switch ($event->type) {
      case Event::PAYMENT_INTENT_PAYMENT_FAILED:
        $this->handlePaymentIntentFailed($event);
        break;
      default:
        $this->handleEvent($event);
    }

    $result->setResult(CommandResult::RESULT_SUCCESS);
    $result->setMessage('Webhook executed successfully');

    return $result;
  }

  protected function handlePaymentIntentFailed($event) {
    $this->addEvent($event);
    $object = $event->data->object;
    $emailData = $this->stripeOptions['paymentFailed'];
    $amount = round($object->amount / 100, 2);
    $metadata = $this->serializeToUl($object->metadata, 'No metadata');    
    $paymentError = $this->serializeToUl($object->last_payment_error, 'No error detail');
    $content = str_replace("%description%", $object->description ?: 'No description', $emailData['template']);
    $content = str_replace("%metadata%", $metadata, $content);
    $content = str_replace("%error%", $paymentError, $content);
    $content = str_replace("%amount%", $amount, $content);
    /** @var MailServiceInterface $mailService */
    $mailService = $this->getContainer()->get('infrastructure.mail.service');
    $mailService->send(
      $emailData['to'],
      $emailData['subject'],
      $content,
      $emailData['bcc']
    );
  }

  protected function handleEvent($event) {
    $this->addEvent($event);
  }

  protected function addEvent($event) { 
    /** @var StripeLogRepository */
    $repository = $this->container->get('domain.stripeLog.repository');
    $object = $event->data->object;
    $data = [];
    $data['eventId'] = $event->id;
    $data['eventType'] = $event->type;
    $data['objectId'] = $object->id;
    $data['objectType'] = $object->object;
    $data['description'] = $object->description;
    $data['metadata'] = json_encode($object->metadata);
    $data['amount'] = round($object->amount / 100, 2);
    $data['paymentError'] = $object->last_payment_error ? json_encode($object->last_payment_error)  : null;
    $repository->add($data);
  }

  
  /**
   * @param StripeObject $data
   * 
   * @return String 
   */
  protected function serializeToUl($data, $emptyText = '') {
    $ul = '';
    if (!($data instanceof StripeObject) || count($data) == 0) return $emptyText;
    
    $this->toUl($data, $ul);
    return $ul;
  }
  
  /**
   * @param StripeObject $data
   * 
   */
  private function toUl($data, &$ul) {
    if ($data instanceof StripeObject || is_array($data)) {
      $ul .= '<ul>';
      $arrData = $data instanceof StripeObject ? $data->jsonSerialize() : $data;
      foreach($arrData as $key => $value) {
        $ul .= "<li>$key: ";
        $this->toUl($value, $ul);
      }
      $ul .= '</ul>';
    }
    else {
      $ul .= "$data</li>";
    }
  }

}
