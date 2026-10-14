import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const TypeFive = ({ attributes }) => {
    const {
        gsapAnimation,
        content = "",
        prefixText = "",
        suffixText = ""
    } = attributes;

    const {
        animationDuration = 1,
        repeatBehavior = -1,
        scaleX = 1.5,
        scaleY = 0.2
    } = gsapAnimation;

    const textRef = useRef(null);
    const timelineRef = useRef(null);
    const indexRef = useRef(0);
    const loopCountRef = useRef(repeatBehavior);

    useEffect(() => {
        const textElement = textRef.current;
        if (!textElement || !content) return;

        const sentences = content
            .split("|")
            .map(s => s.trim())
            .filter(Boolean);

        if (!sentences.length) return;

        // reset counters
        indexRef.current = 0;
        loopCountRef.current = repeatBehavior;

        if (timelineRef.current) {
            timelineRef.current.kill();
        }

        const renderSentence = (text) => {
            textElement.innerHTML = "";

            text.split("").forEach(char => {
                const span = document.createElement("span");
                span.className = "char";
                span.innerHTML = char === " " ? "&nbsp;" : char;
                textElement.appendChild(span);
            });

            gsap.set(".char", { scaleX: 1, scaleY: 1, opacity: 1 });
        };

        const playSentence = () => {
            const i = indexRef.current;
            renderSentence(sentences[i]);

            const tl = gsap.timeline({
                onComplete: () => {
                    const isLast = indexRef.current === sentences.length - 1;

                    if (isLast) {
                        if (repeatBehavior === -1) {
                            indexRef.current = 0; // infinite loop
                        } else {
                            loopCountRef.current -= 1;

                            if (loopCountRef.current <= 0) {
                                return; // 🔴 STOP completely
                            }

                            indexRef.current = 0;
                        }
                    } else {
                        indexRef.current += 1;
                    }

                    playSentence();
                }
            });

            tl.to(".char", {
                scaleX,
                scaleY,
                fontStretch: "10%",
                ease: "sine.inOut",
                duration: animationDuration,
                stagger: {
                    each: 0.08,
                    yoyo: true,
                    repeat: 1,
                },
            });

            timelineRef.current = tl;
        };

        playSentence();

        return () => {
            if (timelineRef.current) {
                timelineRef.current.kill();
            }
        };
    }, [content, animationDuration, scaleX, scaleY, repeatBehavior]);

    return (
        <div className="content">
            {prefixText && <span className="prefix-text">{prefixText}</span>}

            <div className="wrapper">
                <h1 className="txt" ref={textRef}></h1>
            </div>

            {suffixText && <span className="suffix-text">{suffixText}</span>}
        </div>
    );
};

export default TypeFive;

