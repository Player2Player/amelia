<?php

namespace AmeliaBooking\Domain\Entity\User;

use AmeliaBooking\Domain\Collection\Collection;
use AmeliaBooking\Domain\ValueObjects\DateTime\Birthday;
use AmeliaBooking\Domain\ValueObjects\String\Name;
use AmeliaBooking\Domain\ValueObjects\Number\Integer\Id;

/**
 * Class CustomerChild
 *
 * @package AmeliaBooking\Domain\Entity\User
 */
class CustomerChild
{

  /**
   * AbstractUser constructor.
   *
   * @param Name  $firstName
   * @param Name  $lastName
   */
  public function __construct(
    Name $firstName,
    Name $lastName
  )
  {
    $this->firstName = $firstName;
    $this->lastName = $lastName;
    $this->serviceList = new Collection();
  }


  /** @var Id */
  private $id;

  /** @var Name */
  private $firstName;

  /** @var Name */
  private $lastName;

  /** @var Birthday */
  private $birthday;

  /** @var Id */
  private $customerId;

  /** @var Collection */
  private $serviceList;

  /**
   * @return Id
   */
  public function getId()
  {
      return $this->id;
  }

  /**
   * @param Id $id
   */
  public function setId(Id $id)
  {
      $this->id = $id;
  }  

  /**
   * @return Id
   */
  public function getCustomerId()
  {
      return $this->customerId;
  }

  /**
   * @param Id $id
   */
  public function setCustomerId(Id $id)
  {
      $this->customerId = $id;
  }  

  /**
   * @return Name
   */
  public function getFirstName()
  {
      return $this->firstName;
  }

  /**
   * @param Name $firstName
   */
  public function setFirstName(Name $firstName)
  {
      $this->firstName = $firstName;
  }

  /**
   * @return Name
   */
  public function getLastName()
  {
      return $this->lastName;
  }

  /**
   * @param Name $lastName
   */
  public function setLastName(Name $lastName)
  {
      $this->lastName = $lastName;
  }

  /**
   * @return string
   */
  public function getFullName()
  {
      return $this->firstName->getValue() . ' ' . $this->lastName->getValue();
  }

  /**
   * @return Birthday
   */
  public function getBirthday()
  {
      return $this->birthday;
  }

  /**
   * @param Birthday $birthday
   */
  public function setBirthday(Birthday $birthday)
  {
      $this->birthday = $birthday;
  }  

  /**
   * @return Collection
   */
  public function getServiceList()
  {
      return $this->serviceList;
  }

  /**
   * @param Collection $serviceList
   */
  public function setServiceList(Collection $serviceList)
  {
      $this->serviceList = $serviceList;
  }

  /**
   * @return array
   */
  public function toArray()
  {
      return [
          'id'               => null !== $this->getId() ? $this->getId()->getValue() : null,
          'customerId'       => null !== $this->getCustomerId() ? $this->getCustomerId()->getValue() : null,
          'firstName'        => $this->getFirstName()->getValue(),
          'lastName'         => $this->getLastName()->getValue(),
          'birthday'         => null !== $this->getBirthday() ? $this->getBirthday()->getValue() : null,
          'serviceList'      => $this->serviceList->toArray(),
      ];
  }

}
