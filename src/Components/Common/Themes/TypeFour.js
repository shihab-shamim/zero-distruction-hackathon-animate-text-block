import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { staggerOf } from "../../../utils/playback";

const TypeFour = ({ attributes }) => {
    const { gsapAnimation, content, prefixText = "", suffixText = "" } = attributes;
    const { fontStretch = "200%", animationDuration = 1, waveEffect = 25 } = gsapAnimation;

    const contentRef = useRef(null);

    useEffect(() => {
        const contentEl = contentRef.current;
        if (!contentEl) return;

        // Manually split text into characters, keeping React's original nodes to restore on cleanup
        const restoreList = [];
        contentEl.querySelectorAll(".txt").forEach((textElement) => {
            restoreList.push([textElement, Array.from(textElement.childNodes)]);
            const text = textElement.innerText;
            textElement.innerHTML = text
                .split("")
                .map((char) => `<span class="char">${char}</span>`)
                .join("");
        });

        const ctx = gsap.context(() => {
            // GSAP Timeline for wave-like effect
            let gtl = gsap.timeline({ yoyo: true, repeat: -1, delay: 0 });

            function animateText() {
                let tl = gsap.timeline()
                    .to(".char", {
                        fontStretch,
                        ease: "sine.inOut",
                        duration: animationDuration,
                        stagger: {
                            each: staggerOf(attributes, 0.2), // Speed up the stagger to get more fluidity
                            yoyo: true, // Makes the animation reverse back after each cycle
                            repeat: -1, // Repeats the animation infinitely
                        },
                        opacity: 1, // Make the characters visible as they animate
                        x: (i) => Math.sin(i * 0.5) * waveEffect, // Moves characters left-right with sin function for wave effect
                    })
                    .to(".char", {
                        fontStretch: "100%", // Shrinks the fontStretch back
                        duration: 0.3, // Faster shrinking transition
                    });

                return tl;
            }

            gsap.to(contentEl, {
                autoAlpha: 1, // Fade in the entire container
                duration: 4,
                ease: "none",
            });

            gtl.add(animateText()).seek(6).play();
        }, contentEl);

        return () => {
            ctx.kill();
            restoreList.forEach(([textElement, nodes]) => textElement.replaceChildren(...nodes));
        };
    }, [fontStretch, animationDuration, waveEffect, content, attributes.playback?.stagger]);

    return (
        <div className="content" ref={contentRef}>
            {prefixText && (<span className="prefix-text">{prefixText}</span>)}
            <div className="wrapper">
                <h1 className="txt">{content}</h1>
            </div>
            {suffixText && (<span className="suffix-text">{suffixText}</span>)}
        </div>
    );
};

export default TypeFour;
