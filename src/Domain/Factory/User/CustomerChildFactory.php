<?php

namespace AmeliaBooking\Domain\Factory\User;

use AmeliaBooking\Domain\Collection\Collection;
use AmeliaBooking\Domain\Entity\User\CustomerChild;
use AmeliaBooking\Domain\ValueObjects\String\Name;
use AmeliaBooking\Domain\ValueObjects\DateTime\Birthday;
use AmeliaBooking\Domain\ValueObjects\Number\Integer\Id;
use AmeliaBooking\Domain\Factory\Bookable\Service\CategoryFactory;

/**
 * Class CustomerFactory
 *
 * @package AmeliaBooking\Domain\Factory\User
 */
class CustomerChildFactory
{
    /**
     * @param array $customerChildren
     *
     * @return Collection
     * @throws \AmeliaBooking\Domain\Common\Exceptions\InvalidArgumentException
     */
    public static function createChildrenCollection($customerChildren)
    {
      $childrenCollection = new Collection();

      foreach ($customerChildren as $childKey => $childArray) {
        $child = new CustomerChild(new Name($childArray['firstName']), 
                                   new Name($childArray['lastName']));

        $child->setId(new Id((int)$childKey));
        $child->setCustomerId(new Id($childArray['customerId']));

        if (!empty($childArray['birthday'])) {
          if (is_string($childArray['birthday'])) {
            $child->setBirthday(new Birthday(\DateTime::createFromFormat('Y-m-d', $childArray['birthday'])));
          } else {
            $child->setBirthday(new Birthday($childArray['birthday']));
          }
        }
                                
        $childrenCollection->addItem($child, $childKey);
        foreach ($childArray['categoryList'] as $categoryKey => $customerCategory) {
          $childrenCollection->getItem($childKey)->getCategoryList()->addItem(
            CategoryFactory::create($customerCategory),
            $categoryKey
          );
        }
      }

      return $childrenCollection;
    }
}
