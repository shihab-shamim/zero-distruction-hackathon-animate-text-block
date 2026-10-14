import { mobileBreakpoint, tabBreakpoint } from '../../../../bpl-tools/utils/data';
import { getBackgroundCSS, getBorderCSS, getMultiShadowCSS, getSpaceCSS, getTypoCSS, isValidCSS } from '../../../../bpl-tools/utils/getCSS';
import { prefix } from '../../utils/data';

const Style = ({ attributes, id }) => {
	const { options, textAlign, background, typography, color, padding, border, animatedSize = {}, textAlignment = "center", gsapAnimation = {}, alignment = "center", prefixColor = "", prefixTypo = {}, suffixColor = "", suffixTypo = {} } = attributes;


	const { textShadow = [], isTextShadow = false } = gsapAnimation;

	const mainSl = `#${id}`;
	const animatedTextSl = `#${id} .${prefix}`;
	const defaultSl = `${animatedTextSl}.default`;
	const defaultThemeSl = `${defaultSl} .defaultTheme`;
	const defaultPrefixSl = `${defaultSl} .defaultTheme .prefix-text`;
	const defaultSuffixSl = `${defaultSl} .defaultTheme .suffix-text`;
	const typeOneSl = `${animatedTextSl}.type1`;
	const typeTwoSl = `${animatedTextSl}.type2`;
	const typeTwoPrefixSl = `${typeTwoSl} .content .prefix-text`;
	const typeTwoSuffixSl = `${typeTwoSl} .content .suffix-text`;
	const typeThreeSl = `${animatedTextSl}.type3`;
	const typeThreePrefixSl = `${typeThreeSl} .content .prefix-text`;
	const typeThreeSuffixSl = `${typeThreeSl} .content .suffix-text`;
	const typeFourSl = `${animatedTextSl}.type4`;
	const typeFourContentSl =`${typeFourSl} .content`;
	const typeFourPrefixSl = `${typeFourContentSl} .prefix-text`;
	const typeFourSuffixSl = `${typeFourContentSl} .suffix-text`;
	const typeFourTxtSl = `${typeFourSl} .content .wrapper`;
	const typeFiveSl = `${animatedTextSl}.type5`;
	const typeFivePrefixSl = `${typeFiveSl} .content .prefix-text`;
	const typeFiveTxtSl = `${typeFiveSl} .content .wrapper`;
	const typeFiveSuffixSl = `${typeFiveSl} .content .suffix-text`;
	const typeSixSl = `${animatedTextSl}.type6`;
	const typeSixPrefixSl = `${typeSixSl} .content .prefix-text`;
	const typeSixSuffixSl = `${typeSixSl} .content .suffix-text`;
	const typeSevenSl = `${animatedTextSl}.type7`;
	const typeSevenPrefixSl = `${typeSevenSl} .content .prefix-text`;
	const typeSevenSuffixSl = `${typeSevenSl} .content .suffix-text`;
	const typeEightSl = `${animatedTextSl}.type8`;
	const prefixSl = `${typeEightSl} .content .stage .type8-line .atb-prefix`;
	const suffixTextSl = `${typeEightSl} .content .stage .type8-line .atb-suffix`;
	const cursorSl = `${typeEightSl} .content .stage .cursor`;
	const typeNineSl = `${animatedTextSl}.type9`;
	const typeNinePrefixSl = `${typeNineSl} .content .prefix-text`;
	const typeNineSuffixSl = `${typeNineSl} .content .suffix-text`;
	const typeTenSl = `${animatedTextSl}.type10`;
	const typeTenPrefixSl = `${typeTenSl} .typeTen .prefix-text`;
	const typeTenSuffixSl = `${typeTenSl} .typeTen .suffix-text`;


	return <style dangerouslySetInnerHTML={{
		__html: `
		${getTypoCSS('', typography)?.googleFontLink}
		${getTypoCSS(`${animatedTextSl} .content`, typography, options?.theme === 'type7' ? false : true)?.styles}
		${getTypoCSS(`${defaultPrefixSl}`, prefixTypo)?.styles}
		${getTypoCSS(`${defaultSuffixSl}`, suffixTypo)?.styles}
		${getTypoCSS(`${prefixSl}`, prefixTypo)?.styles}
		${getTypoCSS(`${suffixTextSl}`, suffixTypo)?.styles}
		${getTypoCSS(`${typeTwoPrefixSl}`, prefixTypo)?.styles}
		${getTypoCSS(`${typeTwoSuffixSl}`, suffixTypo)?.styles}
		${getTypoCSS(`${typeThreePrefixSl}`, prefixTypo)?.styles}
		${getTypoCSS(`${typeThreeSuffixSl}`, suffixTypo)?.styles}
		${getTypoCSS(`${typeFourPrefixSl}`, prefixTypo)?.styles}
		${getTypoCSS(`${typeFourSuffixSl}`, suffixTypo)?.styles}
		${getTypoCSS(`${typeFivePrefixSl}`, prefixTypo)?.styles}
		${getTypoCSS(`${typeFiveSuffixSl}`, suffixTypo)?.styles}
		${getTypoCSS(`${typeSixPrefixSl}`, prefixTypo)?.styles}
		${getTypoCSS(`${typeSixSuffixSl}`, suffixTypo)?.styles}
		${getTypoCSS(`${typeSevenPrefixSl}`, prefixTypo)?.styles}
		${getTypoCSS(`${typeSevenSuffixSl}`, suffixTypo)?.styles}
		${getTypoCSS(`${typeNinePrefixSl}`, prefixTypo)?.styles}
		${getTypoCSS(`${typeNineSuffixSl}`, suffixTypo)?.styles}
		${getTypoCSS(`${typeTenPrefixSl}`, prefixTypo)?.styles}
		${getTypoCSS(`${typeTenSuffixSl}`, suffixTypo)?.styles}

		${mainSl}{
			display: flex;
			justify-content: ${alignment};
		}
		${defaultThemeSl}{
			justify-content: ${textAlignment}
		}
		${animatedTextSl}{
			text-align: ${textAlign};
			${getBackgroundCSS(background)}
			padding: ${getSpaceCSS(padding)};
			${getBorderCSS(border)}
		}
		${defaultPrefixSl}{
			color: ${prefixColor}
		}
		${defaultSuffixSl}{
			color: ${suffixColor}
		}
		${prefixSl}{
			color: ${prefixColor}
		}
		${suffixTextSl}{
			color: ${suffixColor}
		}
		${animatedTextSl} .content{
			color: ${color};
			text-align: ${textAlignment};
			${isTextShadow ? `text-shadow: ${getMultiShadowCSS(textShadow, 'text')};` : ""}
		}
		${typeTwoSl}{
			justify-content: ${textAlignment}
		}
		${typeTwoPrefixSl}{
			color: ${prefixColor}
		}
		${typeTwoSuffixSl}{
			color: ${suffixColor}
		}
		${typeThreePrefixSl}{
			color: ${prefixColor}
		}
		${typeThreeSuffixSl}{
			color: ${suffixColor}
		}
		${typeFourContentSl}{
			justify-content: ${textAlignment}
		}
		${typeFourPrefixSl}{
			color: ${prefixColor}
		}
		${typeFourSuffixSl}{
			color: ${suffixColor}
		}
		${typeFiveSl}{
			display: flex;
			justify-content: ${textAlignment};
		}
		${typeFourTxtSl} .txt{
			color: ${color};
		}
		${typeFiveTxtSl} .txt{
			color: ${color};
		}
		${typeFivePrefixSl}{
			color: ${prefixColor}
		}
		${typeFiveSuffixSl}{
			color: ${suffixColor}
		}
		${cursorSl}{
			background-color: ${color};
		}
		${typeSixPrefixSl}{
			color: ${prefixColor};
			margin-right: 20px;
		}
		${typeSixSuffixSl}{
			color: ${suffixColor};
			margin-left: 20px;
		}
		${typeSevenPrefixSl}{
			color: ${prefixColor}
		}
		${typeSevenSuffixSl}{
			color: ${suffixColor}
		}
		${typeNinePrefixSl}{
			color: ${prefixColor}
		}
		${typeNineSuffixSl}{
			color: ${suffixColor}
		}
		${typeTenPrefixSl}{
			color: ${prefixColor}
		}
		${typeTenSuffixSl}{
			color: ${suffixColor}
		}
		${typeSixSl},
		${typeSevenSl},
		${typeEightSl},
		${typeNineSl},
		${typeTenSl}{
			justify-content: ${textAlignment};
		}
		${typeSevenSl ? `@font-face {
			font-family: "Anybody";
			src: url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/61488/ETCAnybodyPB.woff2") format("woff2-variations");
			font-display: block;
			font-style: normal italic;
			text-transform: inherit;
			font-weight: 100 900;
			font-stretch: 10% 400%;
		}` : ""}
		
		${defaultSl},
		${typeOneSl},
		${typeTwoSl},
		${typeThreeSl},
		${typeFourSl},
		${typeFiveSl},
		${typeSixSl},
		${typeSevenSl},
		${typeEightSl},
		${typeNineSl},
		${typeTenSl}{
			${isValidCSS('width', animatedSize?.width['desktop'])}
		}

		${typeOneSl}{
			${isValidCSS('height', animatedSize?.height['desktop'])}
		}

		${tabBreakpoint}{
			${typeOneSl},
			${typeTwoSl},
			${typeThreeSl},
			${typeFourSl},
			${typeFiveSl},
			${typeSixSl},
			${typeSevenSl},
			${typeEightSl},
			${typeNineSl},
			${typeTenSl}{
				${isValidCSS('width', animatedSize?.width['tablet'])}
			}
		}

		${tabBreakpoint}{
			${typeOneSl}{
				${isValidCSS('height', animatedSize?.height['tablet'])}
			}
		}

		${mobileBreakpoint}{
			${typeOneSl},
			${typeTwoSl},
			${typeThreeSl},
			${typeFourSl},
			${typeFiveSl},
			${typeSixSl},
			${typeSevenSl},
			${typeEightSl},
			${typeNineSl},
			${typeTenSl}{
				${isValidCSS('height', animatedSize?.width['mobile'])}
			}
		}

		${tabBreakpoint}{
			${typeOneSl}{
				${isValidCSS('height', animatedSize?.height['mobile'])}
			}
		}
		
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;