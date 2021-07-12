<?php

namespace AmeliaBooking\Infrastructure\WP\ShortcodeService;

use AmeliaBooking\Infrastructure\Common\Exceptions\NotFoundException;
use AmeliaBooking\Infrastructure\Repository\User\ProviderRepository;
use AmeliaBooking\Infrastructure\Repository\Location\LocationRepository;
use AmeliaBooking\Domain\Entity\Location\Location;
use AmeliaBooking\Domain\Entity\User\Provider;
use Slim\App;

/**
 * Class CoachProfileShortcodeService
 *
 * @package AmeliaBooking\Infrastructure\WP\ShortcodeService
 */
class CoachProfileShortcodeService
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
          'coachSlug' => get_query_var('coachSlug')              
        ],
        $atts
      );

      if (empty($atts['coachSlug'])) {
        self::force404();
      }

      $data = self::getData($atts);

      ob_start();
      include AMELIA_PATH . '/view/frontend/coach.inc.php';
      $html = ob_get_contents();
      ob_end_clean();
      return $html;
    }

    protected static function getData($atts) {
      $result = [];
      $providerSlug = $atts['coachSlug'];
      /** @var ProviderRepository $providerRepository */      
      $providerRepository = self::$container->get('domain.users.providers.repository');
      /** @var LocationRepository $locationRepository */
      $locationRepository = self::$container->get('domain.locations.repository');
      try {
        $genericCoachImage = 'https://player2player.com/wp-content/uploads/2021/07/coach-icon-png-4.png';
        /** @var Provider @coach */
        $coach = $providerRepository->getProfile($providerSlug);      
        /** @var Location @location */
        $location = $locationRepository->getById($coach->getLocationId()->getValue());
        $result['id'] = $coach->getId()->getValue();
        $result['fullName'] = "{$coach->getFirstName()->getValue()} {$coach->getLastName()->getValue()}";
        $result['picture'] = $coach->getPicture() ? $coach->getPicture()->getFullPath() : $genericCoachImage;
        $result['location'] = $location;
        $result['notes'] = $coach->getNote() ? $coach->getNote()->getValue() : '';
        $categories = [];
        foreach($coach->getServiceList()->getItems() as $service) {
          $serviceId = $service->getId()->getValue();          
          $categoryId = $service->getCategoryId()->getValue(); 
          if (!array_key_exists($categoryId, $categories)) {
            $categories[$categoryId] = [];
            $categories[$categoryId]['category'] = $service->getCategory();
            $categories[$categoryId]['services'] = [];
          }
          if (!array_key_exists($serviceId, $categories[$categoryId]['services'])) {
            $categories[$categoryId]['services'][$serviceId] = $service->getName()->getValue();
          }
        }
        $result['categories'] = $categories;
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
