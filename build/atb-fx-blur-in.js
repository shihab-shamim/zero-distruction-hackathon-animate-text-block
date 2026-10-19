"use strict";
(globalThis["webpackChunkanimated_text_block"] = globalThis["webpackChunkanimated_text_block"] || []).push([["atb-fx-blur-in"],{

/***/ "./src/Components/Common/Themes/effects/BlurIn.js":
/*!********************************************************!*\
  !*** ./src/Components/Common/Themes/effects/BlurIn.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var gsap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! gsap */ "./node_modules/gsap/index.js");
/* harmony import */ var gsap_SplitText__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! gsap/SplitText */ "./node_modules/gsap/SplitText.js");
/* harmony import */ var _utils_options__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../utils/options */ "./src/utils/options.js");
/* harmony import */ var _shared__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shared */ "./src/Components/Common/Themes/effects/shared.js");






gsap__WEBPACK_IMPORTED_MODULE_3__.gsap.registerPlugin(gsap_SplitText__WEBPACK_IMPORTED_MODULE_4__.SplitText);
const BlurIn = ({
  attributes,
  fx
}) => {
  const ref = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const tl = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const played = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  const play = (0,_shared__WEBPACK_IMPORTED_MODULE_2__.usePlay)(ref, fx);
  const scrub = (0,_shared__WEBPACK_IMPORTED_MODULE_2__.useScrub)(tl);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    const el = ref.current;
    if (!el || (0,_shared__WEBPACK_IMPORTED_MODULE_2__.prefersReducedMotion)(el)) return;
    const loop = fx.loop && null === scrub.current;
    const by = ['chars', 'words', 'lines'].includes(fx.splitBy) ? fx.splitBy : 'chars';
    const blur = (0,_shared__WEBPACK_IMPORTED_MODULE_2__.num)(fx.blur, 12),
      y = (0,_shared__WEBPACK_IMPORTED_MODULE_2__.num)(fx.offsetY, 24),
      duration = (0,_shared__WEBPACK_IMPORTED_MODULE_2__.num)(fx.duration, 0.9),
      stagger = (0,_shared__WEBPACK_IMPORTED_MODULE_2__.num)(fx.stagger, 0.03);
    const split = gsap_SplitText__WEBPACK_IMPORTED_MODULE_4__.SplitText.create(el.querySelectorAll('.atbFxPara'), {
      type: 'lines' === by ? 'lines' : 'words' === by ? 'words' : 'words,chars',
      aria: 'auto',
      autoSplit: 'lines' === by,
      onSplit(self) {
        const targets = self[by];
        const t = gsap__WEBPACK_IMPORTED_MODULE_3__.gsap.timeline({
          paused: true,
          repeat: loop ? -1 : 0,
          repeatDelay: 0.4
        });
        t.fromTo(targets, {
          opacity: 0,
          filter: `blur(${blur}px)`,
          y
        }, {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          duration,
          stagger,
          ease: _utils_options__WEBPACK_IMPORTED_MODULE_1__.modernFxEases[fx.ease] || 'power3.out'
        });
        if (loop) t.to(targets, {
          opacity: 0,
          filter: `blur(${blur}px)`,
          y: -y * 0.5,
          duration: duration * 0.7,
          stagger: stagger * 0.5,
          ease: 'power2.in'
        }, `+=${(0,_shared__WEBPACK_IMPORTED_MODULE_2__.num)(fx.loopDelay, 2)}`);
        if (null !== scrub.current) t.progress(scrub.current);else if (played.current) t.progress(loop ? 0 : 1).play();
        tl.current = t;
        return t;
      }
    });
    return () => {
      tl.current?.kill();
      split.revert();
    };
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!play || !tl.current || null !== scrub.current) return;
    played.current = true;
    tl.current.delay((0,_shared__WEBPACK_IMPORTED_MODULE_2__.num)(fx.delay, 0)).restart(true);
  }, [play]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ref: ref,
    className: "content"
  }, (0,_shared__WEBPACK_IMPORTED_MODULE_2__.paragraphsOf)(attributes.content).map((p, i) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    key: i,
    className: "atbFxPara"
  }, p)));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BlurIn);

/***/ })

}]);
//# sourceMappingURL=atb-fx-blur-in.js.map