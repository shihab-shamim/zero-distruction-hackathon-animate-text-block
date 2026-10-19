"use strict";
(globalThis["webpackChunkanimated_text_block"] = globalThis["webpackChunkanimated_text_block"] || []).push([["atb-fx-scramble"],{

/***/ "./src/Components/Common/Themes/effects/Scramble.js":
/*!**********************************************************!*\
  !*** ./src/Components/Common/Themes/effects/Scramble.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var gsap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! gsap */ "./node_modules/gsap/index.js");
/* harmony import */ var gsap_ScrambleTextPlugin__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! gsap/ScrambleTextPlugin */ "./node_modules/gsap/ScrambleTextPlugin.js");
/* harmony import */ var _utils_options__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../utils/options */ "./src/utils/options.js");
/* harmony import */ var _shared__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shared */ "./src/Components/Common/Themes/effects/shared.js");






gsap__WEBPACK_IMPORTED_MODULE_3__.gsap.registerPlugin(gsap_ScrambleTextPlugin__WEBPACK_IMPORTED_MODULE_4__.ScrambleTextPlugin);
const POOLS = {
  upperCase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowerCase: 'abcdefghijklmnopqrstuvwxyz',
  upperAndLowerCase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
};
const Scramble = ({
  attributes,
  fx
}) => {
  const ref = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const tl = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const play = (0,_shared__WEBPACK_IMPORTED_MODULE_2__.usePlay)(ref, fx);
  const scrub = (0,_shared__WEBPACK_IMPORTED_MODULE_2__.useScrub)(tl);
  const paras = (0,_shared__WEBPACK_IMPORTED_MODULE_2__.paragraphsOf)(attributes.content);
  const chars = 'custom' === fx.charset ? fx.customChars || '01' : _utils_options__WEBPACK_IMPORTED_MODULE_1__.modernFxCharsets[fx.charset] || 'upperCase';
  const pool = POOLS[chars] || chars;
  const noise = text => [...text].map(c => ' ' === c ? ' ' : pool[Math.floor(Math.random() * pool.length)]).join('');
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    const el = ref.current;
    if (!el || (0,_shared__WEBPACK_IMPORTED_MODULE_2__.prefersReducedMotion)(el)) return;
    const nodes = [...el.querySelectorAll('.atbFxPara')];
    // Start from scrambled noise of the same length so the layout does not jump
    nodes.forEach((n, i) => {
      n.textContent = noise(paras[i]);
    });
    const t = gsap__WEBPACK_IMPORTED_MODULE_3__.gsap.timeline({
      paused: true,
      repeat: fx.loop && null === scrub.current ? -1 : 0,
      repeatDelay: (0,_shared__WEBPACK_IMPORTED_MODULE_2__.num)(fx.loopDelay, 2)
    });
    nodes.forEach((n, i) => {
      t.to(n, {
        duration: (0,_shared__WEBPACK_IMPORTED_MODULE_2__.num)(fx.duration, 0.9) * 1.6,
        ease: 'none',
        scrambleText: {
          text: paras[i],
          chars,
          revealDelay: (0,_shared__WEBPACK_IMPORTED_MODULE_2__.num)(fx.revealDelay, 0.3),
          speed: (0,_shared__WEBPACK_IMPORTED_MODULE_2__.num)(fx.speed, 0.6)
        }
      }, i * 0.15);
    });
    if (null !== scrub.current) t.progress(scrub.current);
    tl.current = t;
    return () => {
      t.kill();
      nodes.forEach((n, i) => {
        n.textContent = paras[i];
      });
    };
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!play || !tl.current || null !== scrub.current) return;
    tl.current.delay((0,_shared__WEBPACK_IMPORTED_MODULE_2__.num)(fx.delay, 0)).restart(true);
  }, [play]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ref: ref,
    className: "content",
    "aria-label": paras.join(' ')
  }, paras.map((p, i) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    key: i,
    className: "atbFxPara",
    "aria-hidden": "true"
  }, p)));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Scramble);

/***/ })

}]);
//# sourceMappingURL=atb-fx-scramble.js.map