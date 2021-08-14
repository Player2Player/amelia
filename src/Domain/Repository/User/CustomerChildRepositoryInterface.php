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
   * @param int $childId
   * @param int $serviceId
   */
  public function addService($childId, $serviceId);

  /**
   * @param int $childId
   * @param int $serviceId
   */
  public function deleteService($childId, $serviceId);
  
}
