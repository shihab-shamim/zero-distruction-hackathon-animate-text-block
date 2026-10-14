import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { getMultiShadowCSS } from '../../../../../bpl-tools/utils/getCSS';

const TypeThree = ({ attributes }) => {
    const { textAlignment, gsapAnimation, content, prefixText = "", suffixText = "" } = attributes;
    const { animationSpeed = 1, repeatDelay = 1, repeatBehavior, randomColor, color, textShadow = [], isTextShadow = false } = gsapAnimation;



    const textRef = useRef(null);

    useEffect(() => {
        if (!content) return;

        const container = textRef.current;

        // Clear existing content
        container.innerHTML = "";

        // Regex for identifying sentence end
        const sentenceEndRegex = /[.!?]$/g;

        // Split content into words
        // const words = content.split(" ");

        const sentences = content
            .split("|")
            .map(s => s.trim())
            .filter(Boolean);

        const timeline = gsap.timeline({
            repeat: repeatBehavior, // Repeats animation twice
            repeatDelay, // Delay between repetitions
        });

        let time = 0;

        sentences.forEach((sentence, sentenceIndex) => {
            const words = sentence.split(" ");
            const sentencePause = 0.6;

            words.forEach((word) => {
                const isSentenceEnd = /[.!?]$/.test(word);
                const duration =
                    Math.max(0.5, word.length * 0.08 * animationSpeed) +
                    (isSentenceEnd ? 0.6 : 0);

                const wordElement = document.createElement("span");

                wordElement.textContent = word;
                wordElement.style.position = "absolute";
                wordElement.style.top = "50%";
                wordElement.style.left = "0";
                wordElement.style.transform = "translateY(-50%)";
                wordElement.style.visibility = "hidden";
                wordElement.style.color = color;
                wordElement.style.textShadow =
                    isTextShadow && getMultiShadowCSS(textShadow, "text");

                container.appendChild(wordElement);

                gsap.set(wordElement, { autoAlpha: 0, scale: 0 });

                timeline
                    .to(
                        wordElement,
                        {
                            duration,
                            scale: 1.2,
                            autoAlpha: 1,
                            ease: "slow(0.25, 0.9, true)",
                            color: randomColor ? getRandomColor() : color,
                        },
                        time
                    )
                    .to(
                        wordElement,
                        {
                            duration,
                            autoAlpha: 0,
                            scale: 0,
                            ease: "slow(0.25, 0.9, true)",
                        },
                        time + duration - 0.05
                    );

                time += duration - 0.05;
            });

            // 👉 sentence শেষ হলে একটু pause
            time += sentencePause;
        });

        return () => {
            timeline.kill(); // Cleanup on unmount
        };
    }, [content, textAlignment, animationSpeed, repeatBehavior, repeatDelay, randomColor, textShadow, isTextShadow]);

    // Function to generate random colors
    const getRandomColor = () => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    return (
        <div className={`content align-${textAlignment}`}>
            {prefixText && (
                <span className="prefix-text">{prefixText}</span>
            )}

            {/* FIXED ANIMATION SLOT */}
            <span className="animated-wrapper">
                <span className="animated-text" ref={textRef}></span>
            </span>

            {suffixText && (
                <span className="suffix-text">{suffixText}</span>
            )}
        </div>
    );
};

export default TypeThree;