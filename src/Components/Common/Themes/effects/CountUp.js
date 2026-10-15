import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { modernFxEases } from '../../../../utils/options';
import { usePlayback } from '../../../../utils/playback';
import { formatNumber, num, prefersReducedMotion, usePlay, useScrub } from './shared';

const CountUp = ({ fx }) => {
	const ref = useRef(null);
	const tw = useRef(null);
	const play = usePlay(ref, fx);
	const scrub = useScrub(tw);
	const { paused } = usePlayback();
	const held = useRef(false);
	const start = num(fx.countStart, 0), end = num(fx.countEnd, 100);

	useLayoutEffect(() => {
		const el = ref.current;
		if (!el || prefersReducedMotion(el)) return;
		const box = { v: start };
		el.textContent = formatNumber(start, fx);
		tw.current = gsap.to(box, {
			v: end, duration: Math.max(0.1, num(fx.countDuration, 2)), ease: modernFxEases[fx.ease] || 'power3.out', paused: true,
			repeat: fx.loop && null === scrub.current ? -1 : 0, repeatDelay: num(fx.loopDelay, 2),
			onUpdate: () => { el.textContent = formatNumber(box.v, fx); },
			onRepeat: () => { box.v = start; }
		});
		if (null !== scrub.current) tw.current.progress(scrub.current);
		return () => { tw.current?.kill(); el.textContent = formatNumber(end, fx); };
	}, []);

	useEffect(() => {
		if (!play || !tw.current || null !== scrub.current) return;
		tw.current.delay(num(fx.delay, 0)).restart(true);
	}, [play]);

	// Auto-pause (Smart Triggers): the wrapper can't see a tween on a plain object, so hold it here
	useEffect(() => {
		const t = tw.current;
		if (!t || null !== scrub.current) return;
		if (paused && !t.paused() && 1 > t.totalProgress()) {
			held.current = true;
			t.pause();
		} else if (!paused && held.current) {
			held.current = false;
			t.resume();
		}
	}, [paused]);

	return <span ref={ref} className='content atbFxNumber' aria-label={formatNumber(end, fx)}>{formatNumber(end, fx)}</span>;
};

export default CountUp;
