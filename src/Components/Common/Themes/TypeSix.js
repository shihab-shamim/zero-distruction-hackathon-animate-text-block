import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const TypeSix = ({ attributes }) => {
    const {
        gsapAnimation,
        content,
        prefixText = "",
        suffixText = "",
        repeat = true, // 🔥 IMPORTANT
    } = attributes;

    const {
        easeType = "elastic(0.3, 0.2)",
        repeatBehavior = -1,
    } = gsapAnimation;

    const stageRef = useRef(null);
    const repeatCountRef = useRef(0);
    const timerRef = useRef(null);

    const sentences = content
        .split(" | ")
        .map(s => s.trim())
        .filter(Boolean);

    const [sentenceIndex, setSentenceIndex] = useState(0);
    const [chars, setChars] = useState([]);

    /* sentence → chars */
    useEffect(() => {
        const text = sentences[sentenceIndex] || "";
        setChars(text.split(""));
    }, [sentenceIndex, content]);

    /* animation trigger */
    useEffect(() => {
        if (!chars.length) return;

        animateText();

        const totalDuration = 2200 + chars.length * 80;

        timerRef.current = setTimeout(() => {

            // 🔢 repeatBehavior control
            if (repeatBehavior !== -1) {
                repeatCountRef.current += 1;
                if (repeatCountRef.current >= repeatBehavior) return;
            }

            // ❌ repeat = false → stop properly
            if (!repeat) {
                if (sentences.length > 1) {
                    if (sentenceIndex === sentences.length - 1) return;
                    setSentenceIndex(prev => prev + 1);
                }
                return;
            }

            // ✅ repeat = true
            if (sentences.length > 1) {
                setSentenceIndex(prev =>
                    prev === sentences.length - 1 ? 0 : prev + 1
                );
            } else {
                // single sentence → force re-animation
                setChars(prev => [...prev]);
            }

        }, totalDuration);

        return () => clearTimeout(timerRef.current);
    }, [chars]);

    /* GSAP animation */
    const animateText = () => {
        gsap.set(stageRef.current, { autoAlpha: 1 });

        gsap.from(stageRef.current.querySelectorAll(".char"), {
            duration: 2,
            y: -500,
            fontWeight: 700,
            fontStretch: 80,
            scaleY: 2,
            ease: easeType,
            stagger: { each: 0.1, from: "random" },
        });
    };

    return (
        <div ref={stageRef} className="content">
            {prefixText && (
                <span className="prefix-text">{prefixText}</span>
            )}

            <div className="animated-wrapper">
                <p className="txt">
                    {chars.map((char, i) => (
                        <span key={i} className="char">
                            {char === " " ? "\u00A0" : char}
                        </span>
                    ))}
                </p>
            </div>

            {suffixText && (
                <span className="suffix-text">{suffixText}</span>
            )}
        </div>
    );
};

export default TypeSix;


