"use strict";
(globalThis["webpackChunkanimated_text_block"] = globalThis["webpackChunkanimated_text_block"] || []).push([["atb-fx-shiny"],{

/***/ "./src/Components/Common/Themes/effects/Shiny.js":
/*!*******************************************************!*\
  !*** ./src/Components/Common/Themes/effects/Shiny.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var gsap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! gsap */ "./node_modules/gsap/index.js");
/* harmony import */ var _shared__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shared */ "./src/Components/Common/Themes/effects/shared.js");





// Text filled with a gradient that has a bright band; the band sweeps across by moving the background
const Shiny = ({
  attributes,
  fx
}) => {
  const ref = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const tw = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const play = (0,_shared__WEBPACK_IMPORTED_MODULE_1__.usePlay)(ref, fx);
  const base = fx.baseColor || attributes.color || '#1e1e1e';
  const shine = fx.shineColor || '#ffffff';
  const w = Math.min(60, Math.max(4, (0,_shared__WEBPACK_IMPORTED_MODULE_1__.num)(fx.shineWidth, 20)));
  const style = {
    backgroundImage: `linear-gradient(${(0,_shared__WEBPACK_IMPORTED_MODULE_1__.num)(fx.shineAngle, 110)}deg, ${base} 0%, ${base} ${50 - w / 2}%, ${shine} 50%, ${base} ${50 + w / 2}%, ${base} 100%)`,
    backgroundSize: '300% 100%',
    backgroundPosition: '100% 0'
  };
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    const el = ref.current;
    if (!el || (0,_shared__WEBPACK_IMPORTED_MODULE_1__.prefersReducedMotion)(el)) return;
    tw.current = gsap__WEBPACK_IMPORTED_MODULE_2__.gsap.fromTo(el.querySelectorAll('.atbFxPara'), {
      backgroundPosition: '100% 0'
    }, {
      backgroundPosition: '0% 0',
      duration: Math.max(0.3, (0,_shared__WEBPACK_IMPORTED_MODULE_1__.num)(fx.duration, 0.9) * 2),
      ease: 'none',
      repeat: -1,
      repeatDelay: (0,_shared__WEBPACK_IMPORTED_MODULE_1__.num)(fx.sweepPause, 1.5),
      paused: true
    });
    return () => tw.current?.kill();
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!play || !tw.current) return;
    tw.current.delay((0,_shared__WEBPACK_IMPORTED_MODULE_1__.num)(fx.delay, 0)).restart(true);
  }, [play]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ref: ref,
    className: "content"
  }, (0,_shared__WEBPACK_IMPORTED_MODULE_1__.paragraphsOf)(attributes.content).map((p, i) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    key: i,
    className: "atbFxPara atbFxShiny",
    style: style
  }, p)));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Shiny);

/***/ })

}]);
//# sourceMappingURL=atb-fx-shiny.js.map