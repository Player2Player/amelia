<?php
/**
 * @copyright © TMS-Plugins. All rights reserved.
 * @licence   See LICENCE.md for license details.
 */

namespace AmeliaBooking\Infrastructure\Services\Payment;

use AmeliaBooking\Domain\Services\Payment\AbstractPaymentService;
use AmeliaBooking\Domain\Services\Payment\PaymentServiceInterface;
use AmeliaStripe\PaymentIntent;
use AmeliaStripe\Stripe;

/**
 * Class StripeService
 */
class StripeService extends AbstractPaymentService implements PaymentServiceInterface
{
    /**
     * @param array $data
     *
     * @return mixed
     * @throws \Exception
     */
    public function execute($data)
    {
        $stripeSettings = $this->settingsService->getSetting('payments', 'stripe');
        // TODO: Add manual capture option on stripe payment setting
        // $manualCapture = $stripeSettings['manualCapture'];
        $manualCapture = $data['manualCapture'];
        
        Stripe::setApiKey(
            $stripeSettings['testMode'] === true ? $stripeSettings['testSecretKey'] : $stripeSettings['liveSecretKey']
        );

        $intent = null;

        if ($data['paymentMethodId']) {
            $stripeData = [
                'payment_method'      => $data['paymentMethodId'],
                'amount'              => $data['amount'],
                'currency'            => $this->settingsService->getCategorySettings('payments')['currency'],
                'confirmation_method' => 'manual',
                'confirm'             => true,
            ];

            if ($manualCapture) {
                $stripeData['capture_method'] = 'manual';
            }

            if ($data['metaData']) {
                $stripeData['metadata'] = $data['metaData'];
            }

            if ($data['description']) {
                $stripeData['description'] = $data['description'];
            }

            if ($data['customer']) {
                $stripeData['customer'] = $data['customer'];
            }            

            $intent = PaymentIntent::create($stripeData);
        }

        if ($data['paymentIntentId']) {
            $intent = PaymentIntent::retrieve(
                $data['paymentIntentId']
            );

            $intent->confirm();
        }

        $response = null;

        if ($intent && ($intent->status === 'requires_action' || $intent->status === 'requires_source_action') && $intent->next_action->type === 'use_stripe_sdk') {
            $response = [
                'requiresAction'            => true,
                'paymentIntentClientSecret' => $intent->client_secret
            ];
        } else if ($intent && ($intent->status === 'succeeded' || ($manualCapture && $intent->status === 'requires_capture'))) {
            $response = [
              'paymentSuccessful' => true,
              'paymentIntentId' => $intent->id,
              'paymentStatus' => $intent->status              
            ];
        } else {
            $response = [
                'paymentSuccessful' => false
            ];
        }

        return $response;
    }
}
