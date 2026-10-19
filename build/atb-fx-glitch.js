"use strict";
(globalThis["webpackChunkanimated_text_block"] = globalThis["webpackChunkanimated_text_block"] || []).push([["atb-fx-glitch"],{

/***/ "./src/Components/Common/Themes/effects/Glitch.js":
/*!********************************************************!*\
  !*** ./src/Components/Common/Themes/effects/Glitch.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var gsap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! gsap */ "./node_modules/gsap/index.js");
/* harmony import */ var gsap_SplitText__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! gsap/SplitText */ "./node_modules/gsap/SplitText.js");
/* harmony import */ var _shared__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shared */ "./src/Components/Common/Themes/effects/shared.js");





gsap__WEBPACK_IMPORTED_MODULE_2__.gsap.registerPlugin(gsap_SplitText__WEBPACK_IMPORTED_MODULE_3__.SplitText);

// Characters flicker in, then short RGB-split bursts repeat every few seconds
const Glitch = ({
  attributes,
  fx
}) => {
  const ref = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const tl = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const play = (0,_shared__WEBPACK_IMPORTED_MODULE_1__.usePlay)(ref, fx);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    const el = ref.current;
    if (!el || (0,_shared__WEBPACK_IMPORTED_MODULE_1__.prefersReducedMotion)(el)) return;
    const split = gsap_SplitText__WEBPACK_IMPORTED_MODULE_3__.SplitText.create(el.querySelectorAll('.atbFxPara'), {
      type: 'words,chars',
      aria: 'auto'
    });
    const chars = split.chars;
    const i = Math.max(1, (0,_shared__WEBPACK_IMPORTED_MODULE_1__.num)(fx.intensity, 6));
    const c1 = fx.glitchColor1 || '#ff2bd6',
      c2 = fx.glitchColor2 || '#00e5ff';
    const r = gsap__WEBPACK_IMPORTED_MODULE_2__.gsap.utils.random;
    const t = gsap__WEBPACK_IMPORTED_MODULE_2__.gsap.timeline({
      paused: true
    });
    t.fromTo(chars, {
      opacity: 0
    }, {
      opacity: 1,
      duration: 0.06,
      stagger: {
        each: (0,_shared__WEBPACK_IMPORTED_MODULE_1__.num)(fx.stagger, 0.03),
        from: 'random'
      },
      ease: 'steps(2)'
    });
    const burst = gsap__WEBPACK_IMPORTED_MODULE_2__.gsap.timeline({
      repeat: -1,
      repeatDelay: Math.max(0.3, (0,_shared__WEBPACK_IMPORTED_MODULE_1__.num)(fx.glitchEvery, 2.5))
    });
    burst.to(el, {
      textShadow: `${i / 2}px 0 ${c1}, ${-i / 2}px 0 ${c2}`,
      duration: 0.04
    }).to(chars, {
      x: () => r(-i, i),
      y: () => r(-i / 3, i / 3),
      skewX: () => r(-i * 2, i * 2),
      duration: 0.05,
      stagger: {
        each: 0.004,
        from: 'random'
      },
      repeat: 3,
      yoyo: true,
      ease: 'none'
    }, '<').to(el, {
      textShadow: `${-i / 2}px 0 ${c1}, ${i / 2}px 0 ${c2}`,
      duration: 0.05
    }, '<0.1').to(chars, {
      x: 0,
      y: 0,
      skewX: 0,
      duration: 0.05
    }).to(el, {
      textShadow: '0px 0 rgba(0,0,0,0), 0px 0 rgba(0,0,0,0)',
      duration: 0.05
    }, '<');
    t.add(burst, '+=0.6');
    tl.current = t;
    return () => {
      t.kill();
      burst.kill();
      gsap__WEBPACK_IMPORTED_MODULE_2__.gsap.set(el, {
        clearProps: 'textShadow'
      });
      split.revert();
    };
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!play || !tl.current) return;
    tl.current.delay((0,_shared__WEBPACK_IMPORTED_MODULE_1__.num)(fx.delay, 0)).restart(true);
  }, [play]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ref: ref,
    className: "content"
  }, (0,_shared__WEBPACK_IMPORTED_MODULE_1__.paragraphsOf)(attributes.content).map((p, i) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    key: i,
    className: "atbFxPara"
  }, p)));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Glitch);

/***/ })

}]);
//# sourceMappingURL=atb-fx-glitch.js.map