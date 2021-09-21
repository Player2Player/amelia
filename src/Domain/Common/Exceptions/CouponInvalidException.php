<?php
/**
 * @copyright © TMS-Plugins. All rights reserved.
 * @licence   See LICENCE.md for license details.
 */

namespace AmeliaBooking\Domain\Common\Exceptions;

/**
 * Class CouponInvalidException
 *
 * @package AmeliaBooking\Domain\Common\Exceptions
 */
class CouponInvalidException extends \Exception
{
  
  /**
   * @var string 
   * 
   */  
  private $couponDescription;
  

  /**
   * Get the value of couponDescription
   * 
   * @return string
   */ 
  public function getCouponDescription()
  {
    return $this->couponDescription;
  }

  /**
   * Set the value of couponDescription
   *
   * @param string $couponDescription
   * 
   * @return  self
   */ 
  public function setCouponDescription($couponDescription)
  {
    $this->couponDescription = $couponDescription;

    return $this;
  }
}
