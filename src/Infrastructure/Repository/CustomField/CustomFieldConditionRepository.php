<?php
/**
 * @copyright © TMS-Plugins. All rights reserved.
 * @licence   See LICENCE.md for license details.
 */

namespace AmeliaBooking\Infrastructure\Repository\CustomField;

use AmeliaBooking\Domain\Entity\CustomField\CustomFieldCondition;
use AmeliaBooking\Domain\Factory\CustomField\CustomFieldConditionFactory;
use AmeliaBooking\Domain\Repository\CustomField\CustomFieldConditionRepositoryInterface;
use AmeliaBooking\Infrastructure\Repository\AbstractRepository;
use AmeliaBooking\Infrastructure\Common\Exceptions\QueryExecutionException;

/**
 * Class CustomFieldConditionRepository
 *
 * @package AmeliaBooking\Infrastructure\Repository\CustomField
 */
class CustomFieldConditionRepository extends AbstractRepository implements CustomFieldConditionRepositoryInterface
{

    const FACTORY = CustomFieldConditionFactory::class;

    /**
     * @param CustomFieldCondition $entity
     *
     * @return bool
     * @throws QueryExecutionException
     */
    public function add($entity)
    {
        $data = $entity->toArray();

        $params = [
            ':customFieldId'          => $data['customFieldId'],
            ':customFieldCondition'   => $data['customFieldCondition'],
            ':operator'               => $data['operator'],
            ':value'                  => $data['value'],
        ];

        try {
            $statement = $this->connection->prepare(
                "INSERT INTO
                {$this->table}
                (
                `customFieldId`, `customFieldCondition`, `operator`, `value`
                ) VALUES (
                :customFieldId, :customFieldCondition, :operator, :value
                )"
            );


            $response = $statement->execute($params);
        } catch (\Exception $e) {
            throw new QueryExecutionException('Unable to add data in ' . __CLASS__, $e->getCode(), $e);
        }

        if (!$response) {
            throw new QueryExecutionException('Unable to add data in ' . __CLASS__);
        }

        return $this->connection->lastInsertId();
    }

    /**
     * @param int                  $id
     * @param CustomFieldCondition $entity
     *
     * @return bool
     * @throws QueryExecutionException
     */
    public function update($id, $entity)
    {
        $data = $entity->toArray();

        $params = [
          ':customFieldId'          => $data['customFieldId'],
          ':customFieldCondition'   => $data['customFieldCondition'],
          ':operator'               => $data['operator'],
          ':value'                  => $data['value'],
          ':id'                     => $id,
        ];

        try {
            $statement = $this->connection->prepare(
                "UPDATE {$this->table}
                SET
                `customFieldId`         = :customFieldId,
                `customFieldCondition`  = :customFieldCondition,
                `operator`              = :operator,
                `value`                 = :value
                WHERE
                id = :id"
            );

            $response = $statement->execute($params);
        } catch (\Exception $e) {
            throw new QueryExecutionException('Unable to save data in ' . __CLASS__, $e->getCode(), $e);
        }

        if (!$response) {
            throw new QueryExecutionException('Unable to save data in ' . __CLASS__);
        }

        return $response;
    }
}
