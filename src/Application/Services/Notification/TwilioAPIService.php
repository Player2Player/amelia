<?php

namespace AmeliaBooking\Application\Services\Notification;

use AmeliaBooking\Application\Services\Placeholder\PlaceholderService;
use AmeliaBooking\Domain\Services\Settings\SettingsService;
use AmeliaBooking\Domain\ValueObjects\String\NotificationSendTo;
use AmeliaBooking\Infrastructure\Common\Container;
use AmeliaBooking\Infrastructure\Common\Exceptions\QueryExecutionException;
use Interop\Container\Exception\ContainerException;

/**
 * Class TwilioAPIService
 *
 * @package AmeliaBooking\Application\Services\Notification
 */
class TwilioAPIService
{
    /** @var string */
    const STATUS_STRING_OK = 'OK';

    /** @var Container */
    private $container;

    /** @var String */
    private $account;

    /** @var String */
    private $authToken;

    /** @var String */
    private $from;

    /**
     * ProviderApplicationService constructor.
     *
     * @param Container $container
     *
     * @throws \InvalidArgumentException
     */
    public function __construct(Container $container)
    {
        $this->container = $container;
        $options = json_decode(get_option('p2p_settings'));
        $this->account = $options->twilio->user;
        $this->authToken = $options->twilio->auth;
        $this->from = $options->twilio->from;
    }

    /**
     * @param $route
     * @param $authorize
     * @param $data
     *
     * @return mixed
     */
    public function sendRequest($data)
    {
        $ch = curl_init("https://api.twilio.com/2010-04-01/Accounts/{$this->account}/Messages.json");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 0);

        // If there is data, request will be POST request, otherwise it will be GET
        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        }

        $authorization = "Authorization: Basic {$this->authToken}";
        $contentType = 'Content-Type: application/x-www-form-urlencoded';
        curl_setopt($ch, CURLOPT_HTTPHEADER, [$authorization, $contentType]);
        
        $response = curl_exec($ch);

        if (curl_errno($ch)) {
            $error = curl_error($ch);
            $errorNo = curl_errno($ch);
            $errorStr = curl_strerror(curl_errno($ch));
            curl_close($ch);
            return ['status' => null, 'error' => [$errorNo, $errorStr, $error]];
        }

        curl_close($ch);
        return json_decode($response);
    }

    /**
     * @param $to
     * @param $body
     * @param $callbackUrl
     *
     * @return mixed
     */
    public function send($to, $body, $callbackUrl)
    {
        $data = [
            'To'          => $to,
            'From'        => $this->from,
            'Body'        => $body,
            'StatusCallback' => $callbackUrl
        ];

        return $this->sendRequest($data);
    }

    /**
     * @param $data
     *
     * @return mixed
     *
     * @throws QueryExecutionException
     * @throws ContainerException
     */
    public function testNotification($data)
    {
        /** @var SettingsService $settingsService */
        $settingsService = $this->container->get('domain.settings.service');

        /** @var EmailNotificationService $notificationService */
        $notificationService = $this->container->get('application.emailNotification.service');

        /** @var PlaceholderService $placeholderService */
        $placeholderService = $this->container->get("application.placeholder.{$data['type']}.service");

        $appointmentsSettings = $settingsService->getCategorySettings('appointments');

        $notification = $notificationService->getByNameAndType($data['notificationTemplate'], 'sms');

        $dummyData = $placeholderService->getPlaceholdersDummyData('sms');

        $isForCustomer = $notification->getSendTo()->getValue() === NotificationSendTo::CUSTOMER;
        $placeholderStringRec = 'recurring' . 'Placeholders' . ($isForCustomer ? 'Customer' : '') . 'Sms';
        $placeholderStringPack = 'package' . 'Placeholders' . ($isForCustomer ? 'Customer' : '') . 'Sms';

        $dummyData['recurring_appointments_details'] = $placeholderService->applyPlaceholders($appointmentsSettings[$placeholderStringRec], $dummyData);
        $dummyData['package_appointments_details']   =  $placeholderService->applyPlaceholders($appointmentsSettings[$placeholderStringPack], $dummyData);


        $body = $placeholderService->applyPlaceholders(
            $notification->getContent()->getValue(),
            $dummyData
        );

        $data = [
            'To'   => $data['recipientPhone'],
            'From' => $this->from,
            'Body' => $body
        ];

        return $this->sendRequest($data);
    }

}
