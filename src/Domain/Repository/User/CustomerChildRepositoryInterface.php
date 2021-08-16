<?php

namespace AmeliaBooking\Domain\Repository\User;

use AmeliaBooking\Domain\Repository\BaseRepositoryInterface;

/**
 * Interface CustomerChildRepositoryInterface
 *
 * @package AmeliaBooking\Domain\Repository\User
 */
interface CustomerChildRepositoryInterface extends BaseRepositoryInterface
{
  
  /**
   * @param string $customerId
   */
  public function getCustomerChildren($customerId);

  /**
   * @param array $customerIds
   */
  public function getCustomersChildren($customerIds);

  /**
   * @param int $childId
   * @param int $categoryId
   */
  public function addCategory($childId, $categoryId);

  /**
   * @param int $childId
   * @param int $categoryId
   */
  public function deleteCategory($childId, $categoryId);

  /**
   * @param int $childId
   */
  public function deleteCategories($childId);
  
}
