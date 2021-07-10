<?php

namespace AmeliaBooking\Infrastructure\WP\ShortcodeService;

use AmeliaBooking\Infrastructure\Repository\User\ProviderRepository;
use AmeliaBooking\Infrastructure\Repository\Location\LocationRepository;
use AmeliaBooking\Infrastructure\Repository\Bookable\Service\CategoryRepository;
use AmeliaBooking\Domain\Entity\Location\Location;
use Slim\App;

/**
 * Class CoachesCatalogShortcodeService
 *
 * @package AmeliaBooking\Infrastructure\WP\ShortcodeService
 */
class CoachesCatalogShortcodeService
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
          'category' => get_query_var('category'),
          'location' => get_query_var('location')                
        ],
        $atts
      );

      $data = self::getData($atts);

      ob_start();
      include AMELIA_PATH . '/view/frontend/coaches.inc.php';
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
      /** @var Location @location */
      $location = $locationRepository->getBySlug($locationSlug);
      
      $categoryId = null;
      $result['category'] = null;
      if (!empty($categorySlug)) {
        $category = $categoryRepository->getBySlug($categorySlug);
        $result['category'] = $category->toArray();
        $categoryId = $result['category']['id'];
      }
      $result['location'] = $location->toArray();    
      $locationId = $result['location']['id'];
      $criteria = array('location' => $locationId, 'category' => $categoryId);
      $coaches = $providerRepository->getAllWithServicesByCriteria($criteria);
      $result['coaches'] = $coaches->getItems();
      return $result;
    }

}
