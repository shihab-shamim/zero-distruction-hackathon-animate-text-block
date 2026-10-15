import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { PlaybackContext, canScrub, playbackOf, playbackSupport } from '../../utils/playback';
import { modernFxUsesSides } from '../../utils/options';
import { formatNumber, wordsOf } from './Themes/effects/shared';

const viewOf = el => el?.ownerDocument?.defaultView || window;

const isElement = t => !!t && 1 === t.nodeType;

const targetsOf = anim => {
	if ('function' === typeof anim.getChildren) return anim.getChildren(true, true, false).flatMap(t => t.targets?.() || []);
	return anim.targets?.() || [];
};

const belongsTo = (anim, el) => targetsOf(anim).some(t => isElement(t) && el.contains(t));

// Static text shown before the animation starts (keeps the layout)
// Colours come from the block settings so the text is visible even where a style hides `.content` before it animates
const WaitText = ({ attributes }) => {
	const { options, modernFx: fx = {}, content, prefixText, suffixText, color, prefixColor, suffixColor } = attributes;
	let main = content || '';
	let sides = true;
	if ('type13' === options?.theme) {
		sides = modernFxUsesSides.includes(fx.effect);
		if ('countUp' === fx.effect) main = formatNumber(parseFloat(fx.countEnd) || 0, fx);
		else if ('rotating' === fx.effect) main = wordsOf(content)[0] || '';
	}
	return <p className='content'>
		{sides && prefixText ? <span style={{ color: prefixColor || color }}>{prefixText} </span> : null}
		<span style={{ color }}>{main}</span>
		{sides && suffixText ? <span style={{ color: suffixColor || color }}> {suffixText}</span> : null}
	</p>;
};

const SmartTrigger = ({ el, attributes, children }) => {
	const pb = playbackOf(attributes);
	const theme = attributes?.options?.theme;
	const fxEffect = attributes?.modernFx?.effect;
	const ownStart = playbackSupport.ownStart.includes(theme);

	let trigger = pb.trigger;
	if ('scrub' === trigger && !canScrub(theme, fxEffect)) trigger = 'load';
	if (ownStart && 'inView' === trigger) trigger = 'load';
	const delay = ownStart ? 0 : Math.max(0, parseFloat(pb.delay) || 0);
	const offset = Math.max(0, Math.min(100, parseFloat(pb.offset) || 0));
	const replay = 'replay' === pb.repeat;
	const startsNow = ('load' === trigger && !delay) || 'scrub' === trigger;

	const [started, setStarted] = useState(startsNow);
	const [runCount, setRunCount] = useState(0);
	const [pending, setPending] = useState(false);
	const [paused, setPaused] = useState(false);
	const [scrub, setScrub] = useState('scrub' === trigger ? 0 : null);
	const timer = useRef(null);
	const pausedAnims = useRef([]);

	const start = () => {
		clearTimeout(timer.current);
		const go = () => {
			setPending(false);
			setStarted(true);
			setRunCount(c => c + 1);
		};
		if (delay) {
			setPending(true);
			timer.current = setTimeout(go, delay * 1000);
		} else go();
	};

	const reset = () => {
		clearTimeout(timer.current);
		setPending(false);
		setStarted(false);
	};

	// Start triggers
	useEffect(() => {
		if (!el || startsNow) return;
		const view = viewOf(el);

		if ('load' === trigger) {
			start();
			return () => clearTimeout(timer.current);
		}

		if ('inView' === trigger) {
			if (!view.IntersectionObserver) {
				start();
				return () => clearTimeout(timer.current);
			}
			let inside = false;
			const observer = new view.IntersectionObserver(entries => {
				const visible = entries.some(e => e.isIntersecting);
				if (visible && !inside) {
					inside = true;
					start();
					if (!replay) observer.disconnect();
				} else if (!visible && inside) {
					inside = false;
					if (replay) reset();
				}
			}, { rootMargin: `0px 0px -${offset}% 0px`, threshold: 0 });
			observer.observe(el);
			return () => {
				observer.disconnect();
				clearTimeout(timer.current);
			};
		}

		// hover / click
		let done = false;
		const fire = () => {
			if (done && !replay) return;
			done = true;
			start();
		};
		const noHover = !!view.matchMedia?.('(hover: none)').matches;
		const hadTabIndex = el.hasAttribute('tabindex');
		if (!hadTabIndex) el.setAttribute('tabindex', '0');
		if ('click' === trigger) el.classList.add('atbTriggerClick');

		const onEnter = () => fire();
		// Keyboard focus only: a mouse click also focuses the block and would start it a second time
		const onFocus = () => { if (el.matches?.(':focus-visible')) fire(); };
		const onPointerDown = e => {
			if ('touch' === e.pointerType) fire();
		};
		const onClick = () => fire();
		const onKey = e => {
			if ('Enter' === e.key || ' ' === e.key || 'Spacebar' === e.key) {
				e.preventDefault();
				fire();
			}
		};

		if ('hover' === trigger) {
			if (noHover) el.addEventListener('click', onClick);
			else {
				el.addEventListener('mouseenter', onEnter);
				el.addEventListener('pointerdown', onPointerDown);
			}
			el.addEventListener('focus', onFocus);
		} else el.addEventListener('click', onClick);
		el.addEventListener('keydown', onKey);

		return () => {
			el.removeEventListener('mouseenter', onEnter);
			el.removeEventListener('pointerdown', onPointerDown);
			el.removeEventListener('click', onClick);
			el.removeEventListener('focus', onFocus);
			el.removeEventListener('keydown', onKey);
			el.classList.remove('atbTriggerClick');
			if (!hadTabIndex) el.removeAttribute('tabindex');
			clearTimeout(timer.current);
		};
	}, [el]);

	// Scroll scrub progress
	useEffect(() => {
		if (!el || 'scrub' !== trigger) return;
		const view = viewOf(el);
		let frame = 0;
		// Height measured once (and on window resize): the content may grow while scrubbing (a counting number wraps),
		// and following it would make the progress depend on the scroll history
		let height = el.getBoundingClientRect().height;
		const update = () => {
			frame = 0;
			const rect = el.getBoundingClientRect();
			const vh = view.innerHeight || 1;
			const startY = vh * (100 - offset) / 100;
			const endY = vh * 0.3;
			const total = startY - endY + height;
			const p = Math.max(0, Math.min(1, 0 >= total ? (rect.top < startY ? 1 : 0) : (startY - rect.top) / total));
			// Snap the ends so a scrubbed effect always reaches its first and last frame
			setScrub(0.005 > p ? 0 : 0.995 < p ? 1 : p);
		};
		const onScroll = () => {
			if (!frame) frame = view.requestAnimationFrame(update);
		};
		const onResize = () => {
			height = el.getBoundingClientRect().height;
			onScroll();
		};
		update();
		// Web fonts change the height once they load
		el.ownerDocument?.fonts?.ready?.then(onResize);
		view.addEventListener('scroll', onScroll, { passive: true });
		view.addEventListener('resize', onResize);
		return () => {
			view.removeEventListener('scroll', onScroll);
			view.removeEventListener('resize', onResize);
			if (frame) view.cancelAnimationFrame(frame);
		};
	}, [el]);

	// Auto-pause: offscreen / hidden tab
	useEffect(() => {
		if (!el || (!pb.pauseOffscreen && !pb.pauseHidden)) return;
		const view = viewOf(el);
		const doc = el.ownerDocument || document;
		let offscreen = false;
		const compute = () => setPaused((pb.pauseOffscreen && offscreen) || (pb.pauseHidden && !!doc.hidden));

		let observer;
		if (pb.pauseOffscreen && view.IntersectionObserver) {
			observer = new view.IntersectionObserver(entries => {
				offscreen = !entries.some(e => e.isIntersecting);
				compute();
			}, { threshold: 0 });
			observer.observe(el);
		}
		if (pb.pauseHidden) doc.addEventListener('visibilitychange', compute);
		compute();

		return () => {
			observer?.disconnect();
			doc.removeEventListener('visibilitychange', compute);
		};
	}, [el]);

	// Apply pause to CSS (class) and to this block's GSAP animations
	useEffect(() => {
		if (!el) return;
		const resume = () => {
			pausedAnims.current.forEach(a => a.resume());
			pausedAnims.current = [];
		};

		if (!paused) {
			el.classList.remove('atbPaused');
			resume();
			return;
		}

		el.classList.add('atbPaused');
		const scan = () => {
			gsap.globalTimeline.getChildren(false, true, true).forEach(anim => {
				if (anim.paused() || pausedAnims.current.includes(anim)) return;
				if (!belongsTo(anim, el)) return;
				anim.pause();
				pausedAnims.current.push(anim);
			});
		};
		scan();
		const interval = setInterval(scan, 500);

		return () => {
			clearInterval(interval);
			el.classList.remove('atbPaused');
			resume();
		};
	}, [el, paused]);

	if (!started) {
		const hidden = pending || ('hover' !== trigger && 'click' !== trigger);
		return <div className={`atbTriggerWait${hidden ? ' isHidden' : ''}`}>
			<WaitText attributes={attributes} />
		</div>;
	}

	return <PlaybackContext.Provider key={runCount} value={{ paused, scrub }}>
		{'function' === typeof children ? children() : children}
	</PlaybackContext.Provider>;
};
export default SmartTrigger;
