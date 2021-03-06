<?php

namespace AmeliaBooking\Domain\Repository\User;

use AmeliaBooking\Domain\Repository\BaseRepositoryInterface;

/**
 * Interface ProviderRepositoryInterface
 *
 * @package AmeliaBooking\Domain\Repository\User
 */
interface ProviderRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * @param      $searchCriteria
     *
     * @return mixed
     */
    public function getByCriteria($searchCriteria);

    /**
     * @param     $criteria
     * @param int $itemsPerPage
     *
     * @return mixed
     */
    public function getFiltered($criteria, $itemsPerPage);

    /**
     * @param $criteria
     *
     * @return mixed
     */
    public function getCount($criteria);

    /**
     * @param $criteria
     *
     * @return mixed
     */
    public function getAllWithServicesByCriteria($criteria);    
    
    public function getProfile($slug);
}
