<?php

namespace AmeliaBooking\Application\Controller\Coupon;

use AmeliaBooking\Application\Commands\Coupon\GetAutoApplyCouponCommand;
use AmeliaBooking\Application\Controller\Controller;
use Slim\Http\Request;

/**
 * Class GetAutoApplyCouponController
 *
 * @package AmeliaBooking\Application\Controller\Coupon
 */
class GetAutoApplyCouponController extends Controller
{
    /**
     * Fields for coupon that can be received from front-end
     *
     * @var array
     */
    public $allowedFields = [
        'id',
        'type',
        'count'
    ];

    /**
     * Instantiates the Get Coupon command to hand it over to the Command Handler
     *
     * @param Request $request
     * @param         $args
     *
     * @return mixed
     * @throws \RuntimeException
     */
    protected function instantiateCommand(Request $request, $args)
    {
        $command = new GetAutoApplyCouponCommand($args);

        $requestBody = $request->getParsedBody();
        $this->setCommandFields($command, $requestBody);

        return $command;
    }
}
