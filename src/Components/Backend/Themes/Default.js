import React from 'react';
import { useEffect } from 'react';
const $ = jQuery;
import { textillateConfig } from '../../../utils/config';

const Default = ({ attributes, id }) => {
    const { loop, animateIn, inEffect, inSequence, outEffect, outSequence, content, prefixText = "", suffixText = "" } = attributes;

    useEffect(() => {
        $(`#${id} .content`).textillate(textillateConfig(attributes));
    }, [loop, animateIn, inEffect, inSequence, outEffect, outSequence, content]);

    return <div className='defaultTheme'>
        {prefixText && (<span className='prefix-text'>{prefixText}</span>)}
        <p className='content'>{content}</p>
        {suffixText && (<span className='suffix-text'>{suffixText}</span>)}
    </div>
};

export default Default;

