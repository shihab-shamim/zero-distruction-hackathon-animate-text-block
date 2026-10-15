import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { modernFxCharsets } from '../../../../utils/options';
import { num, paragraphsOf, prefersReducedMotion, usePlay, useScrub } from './shared';

gsap.registerPlugin(ScrambleTextPlugin);

const POOLS = { upperCase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', lowerCase: 'abcdefghijklmnopqrstuvwxyz', upperAndLowerCase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' };

const Scramble = ({ attributes, fx }) => {
	const ref = useRef(null);
	const tl = useRef(null);
	const play = usePlay(ref, fx);
	const scrub = useScrub(tl);
	const paras = paragraphsOf(attributes.content);

	const chars = 'custom' === fx.charset ? (fx.customChars || '01') : (modernFxCharsets[fx.charset] || 'upperCase');
	const pool = POOLS[chars] || chars;
	const noise = text => [...text].map(c => (' ' === c ? ' ' : pool[Math.floor(Math.random() * pool.length)])).join('');

	useLayoutEffect(() => {
		const el = ref.current;
		if (!el || prefersReducedMotion(el)) return;
		const nodes = [...el.querySelectorAll('.atbFxPara')];
		// Start from scrambled noise of the same length so the layout does not jump
		nodes.forEach((n, i) => { n.textContent = noise(paras[i]); });
		const t = gsap.timeline({ paused: true, repeat: fx.loop && null === scrub.current ? -1 : 0, repeatDelay: num(fx.loopDelay, 2) });
		nodes.forEach((n, i) => {
			t.to(n, { duration: num(fx.duration, 0.9) * 1.6, ease: 'none', scrambleText: { text: paras[i], chars, revealDelay: num(fx.revealDelay, 0.3), speed: num(fx.speed, 0.6) } }, i * 0.15);
		});
		if (null !== scrub.current) t.progress(scrub.current);
		tl.current = t;
		return () => { t.kill(); nodes.forEach((n, i) => { n.textContent = paras[i]; }); };
	}, []);

	useEffect(() => {
		if (!play || !tl.current || null !== scrub.current) return;
		tl.current.delay(num(fx.delay, 0)).restart(true);
	}, [play]);

	return <div ref={ref} className='content' aria-label={paras.join(' ')}>
		{paras.map((p, i) => <div key={i} className='atbFxPara' aria-hidden='true'>{p}</div>)}
	</div>;
};

export default Scramble;
