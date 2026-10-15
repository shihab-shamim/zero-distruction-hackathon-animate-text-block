// import React, { useState, useEffect } from 'react';

// const TypeEight = ({ attributes }) => {
// 	const { content, gsapAnimation, prefixText, suffixText } = attributes;
// 	const { typingSpeed = 100, reStartTime = 1000, autoRepeat = true} = gsapAnimation;

// 	const texts = content
// 		.split('|')
// 		.map(text => text.trim())
// 		.filter(Boolean);

// 	const [displayText, setDisplayText] = useState('');
// 	const [textIndex, setTextIndex] = useState(0);
// 	const [cycle, setCycle] = useState(0); // 🔥 NEW

// 	const fullText = texts[textIndex] || '';

// 	useEffect(() => {
// 		let index = 0;
// 		let typingInterval;

// 		setDisplayText('');

// 		typingInterval = setInterval(() => {
// 			if (index < fullText.length) {
// 				setDisplayText(fullText.slice(0, index + 1));
// 				index++;
// 			} else {
// 				clearInterval(typingInterval);

// 				setTimeout(() => {
// 					if (texts.length > 1) {
// 						setTextIndex(prev =>
// 							prev + 1 < texts.length ? prev + 1 : 0
// 						);
// 					} else {
// 						// 🔁 single string → force re-run
// 						setCycle(prev => prev + 1);
// 					}
// 				}, reStartTime);
// 			}
// 		}, typingSpeed);

// 		return () => clearInterval(typingInterval);
// 	}, [textIndex, cycle, fullText, typingSpeed, reStartTime]);

// 	return (
// 		<div className="content">
// 			<div className="stage">
// 				<p className="type8-line">
// 					{prefixText && (
// 						<span className="atb-prefix">
// 							{prefixText}{' '}
// 						</span>
// 					)}

// 					<span className="atb-typing-text">
// 						{displayText}
// 						<span className="cursor"></span>
// 					</span>

// 					{suffixText && (
// 						<span className="atb-suffix">
// 							{' '}{suffixText}
// 						</span>
// 					)}
// 				</p>
// 			</div>
// 		</div>
// 	);
// };

// export default TypeEight;

import React, { useState, useEffect, useRef } from 'react';
import { usePlayback } from '../../../utils/playback';

// Scroll scrub: progress runs through every sentence in order, returns the sentence being typed so far
const scrubbedText = (texts, progress) => {
	let pos = Math.round(Math.min(1, Math.max(0, progress)) * texts.reduce((n, t) => n + t.length, 0));
	for (let i = 0; i < texts.length; i++) {
		if (pos <= texts[i].length || i === texts.length - 1) return texts[i].slice(0, pos);
		pos -= texts[i].length;
	}
	return '';
};

const TypeEight = ({ attributes }) => {
	const { content, gsapAnimation, prefixText, suffixText } = attributes;

	const {
		typingSpeed = 100,
		reStartTime = 1000,
		autoRepeat = true,
	} = gsapAnimation;

	const texts = content
		.split('|')
		.map(text => text.trim())
		.filter(Boolean);

	const [displayText, setDisplayText] = useState('');
	const [textIndex, setTextIndex] = useState(0);
	const [cycle, setCycle] = useState(0); // only for single text repeat

	const fullText = texts[textIndex] || '';

	const { paused, scrub } = usePlayback();
	const scrubbing = Number.isFinite(scrub);
	const pausedRef = useRef(paused);
	pausedRef.current = paused;

	useEffect(() => {
		if (scrubbing) return;
		let index = 0;
		let typingInterval;
		let alive = true;

		setDisplayText('');

		// Auto-pause: hold the wait between sentences until playback continues
		const after = (fn, ms) => setTimeout(function wait() {
			if (!pausedRef.current) fn();
			else if (alive) setTimeout(wait, 100);
		}, ms);

		typingInterval = setInterval(() => {
			if (pausedRef.current) return;
			if (index < fullText.length) {
				setDisplayText(fullText.slice(0, index + 1));
				index++;
			} else {
				clearInterval(typingInterval);

				after(() => {
					// 🔹 MULTIPLE SENTENCE
					if (texts.length > 1) {
						const isLast = textIndex === texts.length - 1;

						if (isLast) {
							// last sentence
							if (autoRepeat) {
								setTextIndex(0); // loop
							}
							// autoRepeat false → stop here ✅
						} else {
							setTextIndex(prev => prev + 1); // next sentence
						}
					}
					// 🔹 SINGLE SENTENCE
					else {
						if (autoRepeat) {
							setCycle(prev => prev + 1); // force re-run
						}
						// autoRepeat false → stop
					}
				}, reStartTime);
			}
		}, typingSpeed);

		return () => {
			alive = false;
			clearInterval(typingInterval);
		};
	}, [
		scrubbing,
		textIndex,
		cycle,
		fullText,
		typingSpeed,
		reStartTime,
		autoRepeat,
		texts.length,
	]);

	return (
		<div className="content">
			<div className="stage">
				<p className="type8-line">
					{prefixText && (
						<span className="atb-prefix">
							{prefixText}{' '}
						</span>
					)}

					<span className="atb-typing-text">
						{scrubbing ? scrubbedText(texts, scrub) : displayText}
						<span className="cursor"></span>
					</span>

					{suffixText && (
						<span className="atb-suffix">
							{' '}{suffixText}
						</span>
					)}
				</p>
			</div>
		</div>
	);
};

export default TypeEight;

