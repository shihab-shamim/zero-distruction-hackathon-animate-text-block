import { __ } from '@wordpress/i18n';

export const generalStyleTabs = [
	{ name: 'general', title: __('General', 'animated-text-block') },
	{ name: 'style', title: __('Style', 'animated-text-block') }
];

export const FeaturesPro = [
  "Character & Word Based Animations",
  "In-View & Out-View Effects",
  "Loop & Auto Repeat Control",
  "Advanced Animation Effects",
  "Custom Styles & Typography",
  "Shortcode & Layout Support",
];

export const animateInOpt = [
	{ label: __('Char', 'animated-text-block'), value: 'char' },
	{ label: __('Word', 'animated-text-block'), value: 'word' }
];

export const effects = [
	{ label: __('Flash', 'animated-text-block'), value: 'flash' },
	{ label: __('Bounce', 'animated-text-block'), value: 'bounce' },
	{ label: __('Shake', 'animated-text-block'), value: 'shake' },
	{ label: __('Tada', 'animated-text-block'), value: 'tada' },
	{ label: __('Swing', 'animated-text-block'), value: 'swing' },
	{ label: __('Wobble', 'animated-text-block'), value: 'wobble' },
	{ label: __('Pulse', 'animated-text-block'), value: 'pulse' },
	{ label: __('Flip', 'animated-text-block'), value: 'flip' }
];

export const inEffects = [
	{ label: __('Fade In', 'animated-text-block'), value: 'fadeIn' },
	{ label: __('Flip In X', 'animated-text-block'), value: 'flipInX' },
	{ label: __('Flip In Y', 'animated-text-block'), value: 'flipInY' },
	{ label: __('Fade In Up', 'animated-text-block'), value: 'fadeInUp' },
	{ label: __('Fade In Down', 'animated-text-block'), value: 'fadeInDown' },
	{ label: __('Fade In Left', 'animated-text-block'), value: 'fadeInLeft' },
	{ label: __('Fade In Right', 'animated-text-block'), value: 'fadeInRight' },
	{ label: __('Fade In Up Big', 'animated-text-block'), value: 'fadeInUpBig' },
	{ label: __('Fade In Down Big', 'animated-text-block'), value: 'fadeInDownBig' },
	{ label: __('Fade In Left Big', 'animated-text-block'), value: 'fadeInLeftBig' },
	{ label: __('Fade In Right Big', 'animated-text-block'), value: 'fadeInRightBig' },
	{ label: __('Bounce In', 'animated-text-block'), value: 'bounceIn' },
	{ label: __('Bounce In Up', 'animated-text-block'), value: 'bounceInUp' },
	{ label: __('Bounce In Down', 'animated-text-block'), value: 'bounceInDown' },
	{ label: __('Bounce In Left', 'animated-text-block'), value: 'bounceInLeft' },
	{ label: __('Bounce In Right', 'animated-text-block'), value: 'bounceInRight' },
	{ label: __('Rotate In', 'animated-text-block'), value: 'rotateIn' },
	{ label: __('Rotate In Up Left', 'animated-text-block'), value: 'rotateInUpLeft' },
	{ label: __('Rotate In Up Right', 'animated-text-block'), value: 'rotateInUpRight' },
	{ label: __('Rotate In Down Left', 'animated-text-block'), value: 'rotateInDownLeft' },
	{ label: __('Rotate In Down Right', 'animated-text-block'), value: 'rotateInDownRight' },
	{ label: __('Roll In', 'animated-text-block'), value: 'rollIn' }
];

export const outEffects = [
	{ label: __('Fade Out', 'animated-text-block'), value: 'fadeOut' },
	{ label: __('Flip Out X', 'animated-text-block'), value: 'flipOutX' },
	{ label: __('Flip Out Y', 'animated-text-block'), value: 'flipOutY' },
	{ label: __('Fade Out Up', 'animated-text-block'), value: 'fadeOutUp' },
	{ label: __('Fade Out Down', 'animated-text-block'), value: 'fadeOutDown' },
	{ label: __('Fade Out Left', 'animated-text-block'), value: 'fadeOutLeft' },
	{ label: __('Fade Out Right', 'animated-text-block'), value: 'fadeOutRight' },
	{ label: __('Fade Out Up Big', 'animated-text-block'), value: 'fadeOutUpBig' },
	{ label: __('Fade Out Down Big', 'animated-text-block'), value: 'fadeOutDownBig' },
	{ label: __('Fade Out Left Big', 'animated-text-block'), value: 'fadeOutLeftBig' },
	{ label: __('Fade Out Right Big', 'animated-text-block'), value: 'fadeOutRightBig' },
	{ label: __('Bounce Out', 'animated-text-block'), value: 'bounceOut' },
	{ label: __('Bounce Out Up', 'animated-text-block'), value: 'bounceOutUp' },
	{ label: __('Bounce Out Down', 'animated-text-block'), value: 'bounceOutDown' },
	{ label: __('Bounce Out Left', 'animated-text-block'), value: 'bounceOutLeft' },
	{ label: __('Bounce Out Right', 'animated-text-block'), value: 'bounceOutRight' },
	{ label: __('Rotate Out', 'animated-text-block'), value: 'rotateOut' },
	{ label: __('Rotate Out Up Left', 'animated-text-block'), value: 'rotateOutUpLeft' },
	{ label: __('Rotate Out Up Right', 'animated-text-block'), value: 'rotateOutUpRight' },
	{ label: __('Rotate Out Down Left', 'animated-text-block'), value: 'rotateOutDownLeft' },
	{ label: __('Rotate Out Down Right', 'animated-text-block'), value: 'rotateOutDownRight' },
	{ label: __('Hinge', 'animated-text-block'), value: 'hinge' },
	{ label: __('Roll Out', 'animated-text-block'), value: 'rollOut' }
];

export const sequences = [
	{ label: __('Default', 'animated-text-block'), value: 'default' },
	{ label: __('Sync', 'animated-text-block'), value: 'sync' },
	{ label: __('Shuffle', 'animated-text-block'), value: 'shuffle' },
	{ label: __('Reverse', 'animated-text-block'), value: 'reverse' },
];

export const splitText = (element) => {
	const text = element.textContent;
	element.innerHTML = '';
	text.split('').forEach((char) => {
		const span = document.createElement('span');
		span.textContent = char === ' ' ? '\u00A0' : char; // Preserve spaces
		element.appendChild(span);
	});
};


export const animateTypeOptions = [
	{ label: __('Wave', 'animated-text-block'), value: 'wave' },
	{ label: __('Bounce', 'animated-text-block'), value: 'bounce' },
	{ label: __('Glitch', 'animated-text-block'), value: 'glitch' }
]

export const proFeatures = [
	{
		name: "Choose Your Preferred Theme",
		description:
			"Select the theme of your choice to personalize your experience and give your website the look and feel that suits your style."
	},
	{
		name: "Understanding Text Alignment",
		description:
			"Text alignment controls the positioning of text, improving readability and design balance."
	},
	{
		name: "Max-Width animation layouts",
		description:
			"Max-width sets the maximum width of an element, ensuring responsive and flexible layouts."
	},
	{
		name: "Enhancing Design with Text-Shadow",
		description:
			"Text-shadow adds depth and contrast to text by applying shadow effects, improving readability and aesthetics."
	},
	{
		name: "Optimizing Animation Speed",
		description:
			"Animation speed controls the duration of transitions, affecting user experience and visual smoothness."
	},
	{
		name: "Mastering Perspective Depth Control",
		description:
			"Perspective depth control adjusts the 3D depth effect, enhancing realism in visual designs."
	},
	{
		name: "Understanding Transform Origin",
		description:
			"Transform origin defines the pivot point for transformations, affecting scaling, rotation, and skewing."
	},
	{
		name: "Show/Hide Oscillation Effects",
		description:
			"Oscillation creates a smooth, back-and-forth movement, often used to add dynamic motion to elements in design."
	},
	{
		name: "Controlling Repeat Behavior in Animations",
		description:
			"Repeat behavior controls how animations loop, defining whether they restart, alternate, or stop after completing."
	},
	{
		name: "Adjusting Repeat Delay Speed",
		description: "Repeat delay speed sets the time interval between animation cycles, creating a pause before the animation restarts."
	},
	{
		name: "Exploring Animation Effects",
		description: "Animation effects enhance user interaction by adding dynamic movements and transitions to elements on a webpage or interface."
	},
	{
		name: "Applying Random Text Color",
		description: "Random text color changes the color of text dynamically, creating visual variety and interest in designs."
	},
	{
		name: "Applying Forward Font Stretch",
		description: "Forward font stretch adjusts the horizontal spacing of characters, making text wider or narrower for enhanced readability or style."
	},
	{
		name: "Adjusting Animation Duration",
		description: "Animation duration defines the length of time an animation takes to complete, influencing the speed and smoothness of the effect."
	},
	{
		name: "Show/Hide Animation Repeat",
		description: "Infinite animation repeat ensures an animation loops continuously, creating a never-ending effect without stopping."
	}
];

export const helpfulLinks = [
	{
		title: 'Need any Assistance?',
		description: 'Our Expert Support Team is always ready to help you out promptly.',
		iconClass: 'fa fa-life-ring',
		link: 'https://bplugins.com/support',
		linkText: 'Contact Support'
	},
	{
		title: 'Looking for Documentation?',
		description: 'We have detailed documentation on every aspects of the plugin.',
		iconClass: 'fa fa-file-text',
		link: 'http://bplugins.com/docs/animated-text-block',
		linkText: 'Documentation'
	},
	{
		title: 'Liked This Plugin?',
		description: 'Glad to know that, you can support us by leaving a 5 &#11088; rating.',
		iconClass: 'fa fa-thumbs-up',
		link: 'https://wordpress.org/support/plugin/animated-text-block/reviews/#new-post',
		linkText: 'Rate the Plugin'
	}
];