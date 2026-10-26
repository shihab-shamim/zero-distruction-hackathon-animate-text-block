import React, { useEffect, useState } from 'react';
import { modernFxDefaults, modernFxSideDefaults, modernFxUsesSides } from '../../../utils/options';
import { formatNumber, paragraphsOf, wordsOf } from './effects/shared';

// Each effect is its own chunk, so only the effects used on a page are downloaded
const loaders = {
	blurIn: () => import(/* webpackChunkName: "atb-fx-blur-in" */ './effects/BlurIn'),
	scramble: () => import(/* webpackChunkName: "atb-fx-scramble" */ './effects/Scramble'),
	shiny: () => import(/* webpackChunkName: "atb-fx-shiny" */ './effects/Shiny'),
	lineMask: () => import(/* webpackChunkName: "atb-fx-line-mask" */ './effects/LineMask'),
	glitch: () => import(/* webpackChunkName: "atb-fx-glitch" */ './effects/Glitch'),
	rotating: () => import(/* webpackChunkName: "atb-fx-rotating-words" */ './effects/RotatingWords'),
	countUp: () => import(/* webpackChunkName: "atb-fx-count-up" */ './effects/CountUp')
};
const loaded = {};

// Same text as the effect will render, kept invisible until the effect has loaded (no layout jump)
const Placeholder = ({ effect, attributes, fx }) => {
	if ('countUp' === effect) return <span className='content atbFxNumber atbFxPending'>{formatNumber(parseFloat(fx.countEnd) || 0, fx)}</span>;
	if ('rotating' === effect) return <span className='content atbFxRotator atbFxPending'><span className='atbFxWord'>{wordsOf(attributes.content)[0] || ''}</span></span>;
	return <div className='content atbFxPending'>{paragraphsOf(attributes.content).map((p, i) => <div key={i} className='atbFxPara'>{p}</div>)}</div>;
};

const TypeThirteen = ({ attributes }) => {
	const { prefixText, suffixText, modernFx = {} } = attributes;
	const fx = { ...modernFxDefaults, ...modernFx };
	const effect = loaders[fx.effect] ? fx.effect : modernFxDefaults.effect;
	const [Effect, setEffect] = useState(() => loaded[effect] || null);

	useEffect(() => {
		let alive = true;
		if (loaded[effect]) { setEffect(() => loaded[effect]); return; }
		setEffect(null);
		loaders[effect]().then(m => {
			loaded[effect] = m.default;
			if (alive) setEffect(() => m.default);
		});
		return () => { alive = false; };
	}, [effect]);

	// Re-mount the effect (and replay it) whenever its text or settings change
	const key = JSON.stringify([fx, attributes.content, attributes.color, attributes.typography, attributes.textAlignment]);
	const sides = modernFxUsesSides.includes(effect);
	// Defaults only until the user edits the field; a cleared field stays empty
	const beforeText = prefixText ?? modernFxSideDefaults[effect]?.[0];
	const afterText = suffixText ?? modernFxSideDefaults[effect]?.[1];

	return (
		<div className={`typeThirteen atbFx-${effect}${sides ? ' hasSides' : ''}`}>
			{sides && beforeText && <span className='prefix-text'>{beforeText}</span>}
			{Effect ? <Effect key={key} attributes={attributes} fx={fx} /> : <Placeholder effect={effect} attributes={attributes} fx={fx} />}
			{sides && afterText && <span className='suffix-text'>{afterText}</span>}
		</div>
	);
};

export default TypeThirteen;
