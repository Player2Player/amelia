<?php
/**
 * @copyright © TMS-Plugins. All rights reserved.
 * @licence   See LICENCE.md for license details.
 */

namespace AmeliaBooking\Application\Commands\Coupon;

use AmeliaBooking\Application\Commands\CommandHandler;
use AmeliaBooking\Application\Commands\CommandResult;
use AmeliaBooking\Application\Services\Coupon\CouponApplicationService;
use AmeliaBooking\Domain\Collection\Collection;
use AmeliaBooking\Domain\Common\Exceptions\CouponInvalidException;
use AmeliaBooking\Domain\Common\Exceptions\CouponUnknownException;
use AmeliaBooking\Domain\Common\Exceptions\InvalidArgumentException;
use AmeliaBooking\Domain\Entity\Coupon\Coupon;
use AmeliaBooking\Domain\Entity\Entities;

/**
 * Class GetAutoApplyCouponCommandHandler
 *
 * @package AmeliaBooking\Application\Commands\Coupon
 */
class GetAutoApplyCouponCommandHandler extends CommandHandler
{
    public $mandatoryFields = [
        'id',
        'type'
    ];

    /**
     * @param GetAutoApplyCouponCommand $command
     *
     * @return CommandResult
     * @throws \Slim\Exception\ContainerValueNotFoundException
     * @throws InvalidArgumentException
     * @throws \Interop\Container\Exception\ContainerException
     * @throws \AmeliaBooking\Infrastructure\Common\Exceptions\QueryExecutionException
     */
    public function handle(GetAutoApplyCouponCommand $command)
    {
        $result = new CommandResult();

        $this->checkMandatoryFields($command);

        /** @var CouponApplicationService $couponAS */
        $couponAS = $this->container->get('application.coupon.service');

        try {
            /** @var Coupon $coupon */
            $coupon = $couponAS->getAutoApplyCoupon(
                $command->getField('id'),
                $command->getField('type')
            );

            $coupon->setServiceList(new Collection());
            $coupon->setEventList(new Collection());
        } catch (CouponUnknownException $e) {
            $result->setResult(CommandResult::RESULT_ERROR);
            $result->setMessage($e->getMessage());
            $result->setData([
                'couponUnknown' => true
            ]);

            return $result;
        } catch (CouponInvalidException $e) {
            $result->setResult(CommandResult::RESULT_ERROR);
            $result->setMessage($e->getMessage());
            $result->setData([
                'couponInvalid' => true
            ]);

            return $result;
        }

        if ($result->getResult() !== CommandResult::RESULT_ERROR) {
            $result->setResult(CommandResult::RESULT_SUCCESS);
            $result->setMessage('Successfully retrieved coupon.');
            $result->setData(
                [
                    Entities::COUPON => $coupon->toArray()
                ]
            );
        }

        return $result;
    }
}
