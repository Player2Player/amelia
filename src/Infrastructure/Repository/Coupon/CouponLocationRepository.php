<?php

namespace AmeliaBooking\Infrastructure\Repository\Coupon;

use AmeliaBooking\Domain\Entity\Location\Location;
use AmeliaBooking\Domain\Entity\Coupon\Coupon;
use AmeliaBooking\Infrastructure\Common\Exceptions\QueryExecutionException;
use AmeliaBooking\Infrastructure\Repository\AbstractRepository;

/**
 * Class CouponLocationRepository
 *
 * @package AmeliaBooking\Infrastructure\Repository\Coupon
 */
class CouponLocationRepository extends AbstractRepository
{

    /**
     * @param Coupon  $coupon
     * @param Location $location
     *
     * @return mixed
     * @throws QueryExecutionException
     */
    public function add(Coupon $coupon, Location $location)
    {
        $couponData = $coupon->toArray();
        $locationData = $location->toArray();

        $params = [
            ':couponId'  => $couponData['id'],
            ':locationId' => $locationData['id'],
        ];

        try {
            $statement = $this->connection->prepare(
                "INSERT INTO {$this->table} 
                (
                `couponId`,
                `locationId`
                )
                VALUES (
                :couponId, 
                :locationId
                )"
            );

            $res = $statement->execute($params);
            if (!$res) {
                throw new QueryExecutionException('Unable to add data in ' . __CLASS__);
            }

            return $this->connection->lastInsertId();
        } catch (\Exception $e) {
            throw new QueryExecutionException('Unable to add data in ' . __CLASS__, $e->getCode(), $e);
        }
    }

    /**
     * @param int $couponId
     * @param int $locationId
     *
     * @return mixed
     * @throws QueryExecutionException
     */
    public function deleteForLocation($couponId, $locationId)
    {
        $params = [
            ':couponId'  => $couponId,
            ':locationId' => $locationId,
        ];

        try {
            $statement = $this->connection->prepare(
                "DELETE FROM {$this->table} WHERE couponId = :couponId AND locationId = :locationId"
            );

            return $statement->execute($params);
        } catch (\Exception $e) {
            throw new QueryExecutionException('Unable to delete data from ' . __CLASS__, $e->getCode(), $e);
        }
    }
}
