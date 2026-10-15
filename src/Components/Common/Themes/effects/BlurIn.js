import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { modernFxEases } from '../../../../utils/options';
import { num, paragraphsOf, prefersReducedMotion, usePlay } from './shared';

gsap.registerPlugin(SplitText);

const BlurIn = ({ attributes, fx }) => {
	const ref = useRef(null);
	const tl = useRef(null);
	const played = useRef(false);
	const play = usePlay(ref, fx);

	useLayoutEffect(() => {
		const el = ref.current;
		if (!el || prefersReducedMotion(el)) return;
		const by = ['chars', 'words', 'lines'].includes(fx.splitBy) ? fx.splitBy : 'chars';
		const blur = num(fx.blur, 12), y = num(fx.offsetY, 24), duration = num(fx.duration, 0.9), stagger = num(fx.stagger, 0.03);

		const split = SplitText.create(el.querySelectorAll('.atbFxPara'), {
			type: 'lines' === by ? 'lines' : 'words' === by ? 'words' : 'words,chars',
			aria: 'auto',
			autoSplit: 'lines' === by,
			onSplit(self) {
				const targets = self[by];
				const t = gsap.timeline({ paused: true, repeat: fx.loop ? -1 : 0, repeatDelay: 0.4 });
				t.fromTo(targets, { opacity: 0, filter: `blur(${blur}px)`, y }, { opacity: 1, filter: 'blur(0px)', y: 0, duration, stagger, ease: modernFxEases[fx.ease] || 'power3.out' });
				if (fx.loop) t.to(targets, { opacity: 0, filter: `blur(${blur}px)`, y: -y * 0.5, duration: duration * 0.7, stagger: stagger * 0.5, ease: 'power2.in' }, `+=${num(fx.loopDelay, 2)}`);
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

export default BlurIn;
