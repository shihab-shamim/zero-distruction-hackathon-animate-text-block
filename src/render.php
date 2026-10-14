<?php
$id = wp_unique_id( 'atbAnimatedText-' );

?>
<div aria-hidden="true" style="display:none;"><?php echo esc_html($attributes['content']) ?></div>
<div <?php echo wp_kses_post(get_block_wrapper_attributes()) ; ?> id='<?php echo esc_attr( $id ); ?>' data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>' data-ispremium='<?php echo esc_attr(atbIsPremium()); ?>'></div>