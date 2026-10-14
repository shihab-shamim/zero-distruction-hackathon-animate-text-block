// import React, { useEffect, useRef, useState } from "react";
// import { gsap } from "gsap";

// const colors = [
//     { main: "#FBDB4A", shades: ["#FAE073", "#FCE790", "#FADD65", "#E4C650"] },
//     { main: "#F3934A", shades: ["#F7B989", "#F9CDAA", "#DD8644", "#F39C59"] },
//     { main: "#EB547D", shades: ["#EE7293", "#F191AB", "#D64D72", "#C04567"] },
//     { main: "#9F6AA7", shades: ["#B084B6", "#C19FC7", "#916198", "#82588A"] },
//     { main: "#5476B3", shades: ["#6382B9", "#829BC7", "#4D6CA3", "#3E5782"] },
//     { main: "#2BB19B", shades: ["#4DBFAD", "#73CDBF", "#27A18D", "#1F8171"] },
//     { main: "#70B984", shades: ["#7FBE90", "#98CBA6", "#68A87A", "#5E976E"] }
// ];

// const shapes = ["■", "▲", "▼", "◆", "◢", "◣", "◤", "◥", "★"]; // Different confetti shapes

// const TypeNine = ({ attributes }) => {
//     const { content, textAlignment, gsapAnimation, color, repeat = false, prefixText = "", suffixText = "" } = attributes;
//     const { typingSpeed, randomColor, isTextShadow } = gsapAnimation;

//     const textRef = useRef(null);
//     const offscreenTextRef = useRef(null);
//     const lettersRef = useRef([]);
//     const [firstRender, setFirstRender] = useState(true);
//     const [isAnimating, setIsAnimating] = useState(false);

//     useEffect(() => {
//         if (firstRender) {
//             setFirstRender(false);
//             animateFullText(content);
//         } else {
//             handleInputChange();
//         }
//     }, [content]);

//     useEffect(() => {
//         let interval = null;
//         if (repeat) {
//             interval = setInterval(() => {
//                 if (!isAnimating) {
//                     animateFullText(content);
//                 }
//             }, content.length * typingSpeed + 3000);
//         }
//         return () => {
//             clearInterval(interval);
//         }
//     }, [repeat, content])

//     useEffect(() => {
//         if (textAlignment && textRef.current) {
//             textRef.current.style.textAlign = textAlignment;
//         }
//     }, [textAlignment]);

//     useEffect(() => {
//         if (!firstRender) {
//             animateFullText(content);
//         }
//     }, [typingSpeed, gsapAnimation, isTextShadow]);

//     const animateFullText = (text) => {
//         if (!text || isAnimating) return;

//         setIsAnimating(true);
//         lettersRef.current = [];
//         textRef.current.innerHTML = "";
//         offscreenTextRef.current.innerHTML = "";

//         text.split("").forEach((char, i) => {
//             setTimeout(() => {
//                 const formattedChar = char === " " ? "\u00A0" : char;
//                 const letter = document.createElement("span");
//                 const oLetter = document.createElement("span");
//                 letter.textContent = formattedChar;
//                 oLetter.textContent = formattedChar;

//                 const colorValue = randomColor ? colors[i % colors.length] : color;
//                 letter.style.color = colorValue.main;


//                 textRef.current.appendChild(letter);
//                 offscreenTextRef.current.appendChild(oLetter);

//                 lettersRef.current.push({ onScreen: letter, offScreen: oLetter, char: formattedChar });

//                 animateLetterIn(letter);

//                 if (i === text.length - 1) {
//                     setTimeout(() => setIsAnimating(false), i * typingSpeed + 200);
//                 }
//             }, i * typingSpeed);
//         });
//     };

//     const animateLetterIn = (letter) => {
//         const yOffset = (0.5 + Math.random() * 0.5) * 50;
//         gsap.fromTo(letter,
//             { scale: 0, opacity: 0 },
//             { scale: 1, opacity: 1, duration: 0.4, ease: "back.out" }
//         );
//         gsap.to(letter, {
//             y: -yOffset,
//             duration: 0.2,
//             ease: "power3.inOut",
//             yoyo: true,
//             repeat: 1
//         });
//         gsap.to(letter, {
//             rotation: -50 + Math.random() * 100,
//             duration: 0.2,
//             ease: "power3.inOut",
//             yoyo: true,
//             repeat: 1
//         });

//         generateConfetti(letter);
//     };


//     const generateConfetti = (letter) => {
//         for (let i = 0; i < 10 + Math.floor(Math.random() * 2); i++) {
//             const confetti = document.createElement("span");
//             confetti.textContent = shapes[Math.floor(Math.random() * shapes.length)];
//             confetti.style.position = "absolute";
//             confetti.style.color = colors[Math.floor(Math.random() * colors.length)].main;
//             confetti.style.fontSize = "25px";
//             confetti.style.pointerEvents = "none";
//             confetti.classList.add('noornabi_shapes')

//             document.body.appendChild(confetti);

//             const rect = letter.getBoundingClientRect();
//             confetti.style.left = `${rect.left + rect.width / 2}px`;
//             confetti.style.top = `${rect.top + rect.height / 2 + window.scrollY}px`;

//             const xDirection = (Math.random() - 0.5) * 200;
//             const yDirection = (Math.random() - 0.5) * 200;

//             gsap.to(confetti, {
//                 x: xDirection,
//                 y: yDirection,
//                 opacity: 0,
//                 scale: 0.5,
//                 duration: 1,
//                 ease: "power2.out",
//                 onComplete: () => confetti.remove(),
//             });
//         }
//     };

//     const handleInputChange = () => {
//         if (isAnimating) return;

//         if (!content) {
//             lettersRef.current.forEach(letter => {
//                 gsap.to(letter.onScreen, {
//                     scale: 0,
//                     opacity: 0,
//                     duration: 0.2,
//                     ease: "power2.in",
//                     onComplete: () => {
//                         textRef.current.removeChild(letter.onScreen);
//                         offscreenTextRef.current.removeChild(letter.offScreen);
//                     }
//                 });
//             });
//             lettersRef.current = [];
//             return;
//         }

//         const newLetters = content.split('');
//         const currentLetters = lettersRef.current;

//         while (currentLetters.length > newLetters.length) {
//             const letter = currentLetters.pop();
//             gsap.to(letter.onScreen, {
//                 scale: 0,
//                 opacity: 0,
//                 duration: 0.2,
//                 ease: "power2.in",
//                 onComplete: () => {
//                     textRef.current.removeChild(letter.onScreen);
//                     offscreenTextRef.current.removeChild(letter.offScreen);
//                 }
//             });
//         }

//         newLetters.forEach((char, i) => {
//             if (isAnimating) return;

//             const formattedChar = char === " " ? "\u00A0" : char;

//             if (!currentLetters[i] || currentLetters[i].char !== formattedChar) {
//                 const letter = document.createElement('span');
//                 const oLetter = document.createElement('span');
//                 letter.textContent = formattedChar;
//                 oLetter.textContent = formattedChar;

//                 const colorValue = randomColor ? colors[i % colors.length] : color;
//                 letter.style.color = colorValue.main;

//                 textRef.current.appendChild(letter);
//                 offscreenTextRef.current.appendChild(oLetter);

//                 if (currentLetters[i]) {
//                     currentLetters[i].onScreen.textContent = formattedChar;
//                     currentLetters[i].offScreen.textContent = formattedChar;
//                     currentLetters[i].char = formattedChar;
//                 } else {
//                     currentLetters[i] = { onScreen: letter, offScreen: oLetter, char: formattedChar };
//                     animateLetterIn(letter);
//                 }
//             }
//         });
//     };

//     return (
//         <div className="content">
//             {prefixText && (<span className="prefix-text">{prefixText}</span>)}
//             <p ref={offscreenTextRef} className="offscreen-text" />
//             <p ref={textRef} className="textAnimate" />
//             {suffixText && (<span className="suffix-text">{suffixText}</span>)}
//         </div>
//     );
// };

// export default TypeNine;

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const colors = [
    { main: "#FBDB4A", shades: ["#FAE073", "#FCE790", "#FADD65", "#E4C650"] },
    { main: "#F3934A", shades: ["#F7B989", "#F9CDAA", "#DD8644", "#F39C59"] },
    { main: "#EB547D", shades: ["#EE7293", "#F191AB", "#D64D72", "#C04567"] },
    { main: "#9F6AA7", shades: ["#B084B6", "#C19FC7", "#916198", "#82588A"] },
    { main: "#5476B3", shades: ["#6382B9", "#829BC7", "#4D6CA3", "#3E5782"] },
    { main: "#2BB19B", shades: ["#4DBFAD", "#73CDBF", "#27A18D", "#1F8171"] },
    { main: "#70B984", shades: ["#7FBE90", "#98CBA6", "#68A87A", "#5E976E"] }
];

const shapes = ["■", "▲", "▼", "◆", "◢", "◣", "◤", "◥", "★"];

const TypeNine = ({ attributes }) => {
    const {
        content,
        gsapAnimation,
        color,
        repeat = true,
        prefixText = "",
        suffixText = ""
    } = attributes;

    const { typingSpeed = 80, randomColor } = gsapAnimation;

    const textRef = useRef(null);
    const offscreenTextRef = useRef(null);
    const lettersRef = useRef([]);

    const [sentenceIndex, setSentenceIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [cycle, setCycle] = useState(0);

    // 🔹 split sentences
    const sentences = content
        .split("|")
        .map(t => t.trim())
        .filter(Boolean);

    const activeSentence =
        sentences[sentenceIndex] || sentences[0] || "";

    // 🔹 trigger animation on sentence change
    useEffect(() => {
        if (activeSentence && !isAnimating) {
            animateFullText(activeSentence);
        }
    }, [sentenceIndex, cycle, activeSentence]);

    // 🔹 MAIN animation function (UNCHANGED)
    const animateFullText = (text) => {
        if (!text || isAnimating) return;

        setIsAnimating(true);
        lettersRef.current = [];
        textRef.current.innerHTML = "";
        offscreenTextRef.current.innerHTML = "";

        text.split("").forEach((char, i) => {
            setTimeout(() => {
                const formattedChar = char === " " ? "\u00A0" : char;

                const letter = document.createElement("span");
                const oLetter = document.createElement("span");

                letter.textContent = formattedChar;
                oLetter.textContent = formattedChar;

                const colorValue = randomColor
                    ? colors[i % colors.length]
                    : color;

                letter.style.color = colorValue.main;

                textRef.current.appendChild(letter);
                offscreenTextRef.current.appendChild(oLetter);

                lettersRef.current.push({ onScreen: letter, offScreen: oLetter });

                animateLetterIn(letter);
                // ✅ sentence finished
                if (i === text.length - 1) {
                    setTimeout(() => {
                        setIsAnimating(false);

                        // 🔁 FIXED SENTENCE FLOW
                        if (sentences.length > 1) {
                            if (sentenceIndex < sentences.length - 1) {
                                setSentenceIndex(prev => prev + 1);
                            } else if (repeat) {
                                setSentenceIndex(0);
                                setCycle(prev => prev + 1); // 🔥 force re-run
                            }
                        } else if (repeat) {
                            // setSentenceIndex(prev => prev);
                            setCycle(prev => prev + 1);
                        }

                    }, typingSpeed * 2);
                }
            }, i * typingSpeed);
        });
    };

    const animateLetterIn = (letter) => {
        const yOffset = (0.5 + Math.random() * 0.5) * 50;

        gsap.fromTo(letter,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: "back.out" }
        );

        gsap.to(letter, {
            y: -yOffset,
            duration: 0.2,
            ease: "power3.inOut",
            yoyo: true,
            repeat: 1
        });

        gsap.to(letter, {
            rotation: -50 + Math.random() * 100,
            duration: 0.2,
            ease: "power3.inOut",
            yoyo: true,
            repeat: 1
        });

        generateConfetti(letter);
    };

    const generateConfetti = (letter) => {
        for (let i = 0; i < 10; i++) {
            const confetti = document.createElement("span");
            confetti.textContent = shapes[Math.floor(Math.random() * shapes.length)];
            confetti.style.position = "absolute";
            confetti.style.color = colors[Math.floor(Math.random() * colors.length)].main;
            confetti.style.fontSize = "25px";
            confetti.style.pointerEvents = "none";

            document.body.appendChild(confetti);

            const rect = letter.getBoundingClientRect();
            confetti.style.left = `${rect.left + rect.width / 2}px`;
            confetti.style.top = `${rect.top + rect.height / 2 + window.scrollY}px`;

            gsap.to(confetti, {
                x: (Math.random() - 0.5) * 200,
                y: (Math.random() - 0.5) * 200,
                opacity: 0,
                scale: 0.5,
                duration: 1,
                ease: "power2.out",
                onComplete: () => confetti.remove(),
            });
        }
    };

    return (
        <div className="content">
            {prefixText && <span className="prefix-text">{prefixText}</span>}

            <p ref={offscreenTextRef} className="offscreen-text" />
            <p ref={textRef} className="textAnimate" />

            {suffixText && <span className="suffix-text">{suffixText}</span>}
        </div>
    );
};

export default TypeNine;

