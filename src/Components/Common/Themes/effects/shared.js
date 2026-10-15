import { useEffect, useRef, useState } from 'react';
import { usePlayback } from '../../../../utils/playback';

const viewOf = el => el?.ownerDocument?.defaultView || window;

export const prefersReducedMotion = el => !!viewOf(el).matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export const paragraphsOf = text => `${text || ''}`.split(/\r?\n/).filter(p => p.trim());

export const num = (v, fallback = 0) => (Number.isFinite(parseFloat(v)) ? parseFloat(v) : fallback);

// Rotating words: separated by "|" or new lines
export const wordsOf = text => `${text || ''}`.split(/\||\r?\n/).map(w => w.trim()).filter(Boolean);

export const formatNumber = (value, fx) => {
	const decimals = Math.max(0, Math.min(4, Math.round(num(fx.decimals, 0))));
	const [int, dec] = Math.abs(value).toFixed(decimals).split('.');
	const sep = 'none' === fx.separator ? '' : (fx.separator ?? ',');
	const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
	const decimalMark = '.' === sep ? ',' : '.';
	return `${0 > value ? '-' : ''}${fx.numPrefix || ''}${grouped}${dec ? decimalMark + dec : ''}${fx.numSuffix || ''}`;
};

// Returns a counter that increases every time the effect should (re)play:
// once on load, or when the block enters the viewport (again, if `replay` is on)
export const usePlay = (ref, fx) => {
	const [play, setPlay] = useState(0);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const view = viewOf(el);

		if ('load' === fx.trigger || !view.IntersectionObserver) {
			setPlay(1);
			return;
		}

		let inside = false;
		const observer = new view.IntersectionObserver(entries => {
			const visible = entries.some(e => e.isIntersecting);
			if (visible && !inside) {
				inside = true;
				setPlay(p => (fx.replay || 0 === p ? p + 1 : p));
			} else if (!visible) {
				inside = false;
			}
		}, { threshold: 0.25 });

		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return play;
};

export const isScrub = v => Number.isFinite(v);

// Scroll scrub (Smart Triggers): the timeline is held at the scroll progress instead of being played.
// Returns a ref with the latest progress (null when not scrubbing), for timelines built or rebuilt later.
export const useScrub = tl => {
	const { scrub } = usePlayback();
	const progress = useRef(null);
	progress.current = isScrub(scrub) ? scrub : null;

	useEffect(() => {
		if (!isScrub(scrub) || !tl.current) return;
		tl.current.pause().progress(scrub);
	}, [scrub]);

	return progress;
};
