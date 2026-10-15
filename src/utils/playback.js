import { createContext, useContext } from 'react';

// Smart Triggers & Playback Control (Pro). Missing/default values = the old behaviour (start on page load, never paused).
export const playbackDefaults = {
	trigger: 'load', // load | inView | hover | click | scrub
	offset: 0, // viewport offset in % (inView, scrub)
	delay: 0, // start delay in seconds
	repeat: 'once', // once | replay
	stagger: '', // '' = the style's own stagger
	pauseOffscreen: false,
	pauseHidden: false
};

export const playbackOf = attributes => ({ ...playbackDefaults, ...(attributes?.playback || {}) });

// Which style supports what
export const playbackSupport = {
	noPanel: ['type12'], // Text Scroll is driven by scrolling itself
	ownStart: ['type13'], // Modern Effects keeps its own Start / Start Delay / Replay
	scrub: { type8: true, type11: true, type13: ['blurIn', 'scramble', 'lineMask', 'countUp'] },
	stagger: ['default', 'type2', 'type4', 'type5', 'type6', 'type7']
};

export const canScrub = (theme, fxEffect) => {
	const s = playbackSupport.scrub[theme];
	return Array.isArray(s) ? s.includes(fxEffect) : !!s;
};

// Frontend wrapper is only needed when something differs from the old behaviour
export const needsSmartTrigger = (pb, theme, fxEffect) => {
	if (playbackSupport.noPanel.includes(theme)) return false;
	if ('scrub' === pb.trigger && !canScrub(theme, fxEffect)) return pb.pauseOffscreen || pb.pauseHidden;
	const ownStart = playbackSupport.ownStart.includes(theme);
	const trigger = ownStart && 'inView' === pb.trigger ? 'load' : pb.trigger;
	const delay = ownStart ? 0 : parseFloat(pb.delay) || 0;
	return 'load' !== trigger || 0 < delay || pb.pauseOffscreen || pb.pauseHidden;
};

// Custom stagger in seconds, or the style's own value
export const staggerOf = (attributes, fallback) => {
	const v = attributes?.playback?.stagger;
	const n = parseFloat(v);
	return '' === v || undefined === v || null === v || !Number.isFinite(n) ? fallback : n;
};

// Provided by SmartTrigger on the frontend. Editor / old blocks get the default: never paused, no scrub.
// paused: true while auto-paused. scrub: null, or scroll progress 0..1 when trigger is 'scrub'.
export const PlaybackContext = createContext({ paused: false, scrub: null });
export const usePlayback = () => useContext(PlaybackContext);
