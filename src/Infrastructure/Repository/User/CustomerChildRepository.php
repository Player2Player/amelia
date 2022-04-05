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
    
  private $childrenCategoryTable;
  private $categoryTable;
  
  public function __construct(
    Connection $connection,
    $table,
    $childrenCategoryTable,
    $categoryTable
    ) {
      parent::__construct($connection, $table);
      $this->childrenCategoryTable = $childrenCategoryTable;
      $this->categoryTable = $categoryTable;
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

  public function addCategory($childId, $categoryId) {
    $params = [
        ':childId'          => $childId,
        ':categoryId'       => $categoryId,
    ];

    try {
      $statement = $this->connection->prepare(
          "INSERT INTO {$this->childrenCategoryTable} (
          `customerChildrenId`,
          `categoryId`
          ) VALUES (
          :childId,
          :categoryId
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

  public function deleteCategory($childId, $categoryId) {
    $params = [
      ':childId'          => $childId,
      ':categoryId'       => $categoryId,
    ];

    try {
      $statement = $this->connection->prepare(
          "DELETE FROM  {$this->childrenCategoryTable} 
            WHERE `customerChildrenId` = :childId AND `categoryId` = :categoryId 
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

  public function deleteCategories($childId) {
    $params = [
      ':childId' => $childId
    ];

    try {
      $statement = $this->connection->prepare(
          "DELETE FROM  {$this->childrenCategoryTable} 
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

  public function getCustomersChildren($criteria) {
    try {
      $params = [];
      $queryProviders = [];
      $where = '';
      if ($criteria['customerIds']) {
        $customerIds = $criteria['customerIds'];  
        foreach ($customerIds as $index => $value) {
          $param = ':customer' . $index;
          $queryProviders[] = $param;
          $params[$param] = $value;
        }
        $where =  'u.customerId IN (' . implode(', ', $queryProviders) . ')';
      }
      else if ($criteria['customerId']) {
        $params[':customerId'] = $criteria['customerId'];
        $where = "u.customerId = :customerId";
      }

      if ($where) {
        $where = " WHERE $where";
      } 

      $statement = $this->connection->prepare(
        "SELECT
            u.id AS child_id,
            u.customerId AS customer_id,
            u.firstName AS child_firstName,
            u.lastName AS child_lastName,
            u.birthday AS child_birthday,
            st.categoryId AS category_id,
            c.name AS category_name,
            c.position as category_position
        FROM {$this->table} u
        LEFT JOIN {$this->childrenCategoryTable} st ON st.customerChildrenId = u.id
        LEFT JOIN {$this->categoryTable} c ON c.id = st.categoryId
        $where
        ORDER BY u.customerId, CONCAT(u.firstName, ' ', u.lastName)"
      );

      $statement->execute($params);        

      $customerRows = [];

      while ($row = $statement->fetch()) {
          $this->parseCustomerChildRow($row, $customerRows);
      }
      $collectionArray = [];
      foreach($customerRows as $key => $children) {
        $collectionArray[$key] = CustomerChildFactory::createChildrenCollection($children);
      }
    }
    catch (\Exception $e) {
      throw new QueryExecutionException('Unable to find by id in ' . __CLASS__, $e->getCode(), $e);
    }

    return $collectionArray;
  }

  /**
   * @param int $customerId
   * @return Collection
   */
  public function getCustomerChildren($customerId) {
    $criteria = ['customerId' => $customerId];
    $customers = $this->getCustomersChildren($criteria);

    return $customers[$customerId] ?? new Collection();
  }

  /**
   * @param array $row
   * @param array $customerRows
   *
   * @return void
   */
  private function parseCustomerChildRow($row, &$customerRows)
  {
    $customerId = (int)$row['customer_id'];
    $childId = (int)$row['child_id'];
    $categoryId = isset($row['category_id']) ? (int)$row['category_id'] : null;

    if (!array_key_exists($customerId, $customerRows)) {
      $customerRows[$customerId] = [];
    }

    if (array_key_exists($customerId, $customerRows) &&
      !array_key_exists($childId, $customerRows[$customerId])) {
      $customerRows[$customerId][$childId] = [
          'id'               => $childId,
          'customerId'       => $customerId,
          'firstName'        => $row['child_firstName'],
          'lastName'         => $row['child_lastName'],
          'birthday'         => isset($row['child_birthday']) ? $row['child_birthday'] : null,
          'categoryList'     => [],
      ];
    }

    if ($categoryId &&
      array_key_exists($childId, $customerRows[$customerId]) &&
      !array_key_exists($categoryId, $customerRows[$customerId][$childId]['categoryList'])
    ) {
      $customerRows[$customerId][$childId]['categoryList'][$categoryId] = [
          'id'               => $categoryId,
          'name'             => $row['category_name'],
          'position'         => $row['category_position']
      ];
    }
  }

}
