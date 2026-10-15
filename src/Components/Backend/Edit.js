import { useBlockProps } from '@wordpress/block-editor';
import { useEffect, useState } from 'react';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import { prefix } from '../../utils/data';
import Default from './Themes/Default';
import TypeOne from '../Common/Themes/TypeOne';
import TypeTwo from '../Common/Themes/TypeTwo';
import TypeThree from '../Common/Themes/TypeThree';
import TypeFour from '../Common/Themes/TypeFour';
import TypeFive from '../Common/Themes/TypeFive';
import TypeSix from '../Common/Themes/TypeSix';
import TypeSeven from '../Common/Themes/TypeSeven';
import TypeEight from '../Common/Themes/TypeEight';
import TypeNine from '../Common/Themes/TypeNine';
import TypeTen from '../Common/Themes/TypeTen';
import TypeEleven from '../Common/Themes/TypeEleven';
import TypeTwelve from '../Common/Themes/TypeTwelve';
import TypeThirteen from '../Common/Themes/TypeThirteen';
import usePremiumInEditorV2 from '../../utils/usePremiumEditorV2';


const Edit = props => {
	const { attributes, setAttributes, clientId } = props;
	const { options } = attributes;
	const { theme } = options;
	const id = `${prefix}-${clientId}`;

	const { isPremium } = usePremiumInEditorV2('atbPipeChecker');

	// Editor-only replay + live preview: remount the preview, nothing is saved
	const [replayCount, setReplayCount] = useState(0);
	// Self-preview styles handle their own settings, but still replay when Trigger & Playback changes
	const sig = JSON.stringify(selfPreviewThemes.includes(theme) ? [attributes.playback] : livePreviewKeys.map(k => attributes[k]));
	const [preview, setPreview] = useState({ theme, sig });
	if (preview.theme !== theme) setPreview({ theme, sig }); // a style switch already remounts, don't replay twice
	useEffect(() => {
		if (sig === preview.sig) return;
		const timer = setTimeout(() => setPreview({ theme, sig }), 300);
		return () => clearTimeout(timer);
	}, [sig]);
	// Text Scroll follows the scroll position, so instead of a remount it gets a replay sweep
	const previewKey = 'type12' === theme ? 'scroll' : `${replayCount}-${preview.sig}`;

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} isPremium={isPremium} onReplay={() => setReplayCount(c => c + 1)} />

		<div {...useBlockProps()} id={id}>
			<Style attributes={attributes} id={id} />

			<div className={`${prefix} ${theme}`}>

				<SwitchTheme key={previewKey} {...{ attributes, id }} replay={replayCount} />
			</div>
		</div>
	</>;
};
export default Edit;

// These styles already update their preview on their own when their settings change
const selfPreviewThemes = ['type11', 'type12', 'type13'];
// Settings that restart the preview when changed (loop, effect, speed …)
const livePreviewKeys = ['content', 'loop', 'animateIn', 'inEffect', 'inSequence', 'outEffect', 'outSequence', 'repeat', 'gsapAnimation', 'playback'];




const SwitchTheme = ({ attributes, id, replay }) => {
	const { options } = attributes;
	const { theme } = options;

	switch (theme) {
		case 'default':
			return <Default attributes={attributes} id={id} />;
		case 'type1':
			return <TypeOne attributes={attributes} />;
		case 'type2':
			return <TypeTwo attributes={attributes} />;
		case 'type3':
			return <TypeThree attributes={attributes} />;
		case 'type4':
			return <TypeFour attributes={attributes} />;
		case 'type5':
			return <TypeFive attributes={attributes} />;
		case 'type6':
			return <TypeSix attributes={attributes} />;
		case 'type7':
			return <TypeSeven attributes={attributes} />;
		case 'type8':
			return <TypeEight attributes={attributes} />;
		case 'type9':
			return <TypeNine attributes={attributes} />;
		case 'type10':
			return <TypeTen attributes={attributes} />;
		case 'type11':
			return <TypeEleven attributes={attributes} />;
		case 'type12':
			return <TypeTwelve attributes={attributes} replay={replay} />;
		case 'type13':
			return <TypeThirteen attributes={attributes} />;
		default:
			return null;
	}
};