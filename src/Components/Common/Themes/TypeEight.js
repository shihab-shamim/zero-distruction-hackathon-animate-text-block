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

import React, { useState, useEffect } from 'react';

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

	useEffect(() => {
		let index = 0;
		let typingInterval;

		setDisplayText('');

		typingInterval = setInterval(() => {
			if (index < fullText.length) {
				setDisplayText(fullText.slice(0, index + 1));
				index++;
			} else {
				clearInterval(typingInterval);

				setTimeout(() => {
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

		return () => clearInterval(typingInterval);
	}, [
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
						{displayText}
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

