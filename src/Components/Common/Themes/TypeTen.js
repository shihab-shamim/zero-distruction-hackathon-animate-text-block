import React from 'react';

const TypeTen = ({ attributes }) => {
    const { content, gsapAnimation, prefixText = "", suffixText = "" } = attributes;
    const { animateType } = gsapAnimation;

    return (
        <div className='typeTen'>
            {prefixText && (<span className='prefix-text'>{prefixText}</span>)}
            {/* wave animation */}
            {
                "wave" === animateType && <div className='content'>
                    {`${content}`.split('').map((letter, i) => (
                        <span
                            key={i}
                            className="animate-wave"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            {letter}
                        </span>
                    ))}
                </div>
            }



            {/* Bounce Animation */}
            {
                "bounce" === animateType && <div className="content animate-bounce-text">
                    {content}
                </div>
            }

            {/* Glitch Effect  */}
            {
                "glitch" === animateType && <div className="content animate-glitch">
                    {content}
                    <span className="animate-glitch-1">{content}</span>
                    <span className="animate-glitch-2">{content}</span>
                </div>
            }

            {suffixText && (<span className='suffix-text'>{suffixText}</span>)}

        </div>
    );
};

export default TypeTen;