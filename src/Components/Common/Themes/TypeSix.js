import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { staggerOf, usePlayback } from "../../../utils/playback";

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
    const pendingRef = useRef(null);
    const { paused } = usePlayback();
    const pausedRef = useRef(paused);
    const stagger = staggerOf(attributes, 0.1);

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

        const totalDuration = 2200 + chars.length * Math.round(stagger * 800);

        pendingRef.current = { remaining: totalDuration, step: () => {

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

        } };
        if (!pausedRef.current) schedule();

        return () => {
            clearTimeout(timerRef.current);
            pendingRef.current = null;
        };
    }, [chars, stagger]);

    /* auto-pause: hold the pending step, continue with the remaining time */
    useEffect(() => {
        if (pausedRef.current === paused) return;
        pausedRef.current = paused;
        const pending = pendingRef.current;
        if (!pending) return;
        if (paused) {
            clearTimeout(timerRef.current);
            pending.remaining = Math.max(0, pending.remaining - (Date.now() - pending.start));
        } else {
            schedule();
        }
    }, [paused]);

    const schedule = () => {
        const pending = pendingRef.current;
        if (!pending) return;
        pending.start = Date.now();
        timerRef.current = setTimeout(() => {
            if (pendingRef.current === pending) pendingRef.current = null;
            pending.step();
        }, pending.remaining);
    };

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
            stagger: { each: stagger, from: "random" },
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


