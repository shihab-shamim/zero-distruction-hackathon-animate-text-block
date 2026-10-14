import { createRoot } from 'react-dom/client';
import './style.scss';
import Style from './Components/Common/Style';
import { prefix } from './utils/data';
import ThemeSwitch from './Components/Frontend/Themes/ThemeSwitch';
import ProNotice from './utils/ProNotice/ProNotice';

document.addEventListener('DOMContentLoaded', () => {
	const animatedTextEls = document.querySelectorAll('.wp-block-atb-animated-text');
	animatedTextEls.forEach(animatedTextEl => {
		const attributes = JSON.parse(animatedTextEl.dataset.attributes);
		const isPremium = animatedTextEl.dataset.ispremium || false;

		const props = { attributes, id: animatedTextEl.id }
		const { options } = attributes;
		const { theme } = options;

		const proThemes=['type1','type5','type6', 'type7', 'type8', 'type9', 'type10']
		const premiumTheme = !isPremium && proThemes.includes(theme);


		createRoot(animatedTextEl).render(<>
			<Style {...props} />
				{premiumTheme ? <ProNotice/>:<div className={`${prefix} ${theme}`}>
				{ <ThemeSwitch {...props}/>}
			</div>}
		</>);

		animatedTextEl?.removeAttribute('data-attributes');
			animatedTextEl?.removeAttribute('data-ispremium');
	});
});
