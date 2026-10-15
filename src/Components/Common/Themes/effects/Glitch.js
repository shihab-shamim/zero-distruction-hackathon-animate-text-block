import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { num, paragraphsOf, prefersReducedMotion, usePlay } from './shared';

gsap.registerPlugin(SplitText);

// Characters flicker in, then short RGB-split bursts repeat every few seconds
const Glitch = ({ attributes, fx }) => {
	const ref = useRef(null);
	const tl = useRef(null);
	const play = usePlay(ref, fx);

	useLayoutEffect(() => {
		const el = ref.current;
		if (!el || prefersReducedMotion(el)) return;
		const split = SplitText.create(el.querySelectorAll('.atbFxPara'), { type: 'words,chars', aria: 'auto' });
		const chars = split.chars;
		const i = Math.max(1, num(fx.intensity, 6));
		const c1 = fx.glitchColor1 || '#ff2bd6', c2 = fx.glitchColor2 || '#00e5ff';
		const r = gsap.utils.random;

		const t = gsap.timeline({ paused: true });
		t.fromTo(chars, { opacity: 0 }, { opacity: 1, duration: 0.06, stagger: { each: num(fx.stagger, 0.03), from: 'random' }, ease: 'steps(2)' });

		const burst = gsap.timeline({ repeat: -1, repeatDelay: Math.max(0.3, num(fx.glitchEvery, 2.5)) });
		burst.to(el, { textShadow: `${i / 2}px 0 ${c1}, ${-i / 2}px 0 ${c2}`, duration: 0.04 })
			.to(chars, { x: () => r(-i, i), y: () => r(-i / 3, i / 3), skewX: () => r(-i * 2, i * 2), duration: 0.05, stagger: { each: 0.004, from: 'random' }, repeat: 3, yoyo: true, ease: 'none' }, '<')
			.to(el, { textShadow: `${-i / 2}px 0 ${c1}, ${i / 2}px 0 ${c2}`, duration: 0.05 }, '<0.1')
			.to(chars, { x: 0, y: 0, skewX: 0, duration: 0.05 })
			.to(el, { textShadow: '0px 0 rgba(0,0,0,0), 0px 0 rgba(0,0,0,0)', duration: 0.05 }, '<');
		t.add(burst, '+=0.6');

		tl.current = t;
		return () => { t.kill(); burst.kill(); gsap.set(el, { clearProps: 'textShadow' }); split.revert(); };
	}, []);

	useEffect(() => {
		if (!play || !tl.current) return;
		tl.current.delay(num(fx.delay, 0)).restart(true);
	}, [play]);

	return <div ref={ref} className='content'>
		{paragraphsOf(attributes.content).map((p, i) => <div key={i} className='atbFxPara'>{p}</div>)}
	</div>;
};

export default Glitch;
