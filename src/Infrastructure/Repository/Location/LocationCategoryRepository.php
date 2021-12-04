<?php

namespace AmeliaBooking\Infrastructure\Repository\Location;

use AmeliaBooking\Domain\Collection\Collection;
use AmeliaBooking\Domain\Common\Exceptions\InvalidArgumentException;
use AmeliaBooking\Domain\Entity\Location\LocationCategory;
use AmeliaBooking\Infrastructure\Common\Exceptions\QueryExecutionException;
use AmeliaBooking\Infrastructure\Connection;
use AmeliaBooking\Infrastructure\Repository\AbstractRepository;
use AmeliaBooking\Domain\Factory\Location\LocationCategoryFactory;

/**
 * Class LocationCategoryRepository
 *
 * @package AmeliaBooking\Infrastructure\Repository\Location
 */
class LocationCategoryRepository extends AbstractRepository
{

    const FACTORY = LocationCategoryFactory::class;

    /** @var string */
    protected $providerServicesTable;

    /** @var string */
    protected $providerLocationTable;

    /** @var string */
    protected $servicesTable;

    /** @var string */
    protected $locationViewsTable;

    /**
     * @param Connection $connection
     * @param string     $table
     * @param string     $providerLocationTable
     * @param string     $providerServicesTable
     * @param string     $servicesTable
     * @param            $locationViewsTable
     */
    public function __construct(
        Connection $connection,
        $table
    ) {
        parent::__construct($connection, $table);
    }

    /**
     * @param LocationCategory $location
     *
     * @return bool
     * @throws QueryExecutionException
     */
    public function add($location)
    {
        $data = $location->toArray();

        $params = [
            ':name'             => $data['name'],
            ':slug'             => $data['slug'],
        ];

        try {
            $statement = $this->connection->prepare(
                "INSERT INTO {$this->table}
                (
                `name`,
                `slug`
                )
                 VALUES (
                 :name,
                 :slug
                 )"
            );

            $res = $statement->execute($params);
            if (!$res) {
                throw new QueryExecutionException('Unable to add data in ' . __CLASS__);
            }
        } catch (\Exception $e) {
            throw new QueryExecutionException('Unable to add data in ' . __CLASS__, $e->getCode(), $e);
        }

        return $this->connection->lastInsertId();
    }

    /**
     * @param int      $id
     * @param LocationCategory $location
     *
     * @return bool
     * @throws QueryExecutionException
     */
    public function update($id, $location)
    {
        $data = $location->toArray();

        $params = [
            ':slug'             => $data['slug'],
            ':name'             => $data['name'],
        ];

        try {
            $statement = $this->connection->prepare(
                "UPDATE {$this->table}
                SET `slug` = :slug, `name` = :name
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
     * @return Collection
     * @throws InvalidArgumentException
     * @throws QueryExecutionException
     */
    public function getAllOrderedByName()
    {
        try {
            $statement = $this->connection->query(
                "SELECT * FROM {$this->table} ORDER BY name"
            );

            $rows = $statement->fetchAll();
        } catch (\Exception $e) {
            throw new QueryExecutionException('Unable to get data from ' . __CLASS__, $e->getCode(), $e);
        }

        $items = new Collection();
        foreach ($rows as $row) {
            $items->addItem(call_user_func([static::FACTORY, 'create'], $row), $row['id']);
        }

        return $items;
    }

}
