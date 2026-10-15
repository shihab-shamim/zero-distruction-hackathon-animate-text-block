import { createRoot } from 'react-dom/client';
import './style.scss';
import Style from './Components/Common/Style';
import { prefix } from './utils/data';
import ThemeSwitch from './Components/Frontend/Themes/ThemeSwitch';
import ProNotice from './utils/ProNotice/ProNotice';
import SmartTrigger from './Components/Common/SmartTrigger';
import { needsSmartTrigger, playbackOf } from './utils/playback';

document.addEventListener('DOMContentLoaded', () => {
	const animatedTextEls = document.querySelectorAll('.wp-block-atb-animated-text');
	animatedTextEls.forEach(animatedTextEl => {
		const attributes = JSON.parse(animatedTextEl.dataset.attributes);
		const isPremium = animatedTextEl.dataset.ispremium || false;

		const props = { attributes, id: animatedTextEl.id }
		const { options } = attributes;
		const { theme } = options;

		const proThemes=['type1','type5','type6', 'type7', 'type8', 'type9', 'type10', 'type11', 'type12', 'type13']
		const premiumTheme = !isPremium && proThemes.includes(theme);
		const smartTrigger = isPremium && needsSmartTrigger(playbackOf(attributes), theme, attributes.modernFx?.effect);


		createRoot(animatedTextEl).render(<>
			<Style {...props} />
				{premiumTheme ? <ProNotice/>:<div className={`${prefix} ${theme}`}>
				{smartTrigger ? <SmartTrigger el={animatedTextEl} attributes={attributes}>{() => <ThemeSwitch {...props}/>}</SmartTrigger> : <ThemeSwitch {...props}/>}
			</div>}
		</>);

		animatedTextEl?.removeAttribute('data-attributes');
			animatedTextEl?.removeAttribute('data-ispremium');
	});
});
