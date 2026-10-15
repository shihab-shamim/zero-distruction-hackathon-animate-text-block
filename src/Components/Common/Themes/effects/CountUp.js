import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { modernFxEases } from '../../../../utils/options';
import { formatNumber, num, prefersReducedMotion, usePlay } from './shared';

const CountUp = ({ fx }) => {
	const ref = useRef(null);
	const tw = useRef(null);
	const play = usePlay(ref, fx);
	const start = num(fx.countStart, 0), end = num(fx.countEnd, 100);

	useLayoutEffect(() => {
		const el = ref.current;
		if (!el || prefersReducedMotion(el)) return;
		const box = { v: start };
		el.textContent = formatNumber(start, fx);
		tw.current = gsap.to(box, {
			v: end, duration: Math.max(0.1, num(fx.countDuration, 2)), ease: modernFxEases[fx.ease] || 'power3.out', paused: true,
			repeat: fx.loop ? -1 : 0, repeatDelay: num(fx.loopDelay, 2),
			onUpdate: () => { el.textContent = formatNumber(box.v, fx); },
			onRepeat: () => { box.v = start; }
		});
		return () => { tw.current?.kill(); el.textContent = formatNumber(end, fx); };
	}, []);

	useEffect(() => {
		if (!play || !tw.current) return;
		tw.current.delay(num(fx.delay, 0)).restart(true);
	}, [play]);

	return <span ref={ref} className='content atbFxNumber' aria-label={formatNumber(end, fx)}>{formatNumber(end, fx)}</span>;
};

export default CountUp;
