<?php

namespace AmeliaBooking\Infrastructure\WP\ShortcodeService;

use AmeliaBooking\Infrastructure\Common\Exceptions\NotFoundException;
use AmeliaBooking\Infrastructure\Repository\Location\LocationRepository;
use AmeliaBooking\Domain\Entity\Location\Location;
use Slim\App;

/**
 * Class SportsCatalogShortcodeService
 *
 * @package AmeliaBooking\Infrastructure\WP\ShortcodeService
 */
class SportsCatalogShortcodeService
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
          'location' => get_query_var('location')              
        ],
        $atts
      );

      if (empty($atts['location'])) {
        self::force404();
      }

      $data = self::getData($atts);

      ob_start();
      include AMELIA_PATH . '/view/frontend/sports.inc.php';
      $html = ob_get_contents();
      ob_end_clean();
      return $html;
    }

    protected static function getData($atts) {
      $result = [];
      $locationSlug = $atts['location'];
      /** @var LocationRepository $locationRepository */
      $locationRepository = self::$container->get('domain.locations.repository');      
      try {
        /** @var Location @location */
        $location = $locationRepository->getBySlug($locationSlug);
        $result['location'] = $location;
      } 
      catch(NotFoundException $exc) {        
        self::force404();
      }
      return $result;
    }

    protected static function force404() {
      status_header(404);
      nocache_headers();
      include( get_query_template( '404' ) );
      die();
    }

}
