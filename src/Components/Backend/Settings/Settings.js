import { __ } from '@wordpress/i18n';
import { InspectorControls, BlockControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TabPanel, TextareaControl, ToggleControl, SelectControl, RangeControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Label, Background, ColorControl, BtnGroup, Typography, HelpPanel, Device, ShadowControl, Gradient } from '../../../../../bpl-tools/Components';
import { BorderControl, SpaceControl } from '../../../../../bpl-tools/Components/Deprecated';
import { tabController, updateData } from '../../../../../bpl-tools/utils/functions';
import { SelectControlPro, BControlPro, ProModal } from '../../../../../bpl-tools/ProControls';

import { pluginSlug, animatedTextDocs, pricingPage } from '../../../utils/data';
import { animateTypeOptions, FeaturesPro, generalStyleTabs } from '../../../utils/options';
import { animateInOpt, effects, inEffects, outEffects, sequences } from '../../../utils/options';
import { highlightDefaults, highlightShapeOptions, textScrollDefaults, textScrollEffectOptions, modernFxDefaults, modernFxEffectOptions, modernFxSideDefaults, modernFxUsesSides } from '../../../utils/options';
import { withSelect } from '@wordpress/data';
import { produce } from 'immer';
import { useState } from 'react';
import { themeSwitch } from '../../../utils/config';
import { ToolbarGroup } from '@wordpress/components';
import { DropdownMenu } from '@wordpress/components';
import { TextControl } from '@wordpress/components';
import ThemeSwitcher from '../../../utils/panel/ThemeSwitcher';

const Settings = ({ attributes, setAttributes, isPremium, device }) => {
	const { loop, animateIn, inEffect, inSequence, outEffect, outSequence, background, content, typography, color, padding, border, options, gsapAnimation = {}, animatedSize = {}, textAlignment = "center", repeat = true, alignment, prefixText = "", suffixText = "", prefixColor = "", prefixTypo = {}, suffixColor = "", suffixTypo = {}, highlight = {}, textScroll = {}, modernFx = {} } = attributes;


	const [alertAnimationSpeed, setAlertAnimationSpeed] = useState(null);
	const [alertRandomColor, setAlertRandomColor] = useState(null);
	const [alertShadow, setAlertShadow] = useState(null);

	const [isProModalOpen, setIsProModalOpen] = useState(false);

	const premiumProps = { isPremium, setIsProModalOpen };


	// Define available easing options
	const easeOptions = [
		{ label: "Elastic", value: "elastic(0.3, 0.2)" },
		{ label: "Bounce", value: "bounce.out" }
	];

	const itemOption = [
		{ label: "Default", value: "default", isPro: false },
		{ label: "Wave Reveal", value: "type2", isPro: false },
		{ label: "Zoom", value: "type3", isPro: false },
		{ label: "Swaying", value: "type4", isPro: false },
		{ label: "3D Orbit", value: "type1", isPro: true },
		{ label: "Axis Wave", value: "type5", isPro: true },
		{ label: "Elastic Drop", value: "type6", isPro: true },
		{ label: "Stretch Wave", value: "type7", isPro: true },
		{ label: "Typewriter", value: "type8", isPro: true },
		{ label: "Flourish", value: "type9", isPro: true },
		{ label: "Shaky TV", value: "type10", isPro: true },
		{ label: "Highlight", value: "type11", isPro: true },
		{ label: "Text Scroll", value: "type12", isPro: true },
		{ label: "Modern Effects", value: "type13", isPro: true },
	]

	const { theme = {} } = options;
	const { animationSpeed = 30, perspectiveDepth = 800, enableOscillation = true, repeatBehavior, repeatDelay = 2, animationEffect = "default", autoRepeat = true, transformOrigin = 400, randomColor = false, isTextShadow = false, textShadow = [], fontStretch = "200%", animationDuration = 1, waveEffect = 25, easeType = "elastic(0.3, 0.2)", scaleX = 1.5, scaleY = 0.5, typingSpeed, reStartTime = 1000, animateType = 'wave' } = gsapAnimation;

	const { shape: hlShape, colorType: hlColorType, color: hlColor, gradient: hlGradient, strokeWidth: hlStrokeWidth, markerHeight: hlMarkerHeight, roundedEnds: hlRoundedEnds, position: hlPosition, duration: hlDuration, delay: hlDelay, loop: hlLoop, loopDelay: hlLoopDelay } = { ...highlightDefaults, ...highlight };
	const updateHighlight = (property, val) => {
		const newHighlight = produce({ ...highlightDefaults, ...highlight }, draft => {
			draft[property] = val;
		});
		setAttributes({ highlight: newHighlight });
	};

	const { effect: tsEffect, fadedOpacity: tsFadedOpacity, fadedColor: tsFadedColor, start: tsStart, end: tsEnd, smoothness: tsSmoothness, reverse: tsReverse, maskColor: tsMaskColor, maskOpacity: tsMaskOpacity, maskDirection: tsMaskDirection } = { ...textScrollDefaults, ...textScroll };
	const tsIsMask = 'verticalMask' === tsEffect || 'horizontalMask' === tsEffect;
	const updateTextScroll = (property, val) => {
		const newTextScroll = produce({ ...textScrollDefaults, ...textScroll }, draft => {
			draft[property] = val;
		});
		setAttributes({ textScroll: newTextScroll });
	};

	const fx = { ...modernFxDefaults, ...modernFx };
	const fxEffect = fx.effect;
	const fxSides = 'type13' === theme && modernFxUsesSides.includes(fxEffect);
	const updateFx = (property, val) => {
		const newFx = produce(fx, draft => {
			draft[property] = val;
		});
		const extra = {};
		// Give a ready-to-see word list when switching to Rotating Words (Before/After use display defaults)
		if ('effect' === property) {
			const isWordList = /\||\n/.test(content || '');
			if ('rotating' === val && !isWordList) extra.content = 'faster|smarter|bolder';
			if ('rotating' === fxEffect && 'rotating' !== val && isWordList) extra.content = 'Design that moves people.';
		}
		setAttributes({ modernFx: newFx, ...extra });
	};
	const fxRange = (label, property, min, max, step, help) => <BControlPro
		label={label}
		value={fx[property]}
		onChange={val => updateFx(property, val)}
		min={min}
		max={max}
		step={step}
		help={help}
		{...premiumProps}
		Component={RangeControl}
	/>;
	const fxSelect = (label, property, opts) => <SelectControlPro
		label={label}
		labelPosition="left"
		className='mt10'
		value={fx[property]}
		options={opts}
		onChange={val => updateFx(property, val)}
		{...premiumProps}
		proValues={opts.map(o => o.value)}
	/>;
	const fxText = (label, property, help) => <BControlPro
		label={label}
		value={fx[property]}
		onChange={val => updateFx(property, val)}
		help={help}
		{...premiumProps}
		Component={TextControl}
	/>;
	const fxToggle = (label, property, help) => <BControlPro
		label={label}
		checked={!!fx[property]}
		onChange={val => updateFx(property, val)}
		help={help}
		{...premiumProps}
		Component={ToggleControl}
	/>;
	const fxColor = (label, property, defaultColor) => <BControlPro
		className='mt10'
		label={label}
		value={fx[property] || defaultColor}
		defaultColor={fx[property] && defaultColor ? defaultColor : undefined}
		onChange={val => updateFx(property, val === defaultColor ? '' : val)}
		{...premiumProps}
		Component={ColorControl}
	/>;
	const fxEaseOptions = [
		{ label: __('Smooth', 'animated-text-block'), value: 'smooth' },
		{ label: __('Snappy', 'animated-text-block'), value: 'snappy' },
		{ label: __('Bouncy', 'animated-text-block'), value: 'bouncy' },
		{ label: __('Linear', 'animated-text-block'), value: 'linear' }
	];
	const fxOneShot = ['blurIn', 'scramble', 'lineMask', 'countUp'].includes(fxEffect);

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={tabController}>{tab => <>
				{'general' === tab.name && <>
					<HelpPanel slug={pluginSlug} docsLink={animatedTextDocs} />

					<PanelBody title={__("Animation Options:", "animated-text-block")} initialOpen={true}>
						<SelectControlPro
							label={__("Animation Styles:", "animated-text-block")}
							value={theme}
							options={itemOption}
							labelPosition="left"
							onChange={(val) => setAttributes(themeSwitch(val, attributes))}
							{...premiumProps}
							proValues={['type1', 'type5', 'type6', 'type7', 'type8', 'type9', 'type10', 'type11', 'type12', 'type13']}
						/>


						<SelectControlPro
							label="Text Alignment"
							labelPosition="left"
							className="mt10"
							value={textAlignment}
							options={[
								{ label: "Left", value: "left" },
								{ label: "Center", value: "center" },
								{ label: "Right", value: "right" }
							]}
							onChange={(newAlignment) =>
								setAttributes({ textAlignment: newAlignment }) // Update the attribute on change
							}
						/>

						<PanelRow>
							<Label className='mb5'>{__('Animated max width:', 'animated-text-block')}</Label>
							<Device />
						</PanelRow>

						<BControlPro
							className='mb10'
							value={animatedSize?.width[device]}
							onChange={val => setAttributes({ animatedSize: updateData(animatedSize, val, "width", device) })} beforeIcon='grid-view'
							step={1}
							max={100}
							min={1}
							Component={UnitControl}
							{...premiumProps}
						/>

						{
							("type1" === theme) && <>
								<PanelRow>
									<Label className='mb5'>{__('Animated min height:', 'animated-text-block')}</Label>
									<Device />
								</PanelRow>

								<BControlPro
									className='mb5'
									value={animatedSize?.height[device]}
									onChange={val => setAttributes({ animatedSize: updateData(animatedSize, val, "height", device) })}
									beforeIcon='grid-view'
									step={1}
									min={10}
									Component={UnitControl}
									{...premiumProps}
								/>
							</>
						}

					</PanelBody>


					<PanelBody className='bPlPanelBody atbTextSettingsPanel' title={__('Animated Text Settings', 'animated-text-block')} initialOpen={false}>

						{/* Prefix Text section */}
						{
							("default" === theme || "type2" === theme || "type3" === theme || "type4" === theme || "type5" === theme || "type6" === theme || "type7" === theme || "type8" === theme || "type9" === theme || "type10" === theme || "type11" === theme || fxSides) && <>
								<Label className='mt10'>{("type11" === theme || fxSides) ? __('Before Text:', 'animated-text-block') : __('Prefix Text:', 'animated-text-block')}</Label>
								<TextControl value={"type11" === theme ? (prefixText || "Make your words") : fxSides ? (prefixText || modernFxSideDefaults[fxEffect][0]) : prefixText} placeholder={__("Type your prefix content", "animated-text-block")} onChange={val => setAttributes({ prefixText: val })} />
							</>
						}

						{!("type13" === theme && "countUp" === fxEffect) && <Label className='mb5'>{"type11" === theme ? __('Highlighted Text:', 'animated-text-block') : ("type13" === theme && "rotating" === fxEffect) ? __('Rotating Words:', 'animated-text-block') : __('Animate text:', 'animated-text-block')}</Label>}

						{
							"type13" === theme && "countUp" !== fxEffect && <TextareaControl
								value={content}
								onChange={val => setAttributes({ content: val })}
								placeholder='Please type here'
								help={"rotating" === fxEffect ? __('Separate the words with | or put each on a new line.', 'animated-text-block') : __('Press Enter to start a new paragraph.', 'animated-text-block')}
							/>
						}

						{
							("default" === theme || "type1" === theme || "type4" === theme || "type7" === theme || "type10" === theme || "type12" === theme) && <TextareaControl
								value={content}
								onChange={val => setAttributes({ content: val })}
								placeholder='Please type here'
							/>
						}

						{
							("type2" === theme || "type3" === theme || "type5" === theme || "type6" === theme || "type8" === theme || "type9" === theme) && <TextareaControl
								value={content}
								onChange={val => setAttributes({ content: val })}
								placeholder='Please type here'
								help="Add multiple sentence, Separate texts using ( | ) to animate them one by one."
							/>
						}

						{
							"type11" === theme && <TextControl
								value={content}
								onChange={val => setAttributes({ content: val })}
								placeholder={__('Type the word(s) to highlight', 'animated-text-block')}
								help={__('Keep it short (one to a few words). The highlighted text stays on one line.', 'animated-text-block')}
							/>
						}



						{
							"type7" === theme && <>
								<p style={{ color: "#DF6D14" }}>Use a single-line text. Multiple lines do not animate properly.</p>
							</>
						}
						{
							("type4" === theme) && <p style={{ color: "#DF6D14" }}>Not working here white space for this animate</p>
						}
						{
							("type10" === theme) && <>
								{
									"wave" === animateType && <p style={{ color: "#DF6D14" }}>Not working here white space for this animate</p>
								}
							</>
						}


						{
							"default" === theme && <>
								<ToggleControl className='mt20' label={__('Loop', 'animated-text-block')} checked={loop} onChange={val => setAttributes({ loop: val })} />
								<small>{__('Loop will not work instantly in editor! you have to refresh the page.', 'animated-text-block')}</small>

								<PanelRow>
									<Label className=''>{__('Animate in:', 'animated-text-block')}</Label>
									<BtnGroup value={animateIn} onChange={val => setAttributes({ animateIn: val })} options={animateInOpt} />
								</PanelRow>

								<PanelRow>
									<Label className=''>{__('In Effect:', 'animated-text-block')}</Label>
									<SelectControl value={inEffect} onChange={val => setAttributes({ inEffect: val })} options={[...effects, ...inEffects]} />
								</PanelRow>

								<PanelRow>
									<Label className=''>{__('In Sequence:', 'animated-text-block')}</Label>
									<SelectControl value={inSequence} onChange={val => setAttributes({ inSequence: val })} options={sequences} />
								</PanelRow>

								{loop && <>
									<PanelRow>
										<Label className=''>{__('Out Effect:', 'animated-text-block')}</Label>
										<SelectControl value={outEffect} onChange={val => setAttributes({ outEffect: val })} options={[...effects, ...outEffects]} />
									</PanelRow>

									<PanelRow>
										<Label className=''>{__('Out Sequence:', 'animated-text-block')}</Label>
										<SelectControl value={outSequence} onChange={val => setAttributes({ outSequence: val })} options={sequences} />
									</PanelRow>
								</>}
							</>
						}

						{
							"type1" === theme && <>
								<PanelBody className='bPlPanelBody' title={__('Animation Control', 'animated-text-block')}>

									{/* Animation speed control */}
									<BControlPro
										label="Animation Speed (seconds)"
										value={animationSpeed}
										onChange={(val) => {
											const newSpeed = produce(gsapAnimation, draft => {
												draft.animationSpeed = val;
											})
											setAttributes({ gsapAnimation: newSpeed });
										}}
										min={5}
										max={40}
										step={1}
										help="Adjust the speed of the animation. Lower values mean faster rotation."
										Component={RangeControl}
										{...premiumProps}
									/>

									{/* perspectiveDepth Control */}
									<SelectControlPro
										label="Perspective Depth"
										labelPosition="left"
										value={perspectiveDepth}
										options={[
											{ label: "Shallow (500px)", value: 500 },
											{ label: "Medium (800px)", value: 800 },
											{ label: "Deep (1200px)", value: 1200 },
										]}
										onChange={(value) => {
											const newDepth = produce(gsapAnimation, draft => {
												draft.perspectiveDepth = parseInt(value, 10);
											})
											setAttributes({ gsapAnimation: newDepth });
										}}
										help="Adjust the depth of the 3D animation perspective."
										{...premiumProps}
										proValues={['500', '800', '1200']}
									/>

									{/* transformOrigin Control */}
									<SelectControlPro
										label="TransformOrigin Fat"
										labelPosition="left"
										value={transformOrigin}
										options={[
											{ label: "Normal Fat (400)", value: 400 },
											{ label: "Medium Fat (800)", value: 800 },
											{ label: "Large Fat (1200)", value: 1200 },
										]}
										onChange={(value) => {
											const newFat = produce(gsapAnimation, draft => {
												draft.transformOrigin = parseInt(value, 10);
											})
											setAttributes({ gsapAnimation: newFat });
										}}
										help="Adjust the fat with your device"
										{...premiumProps}
										proValues={['400', '800', '1200']}
									/>

									{/* Enable Oscillation controller */}
									<BControlPro
										label="Enable Oscillation"
										checked={enableOscillation}
										onChange={(newValue) =>
											setAttributes({
												gsapAnimation: { ...gsapAnimation, enableOscillation: newValue },
											})
										}
										{...premiumProps}
										Component={ToggleControl}
									/>

									{/* repeatBehavior Control */}
									{
										enableOscillation && <SelectControlPro
											label="Repeat Behavior"
											labelPosition="left"
											className='mt10'
											value={repeatBehavior}
											options={[
												{ label: 'Infinite', value: -1 },
												{ label: '1 Time', value: 0 },
												{ label: '2 Times', value: 2 },
												{ label: '3 Times', value: 3 },
												{ label: '4 Times', value: 4 },
												{ label: '5 Times', value: 5 },
												{ label: '6 Times', value: 6 },
												{ label: '7 Times', value: 7 },
												{ label: '8 Times', value: 8 },
												{ label: '9 Times', value: 9 },
												{ label: '10 Times', value: 10 },
											]}
											help="Choose how many times the animation should repeat. Set to 'Infinite' for a continuous loop, or specify a number for limited rotations."
											onChange={(newValue) =>
												setAttributes({
													gsapAnimation: {
														...gsapAnimation,
														repeatBehavior: parseInt(newValue, 10), // Ensure it's an integer
													},
												})
											}
											{...premiumProps}
											proValues={['0', '1', '2,', '3', '4', '5', '6', '7', '8', '9', '10', '-1']}
										/>
									}
								</PanelBody>
							</>
						}

						{
							"type2" === theme && <>
								<PanelBody className='bPlPanelBody' title={__('Animation Control', 'animated-text-block')}>
									{/* Animation speed control */}
									<BControlPro
										label="Animation Speed (seconds)"
										value={animationSpeed}
										onChange={(val) => {
											const newSpeed = produce(gsapAnimation, draft => {
												draft.animationSpeed = val;
											})
											setAttributes({ gsapAnimation: newSpeed });
										}}
										min={0.5}
										max={3}
										step={0.1}
										help="Adjust the speed of the animation"
										{...premiumProps}
										Component={RangeControl}
									/>

									{/* Animation repeatDelay Control */}
									<BControlPro
										label="RepeatDelay Speed (seconds)"
										value={repeatDelay}
										onChange={(val) => {
											const newSpeed = produce(gsapAnimation, draft => {
												draft.repeatDelay = val;
											})
											setAttributes({ gsapAnimation: newSpeed });
										}}
										min={1}
										step={0.1}
										help="Adjust the speed of the repeatDelay animation"
										{...premiumProps}
										Component={RangeControl}
									/>

									<SelectControlPro
										label="Animation Effect"
										labelPosition="left"
										value={animationEffect}
										options={[
											{ label: "Default", value: "default" },
											{ label: "Fade", value: "fade" },
											{ label: "Zoom", value: "zoom" },
											{ label: "Rotate", value: "rotate" },
											{ label: "Slide", value: "slide" },
										]}
										onChange={val => {
											const newEffect = produce(gsapAnimation, draft => {
												draft.animationEffect = val;
											})
											setAttributes({ gsapAnimation: newEffect });
										}}
										help="Select the animation style for your text."
										{...premiumProps}
										proValues={['default', 'fade', 'zoom', 'rotate', 'slide']}
									/>

									{/* Auto Repeat Animation */}
									<BControlPro
										label="Auto Repeat Animation"
										checked={autoRepeat}
										onChange={val => {
											const newRepeat = produce(gsapAnimation, draft => {
												draft.autoRepeat = val;
											})
											setAttributes({ gsapAnimation: newRepeat });
										}}
										help={
											autoRepeat
												? "The animation will repeat infinitely."
												: "The animation will play only once."
										}
										{...premiumProps}
										Component={ToggleControl}
									/>
								</PanelBody>
							</>
						}

						{
							"type3" === theme && <>
								<PanelBody className='bPlPanelBody' title={__('Animation Control', 'animated-text-block')}>

									{/* Animation speed control */}
									<BControlPro
										label="Animation Speed (seconds)"
										value={animationSpeed}
										onChange={(val) => {
											const newSpeed = produce(gsapAnimation, draft => {
												draft.animationSpeed = val;
											})
											setAttributes({ gsapAnimation: newSpeed });
										}}
										min={0.5}
										max={10}
										step={0.1}
										help="Adjust the speed of the animation"
										{...premiumProps}
										Component={RangeControl}
									/>
								</PanelBody>

								{/* Repeat Count Animation */}
								<SelectControlPro
									label="Repeat Behavior"
									labelPosition="left"
									className='mt10'
									value={repeatBehavior}
									options={[
										{ label: 'Infinite', value: -1 },
										{ label: '1 Time', value: 0 },
										{ label: '2 Times', value: 2 },
										{ label: '3 Times', value: 3 },
										{ label: '4 Times', value: 4 },
										{ label: '5 Times', value: 5 },
									]}
									help="Choose how many times the animation should repeat. Set to 'Infinite' for a continuous loop, or specify a number for limited rotations."
									onChange={(newValue) =>
										setAttributes({
											gsapAnimation: {
												...gsapAnimation,
												repeatBehavior: parseInt(newValue, 10), // Ensure it's an integer
											},
										})
									}
									{...premiumProps}
									proValues={['-1', '0', '2', '3', '4', '5']}
								/>

								{/* Repeat Delay Control */}
								<BControlPro
									label="RepeatDelay Speed (seconds)"
									value={repeatDelay}
									onChange={(val) => {
										const newSpeed = produce(gsapAnimation, draft => {
											draft.repeatDelay = val;
										})
										setAttributes({ gsapAnimation: newSpeed });
									}}
									max={20}
									min={0.5}
									step={0.1}
									help="Adjust the speed of the repeatDelay animation"
									{...premiumProps}
									Component={RangeControl}
								/>

							</>
						}

						{
							"type4" === theme && <>
								<BControlPro
									label="Forward Font Stretch"
									value={parseInt(fontStretch)}
									onChange={(val) => {
										const newSpeed = produce(gsapAnimation, draft => {
											draft.fontStretch = `${val}%`;
										})
										setAttributes({ gsapAnimation: newSpeed });
									}}
									step={10}
									min={100}
									max={500}
									{...premiumProps}
									Component={RangeControl}
								/>

								<BControlPro
									label="Animation Duration"
									value={animationDuration}
									onChange={(val) => {
										const newSpeed = produce(gsapAnimation, draft => {
											draft.animationDuration = val;
										})
										setAttributes({ gsapAnimation: newSpeed });
									}}
									step={0.1}
									min={0.5}
									max={5}
									{...premiumProps}
									Component={RangeControl}
								/>

								<BControlPro
									label="Wave Effect Character"
									value={waveEffect}
									onChange={(val) => {
										const newSpeed = produce(gsapAnimation, draft => {
											draft.waveEffect = val;
										})
										setAttributes({ gsapAnimation: newSpeed });
									}}
									step={1}
									min={10}
									max={50}
									{...premiumProps}
									Component={RangeControl}
								/>
							</>
						}

						{
							"type5" === theme && <>
								<BControlPro
									label="Repeat Animation"
									value={repeatBehavior}
									onChange={(val) => {
										const newBehavior = produce(gsapAnimation, draft => {
											draft.repeatBehavior = val;
										})
										setAttributes({ gsapAnimation: newBehavior });
									}}
									step={1}
									min={-1}
									help="Choose how many times the animation should repeat. Set to 'Infinite (-1)' for a continuous loop, or specify a number for limited animation"
									{...premiumProps}
									Component={RangeControl}
								/>

								<BControlPro
									label="Animation Duration"
									value={animationDuration}
									onChange={(val) => {
										const newSpeed = produce(gsapAnimation, draft => {
											draft.animationDuration = val;
										})
										setAttributes({ gsapAnimation: newSpeed });
									}}
									step={0.1}
									min={0.5}
									max={5}
									{...premiumProps}
									Component={RangeControl}
								/>

								<BControlPro
									label="scaleX"
									value={scaleX}
									onChange={(val) => {
										const newSpeed = produce(gsapAnimation, draft => {
											draft.scaleX = val;
										})
										setAttributes({ gsapAnimation: newSpeed });
									}}
									step={0.1}
									min={0.5}
									max={10}
									{...premiumProps}
									Component={RangeControl}
								/>

								<BControlPro
									label="scaleY"
									value={scaleY}
									onChange={(val) => {
										const newSpeed = produce(gsapAnimation, draft => {
											draft.scaleY = val;
										})
										setAttributes({ gsapAnimation: newSpeed });
									}}
									step={0.1}
									min={0.1}
									max={5}
									{...premiumProps}
									Component={RangeControl}
								/>
							</>
						}

						{
							"type6" === theme && <>
								<SelectControlPro
									label="Select Ease Type"
									labelPosition="left"
									value={easeType}
									options={easeOptions}
									onChange={(val) => {
										const newEaseType = produce(gsapAnimation, draft => {
											draft.easeType = val;
										})
										setAttributes({ gsapAnimation: newEaseType });
									}}
									{...premiumProps}
									proValues={['elastic(0.3, 0.2)', 'bounce.out']}
								/>

								<BControlPro
									className='mt10'
									label={__('Auto Repeat', 'animated-text-block')}
									checked={repeat}
									onChange={val => setAttributes({ repeat: val })}
									{...premiumProps}
									Component={ToggleControl}
								/>
							</>
						}

						{
							"type7" === theme && <>
								<BControlPro
									label="Animation repeat infinitely"
									checked={autoRepeat}
									onChange={val => {
										const newRepeat = produce(gsapAnimation, draft => {
											draft.autoRepeat = val;
										})
										setAttributes({ gsapAnimation: newRepeat });
									}}
									help={
										autoRepeat
											? "The animation will repeat infinitely."
											: "The animation will play only once."
									}
									{...premiumProps}
									Component={ToggleControl}
								/>

								<BControlPro
									label="Animation Duration"
									value={animationDuration}
									onChange={(val) => {
										const newSpeed = produce(gsapAnimation, draft => {
											draft.animationDuration = val;
										})
										setAttributes({ gsapAnimation: newSpeed });
									}}
									step={0.1}
									min={0.1}
									max={5}
									{...premiumProps}
									Component={RangeControl}
								/>
							</>
						}

						{
							"type8" === theme && <>
								<BControlPro
									label="Typing Speed (MS)"
									value={typingSpeed}
									onChange={(val) => {
										const newSpeed = produce(gsapAnimation, draft => {
											draft.typingSpeed = val;
										})
										setAttributes({ gsapAnimation: newSpeed });
									}}
									step={1}
									min={10}
									max={500}
									help="Custom set typing speed milliseconds"
									{...premiumProps}
									Component={RangeControl}
								/>

								<BControlPro
									label="Typing repeat infinitely."
									checked={autoRepeat}
									onChange={val => {
										const newRepeat = produce(gsapAnimation, draft => {
											draft.autoRepeat = val;
										})
										setAttributes({ gsapAnimation: newRepeat });
									}}
									help={
										autoRepeat
											? "The animation will repeat infinitely."
											: "The animation will play only once."
									}
									{...premiumProps}
									Component={ToggleControl}
								/>

								<BControlPro
									label="Restart delay timing"
									value={reStartTime}
									onChange={(val) => {
										const newSpeed = produce(gsapAnimation, draft => {
											draft.reStartTime = val;
										})
										setAttributes({ gsapAnimation: newSpeed });
									}}
									step={500}
									min={500}
									max={5000}
									{...premiumProps}
									Component={RangeControl}
								/>
							</>
						}

						{/* Suffix Contents section */}

						{
							("default" === theme || "type2" === theme || "type3" === theme || "type4" === theme || "type5" === theme || "type6" === theme || "type7" === theme || "type8" === theme || "type9" === theme || "type10" === theme || "type11" === theme || fxSides) && <>
								<Label>{("type11" === theme || fxSides) ? __('After Text:', 'animated-text-block') : __('Suffix Text:', 'animated-text-block')}</Label>
								<TextControl className='mb10'  value={"type11" === theme ? (suffixText || "instantly") : fxSides ? (suffixText || modernFxSideDefaults[fxEffect][1]) : suffixText} placeholder={__("Type your suffix content", "animated-text-block")} onChange={val => setAttributes({ suffixText: val })} />
							</>
						}

						{
							"type11" === theme && <>
								<PanelBody className='bPlPanelBody mt15' title={__('Highlight Animation', 'animated-text-block')}>
									<SelectControlPro
										label={__('Shape', 'animated-text-block')}
										labelPosition="left"
										value={hlShape}
										options={highlightShapeOptions}
										onChange={val => updateHighlight('shape', val)}
										{...premiumProps}
										proValues={highlightShapeOptions.map(o => o.value)}
									/>

									<SelectControlPro
										label={__('Position', 'animated-text-block')}
										labelPosition="left"
										className='mt10'
										value={hlPosition}
										options={[
											{ label: __('Behind Text', 'animated-text-block'), value: 'behind' },
											{ label: __('In Front of Text', 'animated-text-block'), value: 'front' }
										]}
										onChange={val => updateHighlight('position', val)}
										{...premiumProps}
										proValues={['behind', 'front']}
									/>

									<BControlPro
										className='mt10'
										label={__('Draw Duration (seconds)', 'animated-text-block')}
										value={hlDuration}
										onChange={val => updateHighlight('duration', val)}
										min={0.2}
										max={5}
										step={0.1}
										help={__('How long the shape takes to draw itself.', 'animated-text-block')}
										{...premiumProps}
										Component={RangeControl}
									/>

									<BControlPro
										label={__('Start Delay (seconds)', 'animated-text-block')}
										value={hlDelay}
										onChange={val => updateHighlight('delay', val)}
										min={0}
										max={5}
										step={0.1}
										help={__('Wait time before drawing starts, once the text is in view.', 'animated-text-block')}
										{...premiumProps}
										Component={RangeControl}
									/>

									<BControlPro
										label={__('Loop Animation', 'animated-text-block')}
										checked={hlLoop}
										onChange={val => updateHighlight('loop', val)}
										help={hlLoop ? __('The shape redraws continuously.', 'animated-text-block') : __('The shape draws once and stays.', 'animated-text-block')}
										{...premiumProps}
										Component={ToggleControl}
									/>

									{
										hlLoop && <BControlPro
											label={__('Loop Pause (seconds)', 'animated-text-block')}
											value={hlLoopDelay}
											onChange={val => updateHighlight('loopDelay', val)}
											min={0}
											max={10}
											step={0.1}
											help={__('How long the finished shape stays before redrawing.', 'animated-text-block')}
											{...premiumProps}
											Component={RangeControl}
										/>
									}
								</PanelBody>
							</>
						}

						{
							"type12" === theme && <>
								<PanelBody className='bPlPanelBody mt15' title={__('Scroll Animation', 'animated-text-block')}>
									<SelectControlPro
										label={__('Effect Type', 'animated-text-block')}
										labelPosition="left"
										value={tsEffect}
										options={textScrollEffectOptions}
										onChange={val => updateTextScroll('effect', val)}
										{...premiumProps}
										proValues={textScrollEffectOptions.map(o => o.value)}
									/>

									{
										!tsIsMask && <BControlPro
											label={__('Faded Opacity', 'animated-text-block')}
											value={tsFadedOpacity}
											onChange={val => updateTextScroll('fadedOpacity', val)}
											min={0}
											max={1}
											step={0.05}
											help={__('How visible the text is before it gets highlighted.', 'animated-text-block')}
											{...premiumProps}
											Component={RangeControl}
										/>
									}

									{
										tsIsMask && <SelectControlPro
											label={__('Reveal Direction', 'animated-text-block')}
											labelPosition="left"
											value={tsMaskDirection}
											options={'horizontalMask' === tsEffect ? [
												{ label: __('Left to Right', 'animated-text-block'), value: 'forward' },
												{ label: __('Right to Left', 'animated-text-block'), value: 'reverse' }
											] : [
												{ label: __('Top to Bottom', 'animated-text-block'), value: 'forward' },
												{ label: __('Bottom to Top', 'animated-text-block'), value: 'reverse' }
											]}
											onChange={val => updateTextScroll('maskDirection', val)}
											{...premiumProps}
											proValues={['forward', 'reverse']}
										/>
									}

									<BControlPro
										label={'verticalHighlight' === tsEffect ? __('Trigger Position (%)', 'animated-text-block') : __('Start Position (%)', 'animated-text-block')}
										value={tsStart}
										onChange={val => updateTextScroll('start', val)}
										min={0}
										max={100}
										step={1}
										help={'verticalHighlight' === tsEffect
											? __('A line lights up when it scrolls past this point of the screen (0 = top, 100 = bottom).', 'animated-text-block')
											: __('The animation starts when the text reaches this point of the screen (0 = top, 100 = bottom).', 'animated-text-block')}
										{...premiumProps}
										Component={RangeControl}
									/>

									{
										'verticalHighlight' !== tsEffect && <BControlPro
											label={__('End Position (%)', 'animated-text-block')}
											value={tsEnd}
											onChange={val => updateTextScroll('end', val)}
											min={0}
											max={100}
											step={1}
											help={__('The animation finishes when the bottom of the text reaches this point of the screen.', 'animated-text-block')}
											{...premiumProps}
											Component={RangeControl}
										/>
									}

									<BControlPro
										label={__('Smoothness', 'animated-text-block')}
										value={tsSmoothness}
										onChange={val => updateTextScroll('smoothness', val)}
										min={0}
										max={3}
										step={0.1}
										help={__('0 follows the scroll exactly; higher values ease in more softly.', 'animated-text-block')}
										{...premiumProps}
										Component={RangeControl}
									/>

									<BControlPro
										label={__('Reverse on Scroll Up', 'animated-text-block')}
										checked={tsReverse}
										onChange={val => updateTextScroll('reverse', val)}
										help={tsReverse ? __('The animation rewinds when scrolling back up.', 'animated-text-block') : __('Once revealed, the text stays revealed.', 'animated-text-block')}
										{...premiumProps}
										Component={ToggleControl}
									/>
								</PanelBody>
							</>
						}

						{
							"type13" === theme && <>
								<PanelBody className='bPlPanelBody mt15' title={__('Effect Options', 'animated-text-block')}>
									<SelectControlPro
										label={__('Effect Type', 'animated-text-block')}
										labelPosition="left"
										value={fxEffect}
										options={modernFxEffectOptions}
										onChange={val => updateFx('effect', val)}
										{...premiumProps}
										proValues={modernFxEffectOptions.map(o => o.value)}
									/>

									{"blurIn" === fxEffect && <>
										{fxSelect(__('Split By', 'animated-text-block'), 'splitBy', [
											{ label: __('Characters', 'animated-text-block'), value: 'chars' },
											{ label: __('Words', 'animated-text-block'), value: 'words' },
											{ label: __('Lines', 'animated-text-block'), value: 'lines' }
										])}
										{fxRange(__('Blur Amount (px)', 'animated-text-block'), 'blur', 0, 40, 1)}
										{fxRange(__('Move Up (px)', 'animated-text-block'), 'offsetY', 0, 80, 1)}
										{fxRange(__('Duration (seconds)', 'animated-text-block'), 'duration', 0.2, 3, 0.1)}
										{fxRange(__('Stagger (seconds)', 'animated-text-block'), 'stagger', 0, 0.3, 0.01, __('Delay between each character, word or line.', 'animated-text-block'))}
									</>}

									{"scramble" === fxEffect && <>
										{fxSelect(__('Characters', 'animated-text-block'), 'charset', [
											{ label: __('Uppercase', 'animated-text-block'), value: 'upperCase' },
											{ label: __('Lowercase', 'animated-text-block'), value: 'lowerCase' },
											{ label: __('Mixed case', 'animated-text-block'), value: 'upperAndLowerCase' },
											{ label: __('Numbers', 'animated-text-block'), value: 'numbers' },
											{ label: __('Symbols', 'animated-text-block'), value: 'symbols' },
											{ label: __('Custom', 'animated-text-block'), value: 'custom' }
										])}
										{"custom" === fx.charset && fxText(__('Custom Characters', 'animated-text-block'), 'customChars', __('For example 01 for a binary look.', 'animated-text-block'))}
										{fxRange(__('Duration (seconds)', 'animated-text-block'), 'duration', 0.2, 3, 0.1)}
										{fxRange(__('Scramble Speed', 'animated-text-block'), 'speed', 0.1, 1, 0.05, __('How often the random characters change.', 'animated-text-block'))}
										{fxRange(__('Reveal Delay (seconds)', 'animated-text-block'), 'revealDelay', 0, 3, 0.1, __('Scramble this long before the real text starts appearing.', 'animated-text-block'))}
									</>}

									{"shiny" === fxEffect && <>
										{fxRange(__('Sweep Duration', 'animated-text-block'), 'duration', 0.2, 3, 0.1, __('The sweep takes twice this value, in seconds.', 'animated-text-block'))}
										{fxRange(__('Pause Between Sweeps (seconds)', 'animated-text-block'), 'sweepPause', 0, 10, 0.1)}
									</>}

									{"lineMask" === fxEffect && <>
										{fxSelect(__('Direction', 'animated-text-block'), 'maskDirection', [
											{ label: __('Up', 'animated-text-block'), value: 'up' },
											{ label: __('Down', 'animated-text-block'), value: 'down' }
										])}
										{fxRange(__('Duration (seconds)', 'animated-text-block'), 'duration', 0.2, 3, 0.1)}
										{fxRange(__('Stagger', 'animated-text-block'), 'stagger', 0, 0.3, 0.01, __('Delay between lines.', 'animated-text-block'))}
									</>}

									{"glitch" === fxEffect && <>
										{fxRange(__('Intensity', 'animated-text-block'), 'intensity', 1, 20, 1)}
										{fxRange(__('Glitch Every (seconds)', 'animated-text-block'), 'glitchEvery', 0.5, 10, 0.1)}
										{fxRange(__('Flicker-in Stagger', 'animated-text-block'), 'stagger', 0, 0.3, 0.01)}
									</>}

									{"rotating" === fxEffect && <>
										{fxSelect(__('Animation', 'animated-text-block'), 'rotateAnimation', [
											{ label: __('Clip', 'animated-text-block'), value: 'clip' },
											{ label: __('Flip', 'animated-text-block'), value: 'flip' },
											{ label: __('Wave', 'animated-text-block'), value: 'wave' }
										])}
										{fxRange(__('Hold Time (seconds)', 'animated-text-block'), 'holdTime', 0.5, 10, 0.1, __('How long each word stays.', 'animated-text-block'))}
										{fxRange(__('Transition Speed (seconds)', 'animated-text-block'), 'duration', 0.2, 3, 0.1)}
									</>}

									{"countUp" === fxEffect && <>
										{fxText(__('Start Number', 'animated-text-block'), 'countStart')}
										{fxText(__('End Number', 'animated-text-block'), 'countEnd')}
										{fxRange(__('Decimals', 'animated-text-block'), 'decimals', 0, 4, 1)}
										{fxSelect(__('Thousands Separator', 'animated-text-block'), 'separator', [
											{ label: __('Comma (12,500)', 'animated-text-block'), value: ',' },
											{ label: __('Dot (12.500)', 'animated-text-block'), value: '.' },
											{ label: __('Space (12 500)', 'animated-text-block'), value: ' ' },
											{ label: __('None (12500)', 'animated-text-block'), value: 'none' }
										])}
										{fxText(__('Number Prefix', 'animated-text-block'), 'numPrefix', __('For example $', 'animated-text-block'))}
										{fxText(__('Number Suffix', 'animated-text-block'), 'numSuffix', __('For example +, % or k', 'animated-text-block'))}
										{fxRange(__('Count Duration (seconds)', 'animated-text-block'), 'countDuration', 0.3, 10, 0.1)}
									</>}

									{["blurIn", "lineMask", "rotating", "countUp"].includes(fxEffect) && fxSelect(__('Easing', 'animated-text-block'), 'ease', fxEaseOptions)}

									{fxSelect(__('Start', 'animated-text-block'), 'trigger', [
										{ label: __('When scrolled into view', 'animated-text-block'), value: 'inView' },
										{ label: __('On page load', 'animated-text-block'), value: 'load' }
									])}
									{fxRange(__('Start Delay (seconds)', 'animated-text-block'), 'delay', 0, 5, 0.1)}
									{fxOneShot && "inView" === fx.trigger && fxToggle(__('Replay When Scrolled Into View Again', 'animated-text-block'), 'replay')}
									{fxOneShot && fxToggle(__('Loop', 'animated-text-block'), 'loop')}
									{fxOneShot && fx.loop && fxRange(__('Loop Pause (seconds)', 'animated-text-block'), 'loopDelay', 0, 10, 0.1)}
								</PanelBody>
							</>
						}

						{
							"type9" === theme && <>

								<BControlPro
									className='mt10'
									label={__('Auto Repeat', 'animated-text-block')}
									checked={repeat}
									onChange={val => setAttributes({ repeat: val })}
									{...premiumProps}
									Component={ToggleControl}
								/>

								<BControlPro
									className='mt10'
									label="Animation Speed (MS)"
									value={typingSpeed}
									onChange={(val) => {
										const newSpeed = produce(gsapAnimation, (draft) => {
											draft.typingSpeed = val;
										});

										setAttributes({ gsapAnimation: newSpeed });

										// Calculate display time
										const duration = val * content?.length + 2000;
										setAlertAnimationSpeed(duration);

										// Hide after 'val' milliseconds dynamically
										setTimeout(() => {
											setAlertAnimationSpeed(null);
										}, duration);
									}}
									step={1}
									min={10}
									max={5000}
									help="Custom set typing speed milliseconds"
									{...premiumProps}
									Component={RangeControl}
									disabled={alertAnimationSpeed !== null}
								/>

								{/* Show typingSpeed dynamically for its duration */}
								{alertAnimationSpeed !== null && (
									<p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
										Please wait until the animation complete: {alertAnimationSpeed}ms
									</p>
								)}
							</>
						}

						{
							"type10" === theme && <>
								<SelectControlPro
									label="Animate Type"
									labelPosition="left"
									value={animateType}
									options={animateTypeOptions}
									onChange={(val) => {
										const newEaseType = produce(gsapAnimation, draft => {
											draft.animateType = val;
										})
										setAttributes({ gsapAnimation: newEaseType });
									}}
									{...premiumProps}
									proValues={['wave', 'bounce', 'glitch']}
								/>
							</>
						}
					</PanelBody>
				</>}


				{'style' === tab.name && <>
					<PanelBody className='bPlPanelBody' title={__('Animated Text', 'animated-text-block')}>
						<Background label={__('Background:', 'animated-text-block')} value={background} onChange={val => setAttributes({ background: val })} defaults={{ color: '#0000' }} />

						{/* Prefix styles Here */}
						{
							prefixText && ("default" === theme || "type2" === theme || "type3" === theme || "type4" === theme || "type5" === theme || "type6" === theme || "type7" === theme || "type8" === theme || "type9" === theme || "type10" === theme || "type11" === theme || fxSides) && <>
								{/* Prefix Color */}
								<ColorControl label={__('Prefix Color:', 'animated-text-block')} value={prefixColor} onChange={val => setAttributes({ prefixColor: val })} />
								{/* Prefix Typography */}
								<Typography className='mt10' label={__('Prefix Typography:', 'animated-text-block')} value={prefixTypo} onChange={val => setAttributes({ prefixTypo: val })} maxFontSize={300} />

							</>
						}

						{
							"type7" === theme ? <Typography className='mt10' label={__('Animated Typography:', 'animated-text-block')} value={typography} onChange={val => setAttributes({ typography: val })} defaults={{ fontSize: { desktop: 22, tablet: 20, mobile: 18 } }} isFamily={false} /> : <Typography className='mt10' label={__('Animated Typography:', 'animated-text-block')} value={typography} onChange={val => setAttributes({ typography: val })} defaults={{ fontSize: { desktop: 22, tablet: 20, mobile: 18 } }} maxFontSize={300} />
						}

						{
							("default" === theme || "type1" === theme || "type2" === theme || "type4" === theme || "type5" === theme || "type6" === theme || "type7" === theme || "type8" === theme || "type10" === theme || "type11" === theme || "type13" === theme) && <>
								<ColorControl label={__('Animate Text Color:', 'animated-text-block')} value={color} onChange={val => setAttributes({ color: val })} />
							</>
						}

						{/* Suffix Text Styles */}

						{
							suffixText && ("default" === theme || "type2" === theme || "type3" === theme || "type4" === theme || "type5" === theme || "type6" === theme || "type7" === theme || "type8" === theme || "type9" === theme || "type10" === theme || "type11" === theme || fxSides) && <>
								<Typography className='mt10' label={__('Sufix Typography:', 'animated-text-block')} value={suffixTypo} onChange={val => setAttributes({ suffixTypo: val })} maxFontSize={300} />

								<ColorControl label={__('Suffix Text Color:', 'animated-text-block')} value={suffixColor} onChange={val => setAttributes({ suffixColor: val })} />
							</>
						}

						{
							("type3" === theme) && <>
								<BControlPro className='mt10' label={__('Random Color', 'animated-text-block')} checked={randomColor} onChange={val => {
									const newCustom = produce(gsapAnimation, draft => {
										draft.randomColor = val;
									})
									setAttributes({ gsapAnimation: newCustom });
								}}
									help={randomColor ? 'Default set automatic random color' : 'You set now custom color apply'}
									{...premiumProps}
									Component={ToggleControl}
								/>

								{
									randomColor ? "" : <ColorControl label={__('Color:', 'animated-text-block')} value={color} onChange={val => setAttributes({ color: val })} />
								}
							</>
						}

						{
							("type9" === theme) && <>
								<BControlPro className='mt10' label={__('Random Color', 'animated-text-block')} checked={randomColor} onChange={val => {
									const newCustom = produce(gsapAnimation, draft => {
										draft.randomColor = val;
									})
									setAttributes({ gsapAnimation: newCustom });
									// Calculate display time
									const duration = val * content?.length + 4000;
									setAlertRandomColor(duration);

									// Hide after 'val' milliseconds dynamically
									setTimeout(() => {
										setAlertRandomColor(null);
									}, duration);
								}}
									help={randomColor ? 'Default set automatic random color' : 'You set now custom color apply'}
									{...premiumProps}
									Component={ToggleControl}
									disabled={alertRandomColor !== null}
								/>

								{/* Show typingSpeed dynamically for its duration */}
								{alertRandomColor !== null && (
									<p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
										Please wait until the animation complete: {alertRandomColor}ms
									</p>
								)}


								{
									randomColor ? "" : <ColorControl label={__('Color:', 'animated-text-block')} value={color} onChange={val => setAttributes({ color: val })} />
								}
							</>
						}

						{
							"type9" === theme ? <>
								<BControlPro
									className='mt10'
									label={__('Text Shadow', 'animated-text-block')}
									checked={isTextShadow}
									onChange={val => {
										const newCustom = produce(gsapAnimation, draft => {
											draft.isTextShadow = val;
										})
										setAttributes({ gsapAnimation: newCustom });
										// Calculate display time
										const duration = val * content?.length + 4000;
										setAlertShadow(duration);

										// Hide after 'val' milliseconds dynamically
										setTimeout(() => {
											setAlertShadow(null);
										}, duration);
									}}
									{...premiumProps}
									Component={ToggleControl}
									disabled={alertShadow !== null}
								/>

								{/* Show typingSpeed dynamically for its duration */}
								{alertShadow !== null && (
									<p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
										Please wait until the animation complete: {alertShadow}ms
									</p>
								)}

								{
									isTextShadow &&
									<BControlPro
										type="text"
										label={__('Text Shadow', 'animated-text-block')}
										value={textShadow}
										onChange={val => {
											const newCustom = produce(gsapAnimation, draft => {
												draft.textShadow = val;
											})
											setAttributes({ gsapAnimation: newCustom });
										}}
										{...premiumProps}
										Component={ShadowControl}
									/>
								}
							</> : <>
								<BControlPro
									className='mt10'
									label={__('Text Shadow', 'animated-text-block')}
									checked={isTextShadow}
									onChange={val => {
										const newCustom = produce(gsapAnimation, draft => {
											draft.isTextShadow = val;
										})
										setAttributes({ gsapAnimation: newCustom });
									}}
									{...premiumProps}
									Component={ToggleControl}
								/>

								{
									isTextShadow &&
									<BControlPro
										type="text"
										label={__('Text Shadow', 'animated-text-block')}
										value={textShadow}
										onChange={val => {
											const newCustom = produce(gsapAnimation, draft => {
												draft.textShadow = val;
											})
											setAttributes({ gsapAnimation: newCustom });
										}}
										{...premiumProps}
										Component={ShadowControl}
									/>
								}
							</>
						}

						<SpaceControl className='mt20' label={__('Padding:', 'animated-text-block')} value={padding} onChange={val => setAttributes({ padding: val })} defaults={{ vertical: '15px', horizontal: '15px' }} />

						<BorderControl label={__('Border:', 'animated-text-block')} value={border} onChange={val => setAttributes({ border: val })} defaults={{ radius: '5px' }} />
					</PanelBody>

					{
						"type11" === theme && <PanelBody className='bPlPanelBody' title={__('Highlight Shape', 'animated-text-block')} initialOpen={false}>
							<SelectControlPro
								label={__('Color Type', 'animated-text-block')}
								labelPosition="left"
								value={hlColorType}
								options={[
									{ label: __('Solid', 'animated-text-block'), value: 'solid' },
									{ label: __('Gradient', 'animated-text-block'), value: 'gradient' }
								]}
								onChange={val => updateHighlight('colorType', val)}
								{...premiumProps}
								proValues={['solid', 'gradient']}
							/>

							{
								"gradient" === hlColorType ? <Gradient
									value={hlGradient}
									onChange={val => {
										// Gradient also fires onChange on mount; skip no-op updates so the post isn't marked dirty
										if (JSON.stringify(val) === JSON.stringify(hlGradient)) return;
										isPremium ? updateHighlight('gradient', val) : setIsProModalOpen(true);
									}}
								/> : <BControlPro
									className='mt10'
									label={__('Shape Color:', 'animated-text-block')}
									value={hlColor}
									onChange={val => updateHighlight('color', val)}
									{...premiumProps}
									Component={ColorControl}
								/>
							}

							{
								"marker" === hlShape ? <BControlPro
									className='mt10'
									label={__('Marker Thickness (% of font size)', 'animated-text-block')}
									value={hlMarkerHeight}
									onChange={val => updateHighlight('markerHeight', val)}
									min={20}
									max={120}
									step={1}
									{...premiumProps}
									Component={RangeControl}
								/> : <BControlPro
									className='mt10'
									label={__('Stroke Width (px)', 'animated-text-block')}
									value={hlStrokeWidth}
									onChange={val => updateHighlight('strokeWidth', val)}
									min={1}
									max={20}
									step={0.5}
									{...premiumProps}
									Component={RangeControl}
								/>
							}

							<BControlPro
								label={__('Rounded Ends', 'animated-text-block')}
								checked={hlRoundedEnds}
								onChange={val => updateHighlight('roundedEnds', val)}
								{...premiumProps}
								Component={ToggleControl}
							/>
						</PanelBody>
					}

					{
						"type12" === theme && <PanelBody className='bPlPanelBody' title={__('Text Scroll', 'animated-text-block')} initialOpen={false}>
							<BControlPro
								className='mt10'
								label={__('Active Text Color:', 'animated-text-block')}
								value={color}
								onChange={val => setAttributes({ color: val })}
								{...premiumProps}
								Component={ColorControl}
							/>

							{
								<BControlPro
									className='mt10'
									label={__('Faded Text Color:', 'animated-text-block')}
									value={tsFadedColor || color}
									defaultColor={tsFadedColor ? color : undefined}
									onChange={val => updateTextScroll('fadedColor', val === color ? '' : val)}
									{...premiumProps}
									Component={ColorControl}
								/>
							}

							{
								tsIsMask && <>
									<BControlPro
										className='mt10'
										label={__('Mask Color:', 'animated-text-block')}
										value={tsMaskColor}
										defaultColor='#ffffff'
										onChange={val => updateTextScroll('maskColor', val)}
										{...premiumProps}
										Component={ColorControl}
									/>
									<small style={{ display: 'block', marginTop: '4px', color: '#757575' }}>{__('Match this to the background behind the text.', 'animated-text-block')}</small>

									<BControlPro
										className='mt10'
										label={__('Mask Opacity', 'animated-text-block')}
										value={tsMaskOpacity}
										onChange={val => updateTextScroll('maskOpacity', val)}
										min={0}
										max={1}
										step={0.05}
										{...premiumProps}
										Component={RangeControl}
									/>
								</>
							}
						</PanelBody>
					}

					{
						"type13" === theme && ("shiny" === fxEffect || "glitch" === fxEffect) && <PanelBody className='bPlPanelBody' title={__('Effect Style', 'animated-text-block')} initialOpen={false}>
							{"shiny" === fxEffect && <>
								{fxColor(__('Base Color:', 'animated-text-block'), 'baseColor', color)}
								{fxColor(__('Shine Color:', 'animated-text-block'), 'shineColor')}
								{fxRange(__('Shine Width (%)', 'animated-text-block'), 'shineWidth', 4, 60, 1)}
								{fxRange(__('Shine Angle (deg)', 'animated-text-block'), 'shineAngle', 0, 180, 1)}
							</>}
							{"glitch" === fxEffect && <>
								{fxColor(__('Glitch Color 1:', 'animated-text-block'), 'glitchColor1')}
								{fxColor(__('Glitch Color 2:', 'animated-text-block'), 'glitchColor2')}
							</>}
						</PanelBody>
					}
				</>}
			</>}</TabPanel>
		</InspectorControls >


		<BlockControls>

			<ToolbarGroup>
				<DropdownMenu
					icon="editor-alignleft"
					label="Text Alignment"
					controls={[
						{
							title: 'Align to Start', // Custom Text
							icon: 'editor-alignleft',
							onClick: () => setAttributes({ alignment: 'left' }),
							isActive: alignment === 'left',
						},
						{
							title: 'Align to Middle', // Custom Text
							icon: 'editor-aligncenter',
							onClick: () => setAttributes({ alignment: 'center' }),
							isActive: alignment === 'center',
						},
						{
							title: 'Align to End', // Custom Text
							icon: 'editor-alignright',
							onClick: () => setAttributes({ alignment: 'right' }),
							isActive: alignment === 'right',
						},
					]}
				/>
			</ToolbarGroup>


			{/* Quick Theme Swither */}
			<ThemeSwitcher
				themes={itemOption}
				value={theme}
				isPro={isPremium}
				visibleCount={5}
				buttonLabel="More Styles"
				onChange={(val) => setAttributes(themeSwitch(val, attributes))}
			>

			</ThemeSwitcher>

		</BlockControls>

		{/* <ProModal isProModalOpen={isProModalOpen}
			setIsProModalOpen={setIsProModalOpen}
			link={pricingPage}
			features={FeaturesPro}>

		</ProModal> */}

		

		<ProModal isProModalOpen={isProModalOpen} setIsProModalOpen={setIsProModalOpen} link={pricingPage || 'https://bplugins.com/products/animated-text-block/pricing/'} title={__('Unlock More with<br/>Animated Text Block Pro!')} description={__(`The free features of Plugin do a lot-still, without PRO, you're holding yourself back from getting more.`)} features={[
			'Character & Word Based Animations.',
			'In-View & Out-View Effects.',
			'Loop & Auto Repeat Control.',
			'Advanced Animation Effects.',
			'Custom Styles & Typography.',
			'Shortcode & Layout Support.'
		]} />
	</>;
};


export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');
	const { getSite } = select('core');

	return {
		device: getDeviceType()?.toLowerCase(),
		siteURL: getSite()?.url || ''
	}
})(Settings);