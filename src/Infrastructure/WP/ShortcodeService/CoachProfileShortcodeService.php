<?php

namespace AmeliaBooking\Infrastructure\WP\ShortcodeService;

use AmeliaBooking\Infrastructure\Common\Exceptions\NotFoundException;
use AmeliaBooking\Infrastructure\Repository\User\ProviderRepository;
use AmeliaBooking\Infrastructure\Repository\Location\LocationRepository;
use AmeliaBooking\Infrastructure\Repository\Bookable\Service\CategoryRepository;
use AmeliaBooking\Domain\Entity\Location\Location;
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

      // $data = self::getData($atts);

      ob_start();
      include AMELIA_PATH . '/view/frontend/coach.inc.php';
      $html = ob_get_contents();
      ob_end_clean();

      return $html;
    }

    protected static function getData($atts) {
      $result = [];
      $locationSlug = $atts['location'];
      $categorySlug = $atts['category'];
      /** @var ProviderRepository $providerRepository */      
      $providerRepository = self::$container->get('domain.users.providers.repository');
      /** @var LocationRepository $locationRepository */
      $locationRepository = self::$container->get('domain.locations.repository');
      /** @var CategoryRepository @categoryRepository */
      $categoryRepository = self::$container->get('domain.bookable.category.repository');

      try {
        /** @var Location @location */
        $location = $locationRepository->getBySlug($locationSlug);        
        $categoryId = null;
        $result['category'] = null;
        if (!empty($categorySlug)) {
          $category = $categoryRepository->getBySlug($categorySlug);
          if (!$category || empty($category)) {
            self::force404();
          }  
          $result['category'] = $category->toArray();
          $categoryId = $result['category']['id'];
        }
        $result['location'] = $location->toArray();    
        $locationId = $result['location']['id'];
        $criteria = array('location' => $locationId, 'category' => $categoryId);
        $coaches = $providerRepository->getAllWithServicesByCriteria($criteria);
        $result['coaches'] = $coaches->getItems();
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
