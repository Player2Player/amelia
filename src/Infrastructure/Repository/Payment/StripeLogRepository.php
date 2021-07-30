<?php

namespace AmeliaBooking\Infrastructure\Repository\Payment;

use AmeliaBooking\Infrastructure\Repository\AbstractRepository;
use AmeliaBooking\Infrastructure\Common\Exceptions\QueryExecutionException;
use AmeliaBooking\Domain\Services\DateTime\DateTimeService;

class StripeLogRepository extends AbstractRepository 
{

    /**
     * @param $data
     *
     * @return int
     *
     * @throws QueryExecutionException
     * @throws \Exception
     */
    public function add($data)
    {
        $params = [
            ':eventId'            => $data['eventId'],
            ':eventType'          => $data['eventType'],
            ':createdAt'          => DateTimeService::getNowDateTime(),
            ':objectId'           => $data['objectId'],
            ':objectType'         => $data['objectType'],
            ':description'        => $data['description'],
            ':metadata'           => $data['metadata'],
            ':amount'             => $data['amount'],
            ':paymentError'       => $data['paymentError']
        ];

        try {
            $statement = $this->connection->prepare(
                "INSERT INTO {$this->table} 
                (
                    `eventId`,
                    `eventType`,
                    `createdAt`,
                    `objectId`,
                    `objectType`,
                    `description`,
                    `metadata`,
                    `amount`,
                    `paymentError`
                )
                VALUES 
                (
                    :eventId,
                    :eventType,
                    :createdAt,
                    :objectId,
                    :objectType,
                    :description,
                    :metadata,
                    :amount,
                    :paymentError
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
}