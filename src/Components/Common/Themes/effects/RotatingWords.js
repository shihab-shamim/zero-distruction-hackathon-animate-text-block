import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { modernFxEases } from '../../../../utils/options';
import { num, prefersReducedMotion, usePlay, wordsOf } from './shared';

// One slot in the sentence that cycles through several words (clip, 3D flip or a letter wave)
const RotatingWords = ({ attributes, fx }) => {
	const ref = useRef(null);
	const tl = useRef(null);
	const play = usePlay(ref, fx);
	const words = wordsOf(attributes.content);
	const mode = ['clip', 'flip', 'wave'].includes(fx.rotateAnimation) ? fx.rotateAnimation : 'clip';

	useLayoutEffect(() => {
		const el = ref.current;
		if (!el || 2 > words.length) return;
		const items = [...el.querySelectorAll('.atbFxWord')];
		// Reduced motion: keep the first word only, no cycling
		if (prefersReducedMotion(el)) {
			gsap.set(items.slice(1), { autoAlpha: 0 });
			return () => gsap.set(items, { clearProps: 'all' });
		}
		const widths = items.map(w => w.scrollWidth);
		const dur = num(fx.duration, 0.9) * 0.7, hold = num(fx.holdTime, 2), ease = modernFxEases[fx.ease] || 'power3.out';

		// fromTo tweens below use immediateRender: false so building the loop does not hide the first word
		gsap.set(items.slice(1), { autoAlpha: 0 });
		gsap.set(el, { width: widths[0] });
		const t = gsap.timeline({ paused: true, repeat: -1 });
		items.forEach((cur, i) => {
			const next = items[(i + 1) % items.length];
			const at = `+=${hold}`;
			t.to(el, { width: widths[(i + 1) % items.length], duration: dur, ease }, at);
			if ('flip' === mode) {
				t.to(cur, { rotationX: 90, autoAlpha: 0, duration: dur * 0.6, ease: 'power2.in' }, '<')
					.fromTo(next, { rotationX: -90, autoAlpha: 0 }, { rotationX: 0, autoAlpha: 1, duration: dur * 0.8, ease, immediateRender: false }, `<${dur * 0.45}`);
			} else if ('wave' === mode) {
				t.to(cur.children, { yPercent: -110, opacity: 0, duration: dur * 0.6, stagger: 0.025, ease: 'power2.in' }, '<')
					.set(cur, { autoAlpha: 0 })
					.set(next, { autoAlpha: 1 })
					.fromTo(next.children, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: dur * 0.7, stagger: 0.03, ease, immediateRender: false }, '<');
			} else {
				t.to(cur, { yPercent: -110, autoAlpha: 0, duration: dur, ease }, '<')
					.fromTo(next, { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: dur, ease, immediateRender: false }, '<');
			}
		});
		tl.current = t;
		return () => { t.kill(); gsap.set([el, ...items, ...items.flatMap(w => [...w.children])], { clearProps: 'all' }); };
	}, []);

	useEffect(() => {
		if (!play || !tl.current) return;
		tl.current.delay(num(fx.delay, 0)).restart(true);
	}, [play]);

	return <span ref={ref} className={`content atbFxRotator is-${mode}`} aria-label={words.join(', ')}>
		{words.map((w, i) => <span key={i} className='atbFxWord' aria-hidden='true'>
			{[...w].map((c, j) => <span key={j} className='atbFxChar'>{' ' === c ? ' ' : c}</span>)}
		</span>)}
	</span>;
};

export default RotatingWords;
