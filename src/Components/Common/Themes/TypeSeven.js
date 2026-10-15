import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { staggerOf } from "../../../utils/playback";

const TypeSeven = ({ attributes }) => {
    const { gsapAnimation, content, prefixText = "", suffixText = "" } = attributes;
    const { animationDuration, autoRepeat } = gsapAnimation;

    const repeatAnimate = autoRepeat ? -1 : 1;


    const textRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const textElement = textRef.current;
        const content = contentRef.current;

        if (textElement) {
            // Keep React's original nodes so cleanup can restore them before the next split
            const originalNodes = Array.from(textElement.childNodes);

            // Custom SplitText Function
            const splitTextIntoChars = (element) => {
                const text = element.innerText;
                element.innerHTML = "";
                text.split("").forEach((char) => {
                    const span = document.createElement("span");
                    span.className = "char";
                    span.textContent = char;
                    element.appendChild(span);
                });
            };

            // Apply custom SplitText
            splitTextIntoChars(textElement);

            const ctx = gsap.context(() => {
                let gtl = gsap.timeline({ yoyo: true, repeat: repeatAnimate, delay: 0 });

                const animateText = () => {
                    return gsap.timeline().to(".char", {
                        fontStretch: "10%",
                        ease: "sine.inOut",
                        duration: animationDuration,
                        stagger: {
                            each: staggerOf(attributes, 0.4),
                            yoyo: true,
                            repeat: repeatAnimate,
                        },
                    });
                }

                gsap.to(content, {
                    autoAlpha: 1,
                    duration: 4,
                    ease: "none",
                });

                gtl.add(animateText()).seek(6).play();
            }, textElement);

            return () => {
                ctx.kill();
                textElement.replaceChildren(...originalNodes);
            };
        }
    }, [animationDuration, repeatAnimate, content, attributes.playback?.stagger]);

    return (
        <div className="content" ref={contentRef}>
            {prefixText && (<span className="prefix-text">{prefixText}</span>)}
            <p ref={textRef} className="txt">{content}</p>
            {suffixText && (<span className="suffix-text">{suffixText}</span>)}
        </div>
    );
};

export default TypeSeven;

