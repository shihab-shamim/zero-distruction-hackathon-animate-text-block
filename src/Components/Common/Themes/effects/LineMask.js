import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { modernFxEases } from '../../../../utils/options';
import { num, paragraphsOf, prefersReducedMotion, usePlay } from './shared';

gsap.registerPlugin(SplitText);

// Each line slides up (or down) out of its own mask
const LineMask = ({ attributes, fx }) => {
	const ref = useRef(null);
	const tl = useRef(null);
	const played = useRef(false);
	const play = usePlay(ref, fx);

	useLayoutEffect(() => {
		const el = ref.current;
		if (!el || prefersReducedMotion(el)) return;
		const from = 'down' === fx.maskDirection ? -110 : 110;
		const split = SplitText.create(el.querySelectorAll('.atbFxPara'), {
			type: 'lines',
			mask: 'lines',
			aria: 'auto',
			autoSplit: true,
			onSplit(self) {
				const t = gsap.timeline({ paused: true, repeat: fx.loop ? -1 : 0, repeatDelay: 0.3 });
				t.fromTo(self.lines, { yPercent: from }, { yPercent: 0, duration: num(fx.duration, 0.9), stagger: num(fx.stagger, 0.03) * 4, ease: modernFxEases[fx.ease] || 'power3.out' });
				if (fx.loop) t.to(self.lines, { yPercent: -from, duration: num(fx.duration, 0.9) * 0.7, stagger: num(fx.stagger, 0.03) * 2, ease: 'power2.in' }, `+=${num(fx.loopDelay, 2)}`);
				if (played.current) t.progress(fx.loop ? 0 : 1).play();
				tl.current = t;
				return t;
			}
		});
		return () => { tl.current?.kill(); split.revert(); };
	}, []);

	useEffect(() => {
		if (!play || !tl.current) return;
		played.current = true;
		tl.current.delay(num(fx.delay, 0)).restart(true);
	}, [play]);

	return <div ref={ref} className='content'>
		{paragraphsOf(attributes.content).map((p, i) => <div key={i} className='atbFxPara'>{p}</div>)}
	</div>;
};

export default LineMask;
