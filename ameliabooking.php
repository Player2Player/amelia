<?php
/*
Plugin Name: Amelia
Plugin URI: https://wpamelia.com/
Description: Amelia is a simple yet powerful automated booking specialist, working 24/7 to make sure your customers can make appointments and events even while you sleep!
Version: 4.0.2
Author: TMS
Author URI: https://tms-outsource.com/
Text Domain: wpamelia
Domain Path: /languages
*/

namespace AmeliaBooking;

use AmeliaBooking\Domain\Services\Settings\SettingsService;
use AmeliaBooking\Infrastructure\Common\Container;
use AmeliaBooking\Infrastructure\Routes\Routes;
use AmeliaBooking\Infrastructure\WP\ButtonService\ButtonService;
use AmeliaBooking\Infrastructure\WP\config\Menu;
use AmeliaBooking\Infrastructure\WP\Elementor\ElementorBlock;
use AmeliaBooking\Infrastructure\WP\ErrorService\ErrorService;
use AmeliaBooking\Infrastructure\WP\GutenbergBlock\AmeliaBookingGutenbergBlock;
use AmeliaBooking\Infrastructure\WP\GutenbergBlock\AmeliaCatalogGutenbergBlock;
use AmeliaBooking\Infrastructure\WP\GutenbergBlock\AmeliaCustomerCabinetGutenbergBlock;
use AmeliaBooking\Infrastructure\WP\GutenbergBlock\AmeliaEmployeeCabinetGutenbergBlock;
use AmeliaBooking\Infrastructure\WP\GutenbergBlock\AmeliaEventsGutenbergBlock;
use AmeliaBooking\Infrastructure\WP\GutenbergBlock\AmeliaSearchGutenbergBlock;
use AmeliaBooking\Infrastructure\WP\Integrations\WooCommerce\WooCommerceService;
use AmeliaBooking\Infrastructure\WP\SettingsService\SettingsStorage;
use AmeliaBooking\Infrastructure\WP\Translations\BackendStrings;
use AmeliaBooking\Infrastructure\WP\UserRoles\UserRoles;
use AmeliaBooking\Infrastructure\WP\WPMenu\Submenu;
use AmeliaBooking\Infrastructure\WP\WPMenu\SubmenuPageHandler;
use Exception;
use Interop\Container\Exception\ContainerException;
use Slim\App;

// No direct access
defined('ABSPATH') or die('No script kiddies please!');

// Const for path root
if (!defined('AMELIA_PATH')) {
    define('AMELIA_PATH', __DIR__);
}

// Const for uploads path
if (!defined('UPLOADS_PATH')) {
    $uploadDir = wp_upload_dir();
    define('UPLOADS_PATH', $uploadDir['basedir']);
}

// Const for uploads url
if (!defined('UPLOADS_URL')) {
    $uploadUrl = wp_upload_dir();
    define('UPLOADS_URL', set_url_scheme($uploadUrl['baseurl']));
}

// Const for uploads url
if (!defined('UPLOADS_AMELIA_FILES_URL')) {
    define('UPLOADS_AMELIA_FILES_URL', UPLOADS_URL . '/amelia/files/');
}

// Const for uploads files path
if (!defined('UPLOADS_AMELIA_FILES_PATH')) {
    define('UPLOADS_AMELIA_FILES_PATH', UPLOADS_PATH . '/amelia/files/');
}

// Const for uploads files path
if (!defined('UPLOADS_AMELIA_FILES_PATH_USE')) {
    define('UPLOADS_AMELIA_FILES_PATH_USE', true);
}

// Const for URL root
if (!defined('AMELIA_URL')) {
    define('AMELIA_URL', plugin_dir_url(__FILE__));
}

// Const for URL Actions identifier
if (!defined('AMELIA_ACTION_SLUG')) {
    define('AMELIA_ACTION_SLUG', 'action=wpamelia_api&call=');
}

// Const for URL Actions identifier
if (!defined('AMELIA_ACTION_URL')) {
    define('AMELIA_ACTION_URL', get_site_url() . '/wp-admin/admin-ajax.php?' . AMELIA_ACTION_SLUG);
}

// Const for URL Actions identifier
if (!defined('AMELIA_PAGE_URL')) {
    define('AMELIA_PAGE_URL', get_site_url() . '/wp-admin/admin.php?page=');
}

// Const for URL Actions identifier
if (!defined('AMELIA_LOGIN_URL')) {
    define('AMELIA_LOGIN_URL', get_site_url() . '/wp-login.php?redirect_to=');
}

// Const for Amelia version
if (!defined('AMELIA_VERSION')) {
    define('AMELIA_VERSION', '4.0.1.31');
}

// Const for site URL
if (!defined('AMELIA_SITE_URL')) {
    define('AMELIA_SITE_URL', get_site_url());
}

// Const for plugin basename
if (!defined('AMELIA_PLUGIN_SLUG')) {
    define('AMELIA_PLUGIN_SLUG', plugin_basename(__FILE__));
}

// Const for Amelia SMS API
if (!defined('AMELIA_SMS_API_URL')) {
    define('AMELIA_SMS_API_URL', 'https://smsapi.wpamelia.com/');
    define('AMELIA_SMS_VENDOR_ID', 36082);
    define('AMELIA_SMS_PRODUCT_ID_10', 595657);
    define('AMELIA_SMS_PRODUCT_ID_20', 595658);
    define('AMELIA_SMS_PRODUCT_ID_50', 595659);
    define('AMELIA_SMS_PRODUCT_ID_100', 595660);
    define('AMELIA_SMS_PRODUCT_ID_200', 595661);
    define('AMELIA_SMS_PRODUCT_ID_500', 595662);
}

if (!defined('AMELIA_STORE_API_URL')) {
    define('AMELIA_STORE_API_URL', 'https://store.tms-plugins.com/api/');
}

require_once AMELIA_PATH . '/vendor/autoload.php';

/**
 * @noinspection AutoloadingIssuesInspection
 *
 * Class Plugin
 *
 * @package AmeliaBooking
 *
 * @phpcs:ignoreFile
 * @SuppressWarnings(PHPMD)
 */
class Plugin
{

    /**
     * API Call
     *
     * @throws \InvalidArgumentException
     */
    public static function wpAmeliaApiCall()
    {
        try {
            /** @var Container $container */
            $container = require AMELIA_PATH . '/src/Infrastructure/ContainerConfig/container.php';

            $app = new App($container);

            // Initialize all API routes
            Routes::routes($app);

            $app->run();

            exit();
        } catch (Exception $e) {
            echo 'ERROR: ' . $e->getMessage();
        }
    }

    /**
     * Initialize the plugin
     */
    public static function init()
    {
        // Const for path root
        if (!defined('AMELIA_LOCALE')) {
            define('AMELIA_LOCALE', get_locale());
        }

        load_plugin_textdomain('wpamelia', false, plugin_basename(__DIR__) . '/languages/' . AMELIA_LOCALE . '/');

        $settingsService = new SettingsService(new SettingsStorage());

        if (WooCommerceService::isEnabled()) {
            if (!empty($settingsService->getCategorySettings('payments')['wc']['dashboard'])) {
                add_filter('woocommerce_prevent_admin_access', '__return_false');
            }

            if (!empty($settingsService->getCategorySettings('payments')['wc']['enabled'])) {
                try {
                    WooCommerceService::init($settingsService);
                } catch (ContainerException $e) {
                }
            } else {
                WooCommerceService::setContainer(require AMELIA_PATH . '/src/Infrastructure/ContainerConfig/container.php');
                WooCommerceService::$settingsService = $settingsService;

                add_filter('woocommerce_after_order_itemmeta', [WooCommerceService::class, 'orderItemMeta'], 10, 3);
            }
        }

        $ameliaRole = UserRoles::getUserAmeliaRole(wp_get_current_user());

        // Init menu if user is logged in with amelia role
        if (in_array($ameliaRole, ['admin', 'manager', 'provider', 'customer'])) {
            if ($ameliaRole === 'admin') {
                ErrorService::setNotices();
            }

            $menuItems = new Menu($settingsService);

            // Init admin menu
            $wpMenu = new Submenu(
                new SubmenuPageHandler($settingsService),
                $menuItems()
            );
            $wpMenu->init();

            // Add TinyMCE button for shortcode generator
            ButtonService::renderButton();

            // Add Gutenberg Block for shortcode generator
            AmeliaBookingGutenbergBlock::init();
            AmeliaSearchGutenbergBlock::init();
            AmeliaCatalogGutenbergBlock::init();
            AmeliaEventsGutenbergBlock::init();
            AmeliaCustomerCabinetGutenbergBlock::init();
            AmeliaEmployeeCabinetGutenbergBlock::init();

            add_filter('block_categories', array('AmeliaBooking\Plugin', 'addAmeliaBlockCategory'), 10, 2);
            add_filter('learn-press/frontend-default-scripts', array('AmeliaBooking\Plugin', 'learnPressConflict'));
        }

        if (!is_admin()) {
            add_filter('learn-press/frontend-default-scripts', array('AmeliaBooking\Plugin', 'learnPressConflict'));
            add_shortcode('ameliabooking', array('AmeliaBooking\Infrastructure\WP\ShortcodeService\BookingShortcodeService', 'shortcodeHandler'));
            add_shortcode('ameliasearch', array('AmeliaBooking\Infrastructure\WP\ShortcodeService\SearchShortcodeService', 'shortcodeHandler'));
            add_shortcode('ameliacatalog', array('AmeliaBooking\Infrastructure\WP\ShortcodeService\CatalogShortcodeService', 'shortcodeHandler'));
            add_shortcode('ameliaevents', array('AmeliaBooking\Infrastructure\WP\ShortcodeService\EventsShortcodeService', 'shortcodeHandler'));
            add_shortcode('ameliacustomerpanel', array('AmeliaBooking\Infrastructure\WP\ShortcodeService\CabinetCustomerShortcodeService', 'shortcodeHandler'));
            add_shortcode('ameliaemployeepanel', array('AmeliaBooking\Infrastructure\WP\ShortcodeService\CabinetEmployeeShortcodeService', 'shortcodeHandler'));

            // custom p2p shortcodes added
            add_shortcode('p2pcoaches', array('AmeliaBooking\Infrastructure\WP\ShortcodeService\CoachesCatalogShortcodeService', 'shortcodeHandler'));            
            add_shortcode('p2pcoach', array('AmeliaBooking\Infrastructure\WP\ShortcodeService\CoachProfileShortcodeService', 'shortcodeHandler'));
            add_shortcode('p2psports', array('AmeliaBooking\Infrastructure\WP\ShortcodeService\SportsCatalogShortcodeService', 'shortcodeHandler'));
            add_shortcode('p2pevents', array('AmeliaBooking\Infrastructure\WP\ShortcodeService\EventsCatalogShortcodeService', 'shortcodeHandler'));
            add_shortcode('p2pevent', array('AmeliaBooking\Infrastructure\WP\ShortcodeService\EventDetailShortcodeService', 'shortcodeHandler'));
        }

        if (defined('ELEMENTOR_VERSION')) {
            ElementorBlock::get_instance();
        }
    }

    /**
     * Creating Amelia block category in Gutenberg
     */
    public static function addAmeliaBlockCategory($categories, $post)
    {
        return array_merge(
            array(
                array(
                    'slug'  => 'amelia-blocks',
                    'title' => 'Amelia',
                ),
            ),
            $categories
        );
    }

    /**
     * Fix for conflict with LearnPress plugin
     */
    public static function learnPressConflict($data)
    {

        if (has_shortcode(get_post(get_the_ID())->post_content, 'ameliabooking') ||
            has_shortcode(get_post(get_the_ID())->post_content, 'ameliacatalog') ||
            has_shortcode(get_post(get_the_ID())->post_content, 'ameliasearch') ||
            has_shortcode(get_post(get_the_ID())->post_content, 'ameliaevents') ||
            has_shortcode(get_post(get_the_ID())->post_content, 'ameliacabinet')) {
            return array();
        } else {
            return $data;
        }

    }

    public static function adminInit()
    {
        $settingsService = new SettingsService(new SettingsStorage());

        if (AMELIA_VERSION !== $settingsService->getSetting('activation', 'version')) {
            $settingsService->setSetting('activation', 'version', AMELIA_VERSION);

            require_once ABSPATH . 'wp-admin/includes/plugin.php';

            deactivate_plugins(AMELIA_PLUGIN_SLUG);
            activate_plugin(AMELIA_PLUGIN_SLUG);
        }
    }

    /**
     * @param $networkWide
     */
    public static function activation($networkWide)
    {
        load_plugin_textdomain('wpamelia', false, plugin_basename(__DIR__) . '/languages/' . get_locale() . '/');

        // Check PHP version
        if (!defined('PHP_VERSION_ID') || PHP_VERSION_ID < 50500) {
            deactivate_plugins(AMELIA_PLUGIN_SLUG);
            wp_die(
                BackendStrings::getCommonStrings()['php_version_message'],
                BackendStrings::getCommonStrings()['php_version_title'],
                array('response' => 200, 'back_link' => TRUE)
            );
        }
        //Network activation
        if ($networkWide && function_exists('is_multisite') && is_multisite()) {
            Infrastructure\WP\InstallActions\ActivationMultisite::init();
        }

        Infrastructure\WP\InstallActions\ActivationDatabaseHook::init();
    }

    /**
     * @throws Domain\Common\Exceptions\InvalidArgumentException
     */
    public static function deletion()
    {
        $settingsService = new SettingsService(new SettingsStorage());

        if ($settingsService->getSetting('activation', 'deleteTables')) {
            //Network deletion
            if (function_exists('is_multisite') &&
                is_multisite()
            ) {
                Infrastructure\WP\InstallActions\DeletionMultisite::delete();
            }

            Infrastructure\WP\InstallActions\DeleteDatabaseHook::delete();
        }
    }

    public static function registerQueryVars($vars) {
      $vars[] = 'location';
      $vars[] = 'category';
      $vars[] = 'coachSlug';
      $vars[] = 'eventSlug';
      return $vars;
    }

    public static function coachesRewriteTagRules() {
      $options = json_decode(get_option('p2p_settings'));
      $tpl = $options->templates;
      add_rewrite_rule('^coaches/([^/]*)/?([^/]*)/?', "index.php?page_id={$tpl->coaches}&location=\$matches[1]&category=\$matches[2]", 'top');
      add_rewrite_rule('^coach/([^/]*)/?', "index.php?page_id={$tpl->coach}&coachSlug=\$matches[1]", 'top');
      add_rewrite_rule('^sports/([^/]*)/?', "index.php?page_id={$tpl->sports}&location=\$matches[1]", 'top');
      add_rewrite_rule('^event-detail/([^/]*)/?', "index.php?page_id={$tpl->event}&eventSlug=\$matches[1]", 'top');
    }    
}

/** Redirect For Outlook Calendar */
if (is_admin()) {
    add_action('wp_loaded', array('AmeliaBooking\Infrastructure\Services\Outlook\OutlookCalendarService', 'handleCallback'));
}

/** Isolate API calls */
add_action('wp_ajax_wpamelia_api', array('AmeliaBooking\Plugin', 'wpAmeliaApiCall'));
add_action('wp_ajax_nopriv_wpamelia_api', array('AmeliaBooking\Plugin', 'wpAmeliaApiCall'));

/** Init the plugin */
add_action('plugins_loaded', array('AmeliaBooking\Plugin', 'init'));

add_action('admin_init', array('AmeliaBooking\Plugin', 'adminInit'));

/** Activation hooks */
register_activation_hook(__FILE__, array('AmeliaBooking\Plugin', 'activation'));
register_activation_hook(__FILE__, array('AmeliaBooking\Infrastructure\WP\InstallActions\ActivationRolesHook', 'init'));
register_activation_hook(__FILE__, array('AmeliaBooking\Infrastructure\WP\InstallActions\ActivationSettingsHook', 'init'));
register_uninstall_hook(__FILE__, array('AmeliaBooking\Plugin', 'deletion'));

/** Activation hook for new site on multisite setup */
add_action('wpmu_new_blog', array('AmeliaBooking\Infrastructure\WP\InstallActions\ActivationNewSiteMultisite', 'init'));

/** Define the API for updating checking */
add_filter('pre_set_site_transient_update_plugins', array('AmeliaBooking\Infrastructure\WP\InstallActions\AutoUpdateHook', 'checkUpdate'), 21, 1);

/** Define the alternative response for information checking */
add_filter('plugins_api', array('AmeliaBooking\Infrastructure\WP\InstallActions\AutoUpdateHook', 'checkInfo'), 20, 3);

/** Add a message for unavailable auto update if plugin is not activated */
add_action('in_plugin_update_message-' . AMELIA_PLUGIN_SLUG, array('AmeliaBooking\Infrastructure\WP\InstallActions\AutoUpdateHook', 'addMessageOnPluginsPage'));

/** Add error message on plugin update if plugin is not activated */
add_filter('upgrader_pre_download', array('AmeliaBooking\Infrastructure\WP\InstallActions\AutoUpdateHook', 'addMessageOnUpdate'), 10, 4);

/** Register custom query vars for getting coaches by location or activity */
add_filter( 'query_vars', array('AmeliaBooking\Plugin', 'registerQueryVars'));

/** Init custom rewrite rules */
add_action('init', array('AmeliaBooking\Plugin','coachesRewriteTagRules'), 10, 0);