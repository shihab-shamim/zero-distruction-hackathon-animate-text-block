<?php

/**
 * Plugin Name: Animated Text Block
 * Description: Apply animation on any text.
 * Version: 1.2.5
 * Author: bPlugins
 * Author URI: https://bplugins.com
 * License: GPLv3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain: animated-text-block
 * @fs_premium_only /freemius
 * @fs_free_only, /bplugins_sdk
 */

// ABS PATH
if (! defined('ABSPATH')) {
	exit;
}

if (function_exists('atb_fs')) {
	atb_fs()->set_basename(true, __FILE__);
} 
else {
	define('ATB_VERSION', isset($_SERVER['HTTP_HOST']) && 'localhost' === $_SERVER['HTTP_HOST'] ? time() : '1.2.5');
	define('ATB_DIR_URL', plugin_dir_url(__FILE__));
	define('ATB_DIR_PATH', plugin_dir_path(__FILE__));
	define('ATB_HAS_FREE', 'animated-text-block/plugin.php' === plugin_basename(__FILE__));
	define('ATB_HAS_PRO', 'animated-text-block-pro/plugin.php' === plugin_basename(__FILE__));

	if (! function_exists('atb_fs')) {
		// Create a helper function for easy SDK access.
		function atb_fs()
		{
			global $atb_fs;

			if (! isset($atb_fs)) {
				$fsStartPath = dirname(__FILE__) . '/freemius/start.php';
				$bSDKInitPath = dirname(__FILE__) . '/freemius-lite/start.php';

				if (ATB_HAS_PRO && file_exists($fsStartPath)) {
					require_once $fsStartPath;
				} else if (ATB_HAS_FREE && file_exists($bSDKInitPath)) {
					require_once $bSDKInitPath;
				}

				$atbConfig = array(
					'id'                  => '17879',
					'slug'                => 'animated-text-block',
					'premium_slug'        => 'animated-text-block-pro',
					'type'                => 'plugin',
					'public_key'          => 'pk_64045f2c4e13c86dc40f805c6062b',
					'is_premium'          => true,
					'premium_suffix'      => 'Pro',
					// If your plugin is a serviceware, set this option to false.
					'has_premium_version' => true,
					'has_addons'          => false,
					'has_paid_plans'      => true,
					'trial'               => array(
						'days'               => 7,
						'is_require_payment' => false,
					),
					'menu'                => array(
						'slug'           => 'edit.php?post_type=animated-text-block',
						'first-path'           => 'edit.php?post_type=animated-text-block&page=atb_demo_page',
						'support'        => false,
					),
				);

				$atb_fs = (ATB_HAS_PRO && file_exists($fsStartPath)) ? fs_dynamic_init($atbConfig) : fs_lite_dynamic_init($atbConfig);
			}

			return $atb_fs;
		}

		// Init Freemius.
		atb_fs();
		// Signal that SDK was initiated.
		do_action('atb_fs_loaded');
	}

	// ... Your plugin's main file logic ...

	function atbIsPremium(){
		return ATB_HAS_PRO ? atb_fs()->can_use_premium_code() : false;
	}

	if (!class_exists('ATBPlugin')) {
		class ATBPlugin
		{

			public function __construct()
			{
				add_action('enqueue_block_assets', [$this, 'enqueueBlockAssets']);
				add_action('init', [$this, 'onInit']);

				// sub menu function hooks
				add_action('admin_menu', [$this, 'addSubmenu']);
				add_action('admin_enqueue_scripts', [$this, 'adminEnqueueScripts']);

				// premium checker
				add_action('wp_ajax_atbPipeChecker', [$this, 'atbPipeChecker']);
				add_action('wp_ajax_nopriv_atbPipeChecker', [$this, 'atbPipeChecker']);

				// dashboard settings (delete data on uninstall)
				add_action('wp_ajax_atbSaveUninstallOption', [$this, 'atbSaveUninstallOption']);

				// Post Type function hooks 
				add_action('init', array($this, 'atb_animated_text_block_post_type'));

				// shortcode type function hooks 
				add_shortcode('animated-text', [$this, 'atb_shortcode_handler']);

				//manage column 
				add_filter('manage_animated-text-block_posts_columns', [$this, 'animatedTextManageColumns'], 10);

				// Custom manage column 
				add_action('manage_animated-text-block_posts_custom_column', [$this, 'animatedTextManageCustomColumns'], 10, 2);
			}

			//manage column
			function animatedTextManageColumns($defaults)
			{
				unset($defaults['date']);
				$defaults['shortcode'] = 'ShortCode';
				$defaults['date'] = 'Date';
				return $defaults;
			}

			// custom manage column
			function animatedTextManageCustomColumns($column_name, $post_ID)
			{
				if ($column_name == 'shortcode') {
					echo '<div class="bPlAdminShortcode" id="bPlAdminShortcode-' . esc_attr($post_ID) . '">
				 <input value="[animated-text id=' . esc_attr($post_ID) . ']" onclick="copyBPlAdminShortcode(\'' . esc_attr($post_ID) . '\')" readonly>
				 <span class="tooltip">Copy To Clipboard</span>
			 </div>';
				}
			}

			public function atb_shortcode_handler($atts)
			{
				$post_id = $atts['id'];
				$post = get_post($post_id);
				if (!$post) {
					return '';
				}
				if (post_password_required($post)) {
					return get_the_password_form($post);
				}
				switch ($post->post_status) {
					case 'publish':
						return $this->displayContent($post);
					case 'private':
						if (current_user_can('read_private_posts')) {
							return $this->displayContent($post);
						}
						return '';
					case 'draft':
					case 'pending':
					case 'future':
						if (current_user_can('edit_post', $post_id)) {
							return $this->displayContent($post);
						}
						return '';
					default:
						return '';
				}
			}

			public function displayContent($post)
			{
				$blocks = parse_blocks($post->post_content);
				return render_block($blocks[0]);
			}


			// Custom Post Type function calls
			function atb_animated_text_block_post_type()
			{

				$menuIcon = "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 195 195' fill='#fff'><path fill='#fff' d='M40.4 53.2C25.6 64.3 17.9 79.5 17.9 97.5C17.9 104.9 18.4 108.5 20.5 114.5C24.2 125.7 30.6 134.4 40.5 141.9L43.5 144.2L39 143.5C12.7 139.2 -5.1 112.1 1.5 86.5C5.9 69.8 19.7 55.9 35.7 52.1C42.5 50.5 43.6 50.7 40.4 53.2Z' /><path fill='#fff' d='M65.4 53.2C50.6 64.3 42.9 79.5 42.9 97.5C42.9 104.9 43.4 108.5 45.5 114.5C49.2 125.7 55.6 134.4 65.5 141.9L68.5 144.2L64 143.5C37.7 139.2 19.9 112.1 26.5 86.5C30.9 69.8 44.7 55.9 60.7 52.1C67.5 50.5 68.6 50.7 65.4 53.2Z' /><path fill='#fff' d='M91.4 53.2C76.6 64.3 68.9 79.5 68.9 97.5C68.9 104.9 69.4 108.5 71.5 114.5C75.2 125.7 81.6 134.4 91.5 141.9L94.5 144.2L90 143.5C63.7 139.2 45.9 112.1 52.5 86.5C56.9 69.8 70.7 55.9 86.7 52.1C93.5 50.5 94.6 50.7 91.4 53.2Z' /><path fill='#fff' d='M116.4 53.2C101.6 64.3 93.9 79.5 93.9 97.5C93.9 104.9 94.4 108.5 96.5 114.5C100.2 125.7 106.6 134.4 116.5 141.9L119.5 144.2L115 143.5C88.7 139.2 70.9 112.1 77.5 86.5C81.9 69.8 95.7 55.9 111.7 52.1C118.5 50.5 119.6 50.7 116.4 53.2Z' /><path fill='#fff' d='M161.9 52.9C177.8 57.8 190.5 71.8 193.9 87.8C199.9 116.6 177.8 144.1 148.7 144C134.9 143.9 124.9 139.9 115.4 130.5C96.7 111.9 96.7 83 115.4 64.5C121.7 58.3 128.2 54.5 136 52.4C142.9 50.5 154.9 50.7 161.9 52.9Z' /></svg>";

				register_post_type(
					'animated-text-block',
					array(
						'label' => 'Animated Text',
						'labels' => [
							'name' => 'Animated Text',
							'singular_name' => 'Animated Text',
							'menu_name' => 'Animated Text',
							'all_items' => 'ShortCode Generator',
							'add_new' => 'Add New ShortCode',
							'add_new_item' => 'Add New ShortCode',
							'edit_item' => 'Edit Animated',
							'not_found' => 'There is no please add one',
							'item_published' => 'Published',
							'item_updated' => 'Updated'
						],
						'public' => false,
						'show_ui' => true,
						'show_in_rest' => true,
						'menu_icon' =>  'data:image/svg+xml;base64,' . base64_encode($menuIcon),
						'template' => [['atb/animated-text']],
						'template_lock' => 'all',
					)
				);
			}


			function atbPipeChecker()
			{
				$nonce = $_POST['_wpnonce'] ?? null;

				if (!wp_verify_nonce($nonce, 'wp_rest')) {
					wp_send_json_error('Invalid Request');
				}

				wp_send_json_success([
					'isPipe' => atbIsPremium()
				]);
			}

			function enqueueBlockAssets()
			{
				wp_register_style('animate', ATB_DIR_URL . 'public/css/animate.min.css', [], '4.1.1');
				wp_register_script('textillate', ATB_DIR_URL . 'public/js/jquery.textillate.min.js', ['jquery'], ATB_VERSION, true);
			}

			function onInit()
			{
				register_block_type(__DIR__ . '/build');
			}

			function addSubmenu()
			{
				add_submenu_page(
					'edit.php?post_type=animated-text-block',
					'Demo Page',
					'Help & Demos',
					'manage_options',
					'atb_demo_page',
					[$this, 'atb_render_demo_page']
				);
			}

			function renderTemplate($content)
			{
				$parseBlocks = parse_blocks($content);
				return render_block($parseBlocks[0]);
			}


			function atb_render_demo_page() {
				?>
				<div 
					id="atbDashboard"
					data-info="<?php echo esc_attr(wp_json_encode([
						'version'=>ATB_VERSION,
						'isPremium' =>atbIsPremium(),
						'hasPro' => ATB_HAS_PRO,
                    	'licenseActiveNonce' => wp_create_nonce( 'bPlLicenseActivation' ),
						'adminUrl' => admin_url(),
						'deleteDataOnUninstall' => (bool) get_option( 'atbDeleteDataOnUninstall', false ),
						'uninstallNonce' => wp_create_nonce( 'atb_save_uninstall_option' )
						]))?>"
						>
				</div>
				<?php
			}

			// Persist the dashboard "delete data on uninstall" toggle.
			// Contract matches bpl-tools/Admin/Settings: reads $_POST['nonce'] and $_POST['enabled'].
			function atbSaveUninstallOption() {
				$nonce = sanitize_text_field( wp_unslash( $_POST['nonce'] ?? '' ) );

				if ( ! wp_verify_nonce( $nonce, 'atb_save_uninstall_option' ) ) {
					wp_send_json_error( [ 'message' => __( 'Invalid security token.', 'animated-text-block' ) ], 403 );
				}

				if ( ! current_user_can( 'manage_options' ) ) {
					wp_send_json_error( [ 'message' => __( 'You do not have permission to perform this action.', 'animated-text-block' ) ], 403 );
				}

				$raw_enabled = isset( $_POST['enabled'] ) ? sanitize_text_field( wp_unslash( $_POST['enabled'] ) ) : '';
				$enabled     = ( 'true' === $raw_enabled || '1' === $raw_enabled );

				update_option( 'atbDeleteDataOnUninstall', $enabled );

				wp_send_json_success( [
					'enabled' => $enabled,
					'message' => $enabled
						? __( 'Data deletion enabled.', 'animated-text-block' )
						: __( 'Data will be preserved on uninstall.', 'animated-text-block' ),
				] );
			}

			function adminEnqueueScripts()
			{
				$screen = get_current_screen();

				if (isset($screen->post_type) && $screen->post_type === 'animated-text-block') {
					// dashboard shortcode copy function
					wp_enqueue_style('shortcode-style', ATB_DIR_URL . 'build/shortcode-style.css', [], ATB_VERSION);
					wp_enqueue_script('shortcode-js', ATB_DIR_URL . 'build/shortcode-js.js', [], ATB_VERSION, true);
				}

				// live frontend preview in dashboard
				wp_register_script('atb-view', ATB_DIR_URL . 'build/view.js', ['react', 'react-dom'], ATB_VERSION, true);
				wp_register_style('fontAwesome', ATB_DIR_URL . 'assets/css/font-awesome.min.css', [], ATB_VERSION);
				wp_register_style('atb-view', ATB_DIR_URL . 'build/view.css', ['fontAwesome'], ATB_VERSION);

				if (isset($screen->base) && $screen->base === 'animated-text-block_page_atb_demo_page') {
					wp_enqueue_script('fs', ATB_DIR_URL . 'assets/js/fs.js', [], filemtime(ATB_DIR_PATH . 'assets/js/fs.js'), true);
					wp_enqueue_style('atb-dashboard-help', ATB_DIR_URL . 'build/dashboard.css', ['atb-view'], ATB_VERSION);
					wp_enqueue_script('atb-dashboard-help', ATB_DIR_URL . 'build/dashboard.js', ['react', 'wp-api', 'react-dom', 'wp-components', 'fs', 'wp-util'], ATB_VERSION, true);
					wp_set_script_translations('atb-dashboard-help', 'animated-text-block', ATB_DIR_URL . 'languages');
				}
			}
		}
		new ATBPlugin();
	}

	if (ATB_HAS_PRO) {
		require_once ATB_DIR_PATH . 'inc/LicenseActivation.php';
	}
}
