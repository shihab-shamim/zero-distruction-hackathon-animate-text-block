import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { num, paragraphsOf, prefersReducedMotion, usePlay } from './shared';

// Text filled with a gradient that has a bright band; the band sweeps across by moving the background
const Shiny = ({ attributes, fx }) => {
	const ref = useRef(null);
	const tw = useRef(null);
	const play = usePlay(ref, fx);

	const base = fx.baseColor || attributes.color || '#1e1e1e';
	const shine = fx.shineColor || '#ffffff';
	const w = Math.min(60, Math.max(4, num(fx.shineWidth, 20)));
	const style = {
		backgroundImage: `linear-gradient(${num(fx.shineAngle, 110)}deg, ${base} 0%, ${base} ${50 - w / 2}%, ${shine} 50%, ${base} ${50 + w / 2}%, ${base} 100%)`,
		backgroundSize: '300% 100%',
		backgroundPosition: '100% 0'
	};

	useLayoutEffect(() => {
		const el = ref.current;
		if (!el || prefersReducedMotion(el)) return;
		tw.current = gsap.fromTo(el.querySelectorAll('.atbFxPara'), { backgroundPosition: '100% 0' }, { backgroundPosition: '0% 0', duration: Math.max(0.3, num(fx.duration, 0.9) * 2), ease: 'none', repeat: -1, repeatDelay: num(fx.sweepPause, 1.5), paused: true });
		return () => tw.current?.kill();
	}, []);

	useEffect(() => {
		if (!play || !tw.current) return;
		tw.current.delay(num(fx.delay, 0)).restart(true);
	}, [play]);

	return <div ref={ref} className='content'>
		{paragraphsOf(attributes.content).map((p, i) => <div key={i} className='atbFxPara atbFxShiny' style={style}>{p}</div>)}
	</div>;
};

export default Shiny;
