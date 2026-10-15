import React, { useEffect, useId, useRef, useState } from 'react';
import { highlightDefaults, highlightShapes } from '../../../utils/options';
import { usePlayback } from '../../../utils/playback';

const FADE_TIME = 400; // ms, must match the fade transition in style.scss

// Shape paths are authored on a 0-100 grid using absolute x/y pairs only; scale them to the real pixel box
// so the stroke keeps an even width and `pathLength` based drawing stays accurate.
const scalePath = (d, w, h) => {
	let i = 0;
	return d.replace(/-?\d*\.?\d+/g, n => (i++ % 2 ? (parseFloat(n) * h) / 100 : (parseFloat(n) * w) / 100).toFixed(2));
};

// Mirrors bpl-tools getGradientCSS (the CSS the Gradient control is built for) in SVG, using the shape's pixel box
const HighlightGradient = ({ id, gradient = {}, w, h }) => {
	const { type = 'linear', radialType = 'ellipse', colors = [], centerPositions = {}, angel = 90 } = gradient;
	const stops = colors.map((c, i) => <stop key={i} offset={`${parseFloat(c?.position) || 0}%`} stopColor={c?.color} />);

	if ('radial' === type) {
		// radial-gradient(<radialType> at X% Y%) with the CSS default size, farthest-corner
		const cx = (w * (parseFloat(centerPositions?.x) || 0)) / 100;
		const cy = (h * (parseFloat(centerPositions?.y) || 0)) / 100;
		const dx = Math.max(cx, w - cx);
		const dy = Math.max(cy, h - cy);

		if ('circle' === radialType) {
			return <radialGradient id={id} gradientUnits='userSpaceOnUse' cx={cx} cy={cy} r={Math.hypot(dx, dy)}>{stops}</radialGradient>;
		}

		// A farthest-corner ellipse keeps the farthest-side aspect ratio, so its radii are √2 × the side distances
		const rx = Math.max(dx * Math.SQRT2, 0.01);
		const ry = Math.max(dy * Math.SQRT2, 0.01);

		return <radialGradient id={id} gradientUnits='userSpaceOnUse' cx={cx} cy={cy} r={rx} gradientTransform={`translate(${cx} ${cy}) scale(1 ${ry / rx}) translate(${-cx} ${-cy})`}>{stops}</radialGradient>;
	}

	// linear-gradient(<angle>deg): 0deg = to top, 90deg = to right; the line is long enough to reach the corners
	const rad = (parseFloat(angel) || 0) * Math.PI / 180;
	const half = (Math.abs(w * Math.sin(rad)) + Math.abs(h * Math.cos(rad))) / 2;
	const dx = half * Math.sin(rad);
	const dy = half * Math.cos(rad);

	return <linearGradient id={id} gradientUnits='userSpaceOnUse' x1={w / 2 - dx} y1={h / 2 + dy} x2={w / 2 + dx} y2={h / 2 - dy}>{stops}</linearGradient>;
}

const TypeEleven = ({ attributes }) => {
	const { content, prefixText = "", suffixText = "", highlight = {} } = attributes;
	const beforeText = prefixText?.trim() ? prefixText : 'Make your words';
	const afterText = suffixText?.trim() ? suffixText : 'instantly';
	const { shape, colorType, color, gradient, strokeWidth, markerHeight, roundedEnds, position, duration, delay, loop, loopDelay } = { ...highlightDefaults, ...highlight };

	const wrapperRef = useRef(null);
	const [size, setSize] = useState({ width: 0, height: 0, fontSize: 0 });
	const [inView, setInView] = useState(false);
	const [cycle, setCycle] = useState(0);
	const [fading, setFading] = useState(false);
	const { scrub, paused } = usePlayback();
	const loopClock = useRef({ key: '', elapsed: 0 });
	// Reduced motion: no scrubbing, the stylesheet shows the shape fully drawn
	const scrubbing = Number.isFinite(scrub) && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

	const gradientId = `atbHlGrad${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
	const { box, paths } = highlightShapes[shape] || highlightShapes[highlightDefaults.shape];
	const isMarker = 'marker' === shape;

	const durationSec = Math.max(0.1, parseFloat(duration) || 0);
	const delaySec = Math.max(0, parseFloat(delay) || 0);
	const loopDelaySec = Math.max(0, parseFloat(loopDelay) || 0);

	// Track the highlighted text size (font, content and viewport changes)
	useEffect(() => {
		const el = wrapperRef.current;
		if (!el) return;

		const view = el.ownerDocument?.defaultView || window;
		const measure = () => {
			const fontSize = parseFloat(view.getComputedStyle(el).fontSize) || 0;
			setSize(prev => (prev.width === el.offsetWidth && prev.height === el.offsetHeight && prev.fontSize === fontSize) ? prev : { width: el.offsetWidth, height: el.offsetHeight, fontSize });
		};
		measure();

		if (!view.ResizeObserver) {
			view.addEventListener('resize', measure);
			return () => view.removeEventListener('resize', measure);
		}

		const observer = new view.ResizeObserver(measure);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	// Start drawing once the text scrolls into view
	useEffect(() => {
		const el = wrapperRef.current;
		if (!el) return;

		const view = el.ownerDocument?.defaultView || window;
		if (!view.IntersectionObserver) {
			setInView(true);
			return;
		}

		const observer = new view.IntersectionObserver(entries => {
			if (entries.some(entry => entry.isIntersecting)) {
				setInView(true);
				observer.disconnect();
			}
		}, { threshold: 0.2 });

		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	// Loop: draw -> hold -> fade out -> redraw
	useEffect(() => {
		// Auto-pause (Smart Triggers) holds the loop clock; any other change starts the cycle timing fresh as before
		const clock = loopClock.current;
		const key = `${inView}-${loop}-${scrubbing}-${cycle}-${delaySec}-${durationSec}-${loopDelaySec}`;
		if (clock.key !== key) {
			clock.key = key;
			clock.elapsed = 0;
		}
		if (!inView || !loop || scrubbing || paused) return;

		const since = Date.now();
		const fadeAt = (delaySec + durationSec + loopDelaySec) * 1000;
		const fadeTimer = setTimeout(() => setFading(true), Math.max(0, fadeAt - clock.elapsed));
		const restartTimer = setTimeout(() => {
			setFading(false);
			setCycle(c => c + 1);
		}, Math.max(0, fadeAt + FADE_TIME - clock.elapsed));

		return () => {
			clock.elapsed += Date.now() - since;
			clearTimeout(fadeTimer);
			clearTimeout(restartTimer);
		};
	}, [inView, loop, cycle, delaySec, durationSec, loopDelaySec, scrubbing, paused]);

	const svgH = (size.height * box.height) / 100;
	const fitW = (size.width * box.width) / 100;

	// Shapes with their own proportions (arrow, burst...) may clamp their width in em, staying centred on the same spot
	const minW = (box.minWidthEm || 0) * size.fontSize;
	const maxW = box.maxWidthEm ? box.maxWidthEm * size.fontSize : Infinity;
	const svgW = Math.min(Math.max(fitW, minW), maxW);
	const isClamped = svgW !== fitW;
	const leftPx = (size.width * box.left) / 100 + (fitW - svgW) / 2;

	// Re-mount the SVG to replay the drawing when a cycle restarts or an animation setting changes
	const svgKey = `${cycle}-${shape}-${durationSec}-${delaySec}-${loop}`;
	const stroke = 'gradient' === colorType ? `url(#${gradientId})` : color;
	const pathDuration = durationSec / paths.length;

	return (
		<div className='typeEleven'>
			<span className='prefix-text'>{beforeText}</span>

			<span className='content'>
				<span ref={wrapperRef} className={`atbHighlight ${'front' === position ? 'isFront' : 'isBehind'}`}>
					<span className='atbHighlightText'>{content}</span>

					{0 < svgW && 0 < svgH && <svg
						key={svgKey}
						className={`atbHighlightSvg ${inView && !scrubbing ? 'isDrawing' : ''} ${fading && !scrubbing ? 'isFading' : ''}`}
						viewBox={`0 0 ${svgW.toFixed(2)} ${svgH.toFixed(2)}`}
						aria-hidden='true'
						focusable='false'
						style={{ top: `${box.top}%`, left: isClamped ? `${leftPx}px` : `${box.left}%`, width: isClamped ? `${svgW}px` : `${box.width}%`, height: `${box.height}%` }}
					>
						{'gradient' === colorType && <defs><HighlightGradient id={gradientId} gradient={gradient} w={svgW} h={svgH} /></defs>}

						{paths.map((d, i) => <path
							key={i}
							d={scalePath(d, svgW, svgH)}
							pathLength='1'
							fill='none'
							stroke={stroke}
							strokeWidth={isMarker ? `${(parseFloat(markerHeight) || 0) / 100}em` : (parseFloat(strokeWidth) || 1)}
							strokeLinecap={roundedEnds ? 'round' : 'butt'}
							strokeLinejoin={roundedEnds ? 'round' : 'miter'}
							className={isMarker ? 'isMarker' : ''}
							style={scrubbing
								// Scroll scrub: paths draw one after another (pathLength 1, so the offset runs 1 -> 0)
								? { strokeDashoffset: 1 - Math.min(1, Math.max(0, scrub * paths.length - i)) }
								: { animationDuration: `${pathDuration}s`, animationDelay: `${delaySec + i * pathDuration}s` }}
						/>)}
					</svg>}
				</span>
			</span>

			<span className='suffix-text'>{afterText}</span>
		</div>
	);
};

export default TypeEleven;
