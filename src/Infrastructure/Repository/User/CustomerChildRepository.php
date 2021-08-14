<?php

namespace AmeliaBooking\Infrastructure\Repository\User;

use AmeliaBooking\Domain\Collection\Collection;
use AmeliaBooking\Infrastructure\Common\Exceptions\QueryExecutionException;
use AmeliaBooking\Domain\Factory\User\CustomerChildFactory;
use AmeliaBooking\Infrastructure\Repository\AbstractRepository;
use AmeliaBooking\Infrastructure\Connection;
use AmeliaBooking\Domain\Repository\User\CustomerChildRepositoryInterface;

/**
 * Class UserRepository
 *
 * @package AmeliaBooking\Infrastructure\Repository
 */
class CustomerChildRepository extends AbstractRepository implements CustomerChildRepositoryInterface
{
    
  private $childrenServiceTable;
  private $serviceTable;
  
  public function __construct(
    Connection $connection,
    $table,
    $childrenServiceTable,
    $serviceTable
    ) {
      parent::__construct($connection, $table);
      $this->childrenServiceTable = $childrenServiceTable;
      $this->serviceTable = $serviceTable;
  }

  
  public function add($entity) {
    $data = $entity->toArray();
    $params = [
        ':customerId'       => $data['customerId'],
        ':firstName'        => $data['firstName'],
        ':lastName'         => $data['lastName'],
        ':birthday'         => $data['birthday'] ? $data['birthday']->format('Y-m-d') : null,
    ];

    try {
      $statement = $this->connection->prepare(
          "INSERT INTO {$this->table} (
          `customerId`,
          `firstName`,
          `lastName`,
          `birthday`
          ) VALUES (
          :customerId,
          :firstName,
          :lastName,
          STR_TO_DATE(:birthday, '%Y-%m-%d')
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

  public function update($id, $entity) {
    $data = $entity->toArray();
    $params = [
        ':id'               => $id,
        ':customerId'       => $data['customerId'],
        ':firstName'        => $data['firstName'],
        ':lastName'         => $data['lastName'],
        ':birthday'         => $data['birthday'] ? $data['birthday']->format('Y-m-d') : null,
    ];

    try {
      $statement = $this->connection->prepare(
          "UPDATE {$this->table}
          SET
          `customerId` = :customerId,
          `firstName` = :firstName,
          `lastName` = :lastName,
          `birthday` = STR_TO_DATE(:birthday, '%Y-%m-%d')
          WHERE 
          id = :id"
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

  public function addService($childId, $serviceId) {
    $params = [
        ':childId'          => $childId,
        ':serviceId'        => $serviceId,
    ];

    try {
      $statement = $this->connection->prepare(
          "INSERT INTO {$this->childrenServiceTable} (
          `customerChildrenId`,
          `serviceId`
          ) VALUES (
          :childId,
          :serviceId
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

  public function deleteService($childId, $serviceId) {
    $params = [
      ':childId'          => $childId,
      ':serviceId'        => $serviceId,
    ];

    try {
      $statement = $this->connection->prepare(
          "DELETE FROM  {$this->childrenServiceTable} 
            WHERE  `customerChildrenId` = :childId AND `serviceId` = :serviceId 
          "
      );

      $res = $statement->execute($params);

      if (!$res) {
        throw new QueryExecutionException('Unable to delete data in ' . __CLASS__);
      }
    } catch (\Exception $e) {
      throw new QueryExecutionException('Unable to delete data in ' . __CLASS__, $e->getCode(), $e);
    }
  }

  public function deleteServices($childId) {
    $params = [
      ':childId' => $childId
    ];

    try {
      $statement = $this->connection->prepare(
          "DELETE FROM  {$this->childrenServiceTable} 
            WHERE  `customerChildrenId` = :childId
          "
      );

      $res = $statement->execute($params);

      if (!$res) {
        throw new QueryExecutionException('Unable to delete data in ' . __CLASS__);
      }
    } catch (\Exception $e) {
      throw new QueryExecutionException('Unable to delete data in ' . __CLASS__, $e->getCode(), $e);
    }
  }

  public function getCustomerChildren($customerId) {
    try {
      $statement = $this->connection->prepare(
        "SELECT
            u.id AS child_id,
            u.firstName AS child_firstName,
            u.lastName AS child_lastName,
            u.birthday AS child_birthday,
            st.serviceId AS service_id,
            s.name AS service_name,
            s.description AS service_description,
            s.price as service_price,
            s.status as service_status,
            s.categoryId AS service_categoryId
        FROM {$this->table} u
        LEFT JOIN {$this->childrenServiceTable} st ON st.customerChildrenId = u.id
        LEFT JOIN {$this->serviceTable} s ON s.id = st.serviceId
        WHERE u.customerId = :customer
        ORDER BY CONCAT(u.firstName, ' ', u.lastName)"
      );

      $statement->bindParam(':customer', $customerId);
      $statement->execute();        

      $customerRows = [];

      while ($row = $statement->fetch()) {
          $this->parseCustomerChildRow($row, $customerRows);
      }

      $providers = CustomerChildFactory::createChildrenCollection($customerRows);

      if (!$providers->length()) {
          return new Collection();
      }
    }
    catch (\Exception $e) {
      throw new QueryExecutionException('Unable to find by id in ' . __CLASS__, $e->getCode(), $e);
    }

    return $providers;
  }

  /**
   * @param array $row
   * @param array $customerRows
   *
   * @return void
   */
  private function parseCustomerChildRow($row, &$customerRows)
  {
    $childId = (int)$row['child_id'];
    $serviceId = isset($row['service_id']) ? (int)$row['service_id'] : null;

    if (!array_key_exists($childId, $customerRows)) {
      $customerRows[$childId] = [
          'id'               => $childId,
          'firstName'        => $row['child_firstName'],
          'lastName'         => $row['child_lastName'],
          'birthday'         => isset($row['child_birthday']) ? $row['child_birthday'] : null,
          'serviceList'      => [],
      ];
    }

    if ($serviceId &&
      array_key_exists($childId, $customerRows) &&
      !array_key_exists($serviceId, $customerRows[$childId]['serviceList'])
    ) {
      $customerRows[$childId]['serviceList'][$serviceId] = [
          'id'               => $serviceId,
          'name'             => $row['service_name'],
          'description'      => $row['service_description'],
          'price'            => $row['service_price'],
          'status'           => $row['service_status'],
          'categoryId'       => (int)$row['service_categoryId'],
      ];
    }
  }

}
