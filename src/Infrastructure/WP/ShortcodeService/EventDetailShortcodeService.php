<?php

namespace AmeliaBooking\Infrastructure\WP\ShortcodeService;

use AmeliaBooking\Infrastructure\Repository\Location\LocationRepository;
use AmeliaBooking\Infrastructure\Repository\Booking\Event\EventRepository;
use AmeliaBooking\Domain\Entity\Booking\Event\Event;
use AmeliaBooking\Domain\Entity\Location\Location;
use AmeliaBooking\Infrastructure\Common\Exceptions\NotFoundException;
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
     
      $atts = shortcode_atts(
        [
          'eventSlug' => get_query_var('eventSlug')
        ],
        $atts
      );

      if (empty($atts['eventSlug'])) {
        self::force404();
      }
      
      $data = self::getData($atts);

      ob_start();
      include AMELIA_PATH . '/view/frontend/event-detail.inc.php';
      $html = ob_get_contents();
      ob_end_clean();
      return $html;
    }

    protected static function getData($atts) {
      $result = [];

      /** @var EventRepository $eventRepository */
      $eventRepository = self::$container->get('domain.booking.event.repository');

      try {
        $event = $eventRepository->getBySlug($atts['eventSlug']);
      }
      catch(NotFoundException $exc) {        
        self::force404();
      }

      $result['event'] = $event;

      return $result;
    }

    protected static function force404() {
      status_header(404);
      nocache_headers();
      include( get_query_template( '404' ) );
      die();
    }

}
