<?php

namespace AmeliaBooking\Infrastructure\WP\ShortcodeService;

use AmeliaBooking\Infrastructure\Repository\Location\LocationRepository;
use AmeliaBooking\Infrastructure\Repository\Booking\Event\EventRepository;
use AmeliaBooking\Domain\Entity\Booking\Event\Event;
use AmeliaBooking\Domain\Entity\Location\Location;
use Slim\App;

/**
 * Class EventDetailShortcodeService
 *
 * @package AmeliaBooking\Infrastructure\WP\ShortcodeService
 */
class EventDetailShortcodeService
{
    
    private static $container;

    /**
     * @return string
     */
    public static function shortcodeHandler($atts)
    {                    
      $containerConfig = require AMELIA_PATH . '/src/Infrastructure/ContainerConfig/container.php';
      $app = new App($containerConfig);
      self::$container = $app->getContainer();      
      
      $data = self::getData();

      ob_start();
      include AMELIA_PATH . '/view/frontend/event-detail.inc.php';
      $html = ob_get_contents();
      ob_end_clean();
      return $html;
    }

    protected static function getData() {
      $result = [];
      return $result;
    }

    protected static function strLimit($value, $limit = 100, $end = '...')
    {
        $limit = $limit - mb_strlen($end); // Take into account $end string into the limit
        $valuelen = mb_strlen($value);
        return $limit < $valuelen ? mb_substr($value, 0, mb_strrpos($value, ' ', $limit - $valuelen)) . $end : $value;
    }

}
