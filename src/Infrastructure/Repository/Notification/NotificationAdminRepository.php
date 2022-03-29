<?php

namespace AmeliaBooking\Infrastructure\Repository\Notification;

use AmeliaBooking\Domain\Entity\Notification\NotificationAdmin;
use AmeliaBooking\Domain\Factory\Notification\NotificationAdminFactory;
use AmeliaBooking\Infrastructure\Common\Exceptions\QueryExecutionException;
use AmeliaBooking\Infrastructure\Repository\AbstractRepository;
use AmeliaBooking\Domain\Collection\Collection;
use AmeliaBooking\Infrastructure\Connection;

/**
 * Class NotificationAdminRepository
 *
 * @package AmeliaBooking\Infrastructure\Repository\Notification
 */
class NotificationAdminRepository extends AbstractRepository
{

    const FACTORY = NotificationAdminFactory::class;

    /**
     * @var string $wpUserTable
     */
    protected $wpUserTable;


    public function __construct(
        Connection $connection,
        string $table,
        string $wpUserTable
    ) {
        parent::__construct($connection, $table);

        $this->wpUserTable = $wpUserTable;
    }

    /**
     * @param NotificationAdmin $entity
     *
     * @return bool|mixed
     * @throws QueryExecutionException
     */
    public function add(NotificationAdmin $entity)
    {
        $data = $entity->toArray();

        $params = [
            ':locationId'   => $data['locationId'],
            ':wpUserId'     => $data['wpUserId'],
            ':isAdmin'      => $data['isAdmin'],
        ];

        try {
            $statement = $this->connection->prepare(
                "INSERT INTO {$this->table} 
                (`locationId`, `wpUserId`, `isAdmin`)
                VALUES (:locationId, :wpUserId, :isAdmin)"
            );

            $res = $statement->execute($params);
            if (!$res) {
                throw new QueryExecutionException('Unable to add data in ' . __CLASS__);
            }

            return $res;
        } catch (\Exception $e) {
            throw new QueryExecutionException('Unable to add data in ' . __CLASS__, $e->getCode(), $e);
        }
    }

    /**
     * @param int          $id
     * @param NotificationAdmin $entity
     *
     * @return mixed
     * @throws QueryExecutionException
     */
    public function update(int $id, NotificationAdmin $entity)
    {
        $data = $entity->toArray();

        $params = [
            ':locationId'   => $data['locationId'],
            ':wpUserId'     => $data['wpUserId'],
            ':isAdmin'      => $data['isAdmin'],
            ':id'           => $id,
        ];

        try {
            $statement = $this->connection->prepare(
                "UPDATE {$this->table} SET 
                `locationId` = :locationId,
                `wpUserId` = :wpUserId,
                `isAdmin` = :isAdmin
                WHERE id = :id"
            );

            $res = $statement->execute($params);

            if (!$res) {
                throw new QueryExecutionException('Unable to save data in ' . __CLASS__);
            }

            return $res;
        } catch (\Exception $e) {
            throw new QueryExecutionException('Unable to save data in ' . __CLASS__, $e->getCode(), $e);
        }
    }

    /**
     * @param int $locationId
     *
     * @return Collection
     * @throws QueryExecutionException
     */
    public function getByLocation(int $locationId)
    {
        try {
            $statement = $this->connection->prepare(
                "SELECT *, wpu.user_email as wpUserEmail FROM {$this->table}  
                    INNER JOIN {$this->wpUserTable} wpu ON 
                        {$this->table}.wpUserId = wpu.ID
                    WHERE {$this->table}.locationId = :locationId OR {$this->table}.isAdmin = :isAdmin
                "
            );

            $params = [
                ':locationId' => $locationId,
                ':isAdmin' => 1
            ];

            $statement->execute($params);

            $rows = $statement->fetchAll();
        } catch (\Exception $e) {
            throw new QueryExecutionException('Unable to find by id in ' . __CLASS__, $e->getCode(), $e);
        }

        if (!$rows) {
            return new Collection();
        }

        $items = [];
        foreach ($rows as $row) {
            $items[] = call_user_func([static::FACTORY, 'create'], $row);
        }

        return new Collection($items);
    }
}
