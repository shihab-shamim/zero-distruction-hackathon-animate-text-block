import React, { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { textScrollDefaults } from '../../../utils/options';

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

// 0 when the box's top reaches `start`% of the viewport height, 1 when its bottom reaches `end`%
const scrollProgress = (rect, vh, start, end) => {
	const from = (vh * start) / 100;
	const span = from - (vh * end) / 100 + rect.height;
	if (0 >= span) return rect.top <= from ? 1 : 0;
	return clamp((from - rect.top) / span);
};

const TypeTwelve = ({ attributes }) => {
	const { content = '', color = '', typography = {}, textAlignment = 'center', textScroll = {} } = attributes;
	const { effect, fadedOpacity, fadedColor, start, end, smoothness, reverse, maskColor, maskOpacity, maskDirection } = { ...textScrollDefaults, ...textScroll };

	const byChar = 'horizontalHighlight' === effect;
	const isMask = 'verticalMask' === effect || 'horizontalMask' === effect;
	const needsLines = !byChar;

	const contentRef = useRef(null);
	const [lines, setLines] = useState(null);
	const [layoutKey, setLayoutKey] = useState(0);

	// Paragraphs (new lines in the text) -> words with a running index
	let index = 0;
	const paragraphs = `${content}`.split(/\r?\n/).map(p => p.split(/\s+/).filter(Boolean).map(w => ({ w, i: index++ }))).filter(p => p.length);
	const words = paragraphs.flat().map(({ w }) => w);

	// Anything that can change where lines break forces a fresh measurement
	const layoutSig = JSON.stringify([content, typography, textAlignment, needsLines, layoutKey]);

	useLayoutEffect(() => { setLines(null); }, [layoutSig]);

	// Group words into visual lines by their offsetTop
	useLayoutEffect(() => {
		const root = contentRef.current;
		if (!needsLines || null !== lines || !root) return;

		const groups = [];
		let top = null;
		root.querySelectorAll('[data-w]').forEach(el => {
			if (null === top || 2 < Math.abs(el.offsetTop - top)) {
				groups.push([]);
				top = el.offsetTop;
			}
			groups[groups.length - 1].push(+el.dataset.w);
		});
		setLines(groups);
	}, [lines, layoutSig]);

	// Re-measure on width changes and once web fonts have loaded
	useEffect(() => {
		const root = contentRef.current;
		if (!root) return;
		const view = root.ownerDocument?.defaultView || window;
		const doc = root.ownerDocument || document;
		let width = root.offsetWidth;
		const relayout = () => setLayoutKey(k => k + 1);

		const observer = view.ResizeObserver ? new view.ResizeObserver(() => {
			if (root.offsetWidth !== width) {
				width = root.offsetWidth;
				relayout();
			}
		}) : null;
		observer?.observe(root);

		doc.fonts?.ready?.then(relayout);
		doc.fonts?.addEventListener?.('loadingdone', relayout);

		return () => {
			observer?.disconnect();
			doc.fonts?.removeEventListener?.('loadingdone', relayout);
		};
	}, []);

	// Scroll engine: works against the block's own window, so it runs the same in the editor iframe and on the page
	useEffect(() => {
		const root = contentRef.current;
		if (!root || (needsLines && !lines)) return;

		const doc = root.ownerDocument || document;
		const view = doc.defaultView || window;
		const reduce = view.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

		const targets = byChar ? [root] : [...root.querySelectorAll('.atbTsLineInner')];
		const chars = byChar ? [...root.querySelectorAll('.atbTsChar')] : [];
		const masks = isMask ? targets.map(t => t.querySelector('.atbTsMask')) : [];
		const dim = 'horizontalMask' === effect ? 'width' : 'height';

		const s = clamp(parseFloat(start) || 0, 0, 100);
		const e = clamp(parseFloat(end) || 0, 0, 100);
		const smooth = Math.max(0, parseFloat(smoothness) || 0);
		const fo = clamp(parseFloat(fadedOpacity) || 0);
		const mixColor = byChar && fadedColor && color;
		const maskFadedColor = isMask && fadedColor && color;

		const goal = targets.map(() => 0);
		const shown = targets.map(() => 0);
		const active = targets.map(() => false);
		const painted = [];
		let raf = 0;
		let last = 0;
		let first = true;

		const paint = () => {
			if (byChar) {
				const P = shown[0];
				const N = chars.length;
				// Each character fades over 2 "steps", one step after the previous one
				chars.forEach((c, i) => {
					const p = clamp((P * (N + 1) - i) / 2);
					if (painted[i] === p) return;
					painted[i] = p;
					// Inline values must win over the faded CSS defaults, including when fully revealed
					c.style.opacity = `${fo + (1 - fo) * p}`;
					if (mixColor) c.style.color = 1 <= p ? 'inherit' : `color-mix(in srgb, ${color} ${(p * 100).toFixed(1)}%, ${fadedColor})`;
				});
			} else if (isMask) {
				masks.forEach((m, i) => { if (m) m.style[dim] = `${((1 - shown[i]) * 100).toFixed(2)}%`; });
				// Revealed text moves from the faded colour to the active colour with the line's progress
				if (maskFadedColor) targets.forEach((t, i) => { t.style.color = 1 <= shown[i] ? '' : `color-mix(in srgb, ${color} ${(shown[i] * 100).toFixed(1)}%, ${fadedColor})`; });
			} else {
				targets.forEach((t, i) => t.parentElement.classList.toggle('isActive', active[i]));
			}
		};

		const tick = time => {
			raf = 0;
			const dt = last ? Math.min(0.1, (time - last) / 1000) : 1 / 60;
			last = time;
			const k = (reduce || 0 >= smooth) ? 1 : 1 - Math.exp(-dt / (smooth * 0.25));
			let moving = false;
			goal.forEach((g, i) => {
				const d = g - shown[i];
				if (0.001 > Math.abs(d)) shown[i] = g;
				else { shown[i] += d * k; moving = true; }
			});
			paint();
			if (moving) raf = view.requestAnimationFrame(tick);
			else last = 0;
		};

		const update = () => {
			const vh = view.innerHeight || doc.documentElement.clientHeight;
			const se = doc.scrollingElement || doc.documentElement;
			// At the very bottom of the page nothing can scroll further, so finish every effect
			const atEnd = (view.scrollY || se.scrollTop) + vh >= se.scrollHeight - 2;

			targets.forEach((t, i) => {
				const r = t.getBoundingClientRect();
				let p, on;
				if (reduce) { p = 1; on = true; }
				else if (!byChar && !isMask) { on = atEnd || r.top <= (vh * s) / 100; p = on ? 1 : 0; }
				else { p = atEnd ? 1 : scrollProgress(r, vh, s, e); on = 0 < p; }
				if (!reverse) { p = Math.max(goal[i], p); on = on || active[i]; }
				goal[i] = p;
				active[i] = on;
				if (first) shown[i] = p;
			});
			first = false;
			if (!raf) raf = view.requestAnimationFrame(tick);
		};

		update();
		if (!reduce) {
			view.addEventListener('scroll', update, { passive: true });
			view.addEventListener('resize', update);
		}

		return () => {
			view.removeEventListener('scroll', update);
			view.removeEventListener('resize', update);
			if (raf) view.cancelAnimationFrame(raf);
			chars.forEach(c => { c.style.opacity = ''; c.style.color = ''; });
			masks.forEach(m => { if (m) { m.style.width = ''; m.style.height = ''; } });
			targets.forEach(t => { t.parentElement?.classList.remove('isActive'); t.style.color = ''; });
		};
	}, [lines, effect, fadedOpacity, fadedColor, color, start, end, smoothness, reverse, maskDirection, layoutSig]);

	const renderWord = i => <span key={i} className='atbTsWord' data-w={i}>
		{byChar ? [...words[i]].map((c, j) => <span key={j} className='atbTsChar'>{c}</span>) : words[i]}
	</span>;

	const withSpaces = ids => ids.map((i, k) => <Fragment key={i}>{k ? ' ' : ''}{renderWord(i)}</Fragment>);

	const style = {
		'--atb-ts-faded-opacity': clamp(parseFloat(fadedOpacity) || 0),
		'--atb-ts-speed': `${0.15 + Math.max(0, parseFloat(smoothness) || 0) * 0.35}s`,
		...(fadedColor ? { '--atb-ts-faded-color': fadedColor } : {}),
		'--atb-ts-mask-color': maskColor || '#ffffff',
		'--atb-ts-mask-opacity': Number.isFinite(parseFloat(maskOpacity)) ? clamp(parseFloat(maskOpacity)) : 1
	};

	return (
		<div className={`typeTwelve atbTs-${effect} ${'reverse' === maskDirection ? 'isMaskReverse' : 'isMaskForward'}`} style={style}>
			<div ref={contentRef} className='content'>
				{(needsLines && lines)
					? lines.map((ids, li) => <div key={li} className='atbTsLine'>
						<span className='atbTsLineInner'>
							{withSpaces(ids)}
							{isMask && <span className='atbTsMask' aria-hidden='true' />}
						</span>
					</div>)
					: paragraphs.map((p, pi) => <div key={pi} className='atbTsPara'>{withSpaces(p.map(({ i }) => i))}</div>)}
			</div>
		</div>
	);
};

export default TypeTwelve;
