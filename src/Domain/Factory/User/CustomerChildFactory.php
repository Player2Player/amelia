<?php

namespace AmeliaBooking\Domain\Factory\User;

use AmeliaBooking\Domain\Collection\Collection;
use AmeliaBooking\Domain\Entity\User\CustomerChild;
use AmeliaBooking\Domain\ValueObjects\String\Name;
use AmeliaBooking\Domain\ValueObjects\DateTime\Birthday;
use AmeliaBooking\Domain\Factory\Bookable\Service\ServiceFactory;

/**
 * Class CustomerFactory
 *
 * @package AmeliaBooking\Domain\Factory\User
 */
class CustomerChildFactory
{
    /**
     * @param array $customers
     *
     * @return Collection
     * @throws \AmeliaBooking\Domain\Common\Exceptions\InvalidArgumentException
     */
    public static function createChildrenCollection($customers)
    {
      $childrenCollection = new Collection();

      foreach ($customers as $customerKey => $customerArray) {
        $child = new CustomerChild(new Name($customerArray['firstName']), 
                                   new Name($customerArray['lastName']));
        if (!empty($customerArray['birthday'])) {
          if (is_string($customerArray['birthday'])) {
            $child->setBirthday(new Birthday(\DateTime::createFromFormat('Y-m-d', $customerArray['birthday'])));
          } else {
            $child->setBirthday(new Birthday($customerArray['birthday']));
          }
        }
                                
        $childrenCollection->addItem($child, $customerKey);
        foreach ($customerArray['serviceList'] as $serviceKey => $customerService) {
          $childrenCollection->getItem($customerKey)->getServiceList()->addItem(
            ServiceFactory::create($customerService),
            $serviceKey
          );
        }

      }

      return $childrenCollection;
    }
}
