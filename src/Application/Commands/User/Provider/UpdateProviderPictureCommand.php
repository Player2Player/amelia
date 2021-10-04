<?php

namespace AmeliaBooking\Application\Commands\User\Provider;

use AmeliaBooking\Application\Commands\Command;

/**
 * Class UpdateProviderPictureCommand
 *
 * @package AmeliaBooking\Application\Commands\User\Provider
 */
class UpdateProviderPictureCommand extends Command
{
  
  private $file;
  
  /**
   * GetProviderCommand constructor.
   *
   * @param $args
   */
  public function __construct($args)
  {
    parent::__construct($args);
    if (isset($args['id'])) {
        $this->setField('id', $args['id']);
    }
  }

  
  public function getFile() 
  {
    return $this->file;
  }    

  public function setFile($file) 
  {
    $this->file = $file;
  }

}
