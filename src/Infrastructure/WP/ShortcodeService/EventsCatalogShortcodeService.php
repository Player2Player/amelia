<?php

namespace AmeliaBooking\Infrastructure\WP\ShortcodeService;

use AmeliaBooking\Infrastructure\Common\Exceptions\NotFoundException;
use AmeliaBooking\Infrastructure\Repository\Location\LocationRepository;
use AmeliaBooking\Infrastructure\Repository\Booking\Event\EventRepository;
use AmeliaBooking\Domain\Entity\Location\Location;
use Slim\App;

/**
 * Class EventsCatalogShortcodeService
 *
 * @package AmeliaBooking\Infrastructure\WP\ShortcodeService
 */
class EventsCatalogShortcodeService
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
      include AMELIA_PATH . '/view/frontend/events-catalog.inc.php';
      $html = ob_get_contents();
      ob_end_clean();
      return $html;
    }

    protected static function getData() {
      $result = [];
      /** @var LocationRepository $locationRepository */
      $locationRepository = self::$container->get('domain.locations.repository');      
        /** @var EventRepository $eventRepository */
      $eventRepository = self::$container->get('domain.booking.event.repository');

      /** @var Location @location */
      $locations = $locationRepository->getAll();
      $result['locations'] = $locations;

      return $result;
    }

}
