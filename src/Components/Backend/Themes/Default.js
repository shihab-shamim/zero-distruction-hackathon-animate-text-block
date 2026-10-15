import React from 'react';
import { useEffect, useRef } from 'react';
const $ = jQuery;
import { textillateConfig } from '../../../utils/config';
import { usePlayback } from '../../../utils/playback';

const Default = ({ attributes }) => {
    const { loop, animateIn, inEffect, inSequence, outEffect, outSequence, content, prefixText = "", suffixText = "" } = attributes;
    const contentRef = useRef(null);
    const { paused } = usePlayback();
    const stoppedRef = useRef(false);

    useEffect(() => {
        if (!contentRef.current) return;
        $(contentRef.current).textillate(textillateConfig(attributes));
    }, [loop, animateIn, inEffect, inSequence, outEffect, outSequence, content, attributes.playback?.stagger]);

    // Auto-pause: stop the textillate loop, start it again on resume (only if stop really halted it)
    useEffect(() => {
        const el = contentRef.current;
        const instance = el && $(el).data('textillate');
        if (!instance) return;
        if (paused) {
            stoppedRef.current = !!instance.timeoutRun;
            $(el).textillate('stop');
        } else if (stoppedRef.current) {
            stoppedRef.current = false;
            $(el).textillate('start');
        }
    }, [paused]);

    // Stop the textillate loop only on unmount (e.g. editor replay remount).
    useEffect(() => {
        const el = contentRef.current;
        return () => {
            const instance = el && $(el).data('textillate');
            if (instance) instance.stop();
        };
    }, []);

    return <div className='defaultTheme'>
        {prefixText && (<span className='prefix-text'>{prefixText}</span>)}
        <p className='content' ref={contentRef}>{content}</p>
        {suffixText && (<span className='suffix-text'>{suffixText}</span>)}
    </div>
};

export default Default;
