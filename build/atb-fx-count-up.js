"use strict";
(globalThis["webpackChunkanimated_text_block"] = globalThis["webpackChunkanimated_text_block"] || []).push([["atb-fx-count-up"],{

/***/ "./src/Components/Common/Themes/effects/CountUp.js":
/*!*********************************************************!*\
  !*** ./src/Components/Common/Themes/effects/CountUp.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var gsap__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! gsap */ "./node_modules/gsap/index.js");
/* harmony import */ var _utils_options__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../utils/options */ "./src/utils/options.js");
/* harmony import */ var _utils_playback__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../utils/playback */ "./src/utils/playback.js");
/* harmony import */ var _shared__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./shared */ "./src/Components/Common/Themes/effects/shared.js");






const CountUp = ({
  fx
}) => {
  const ref = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const tw = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const play = (0,_shared__WEBPACK_IMPORTED_MODULE_3__.usePlay)(ref, fx);
  const scrub = (0,_shared__WEBPACK_IMPORTED_MODULE_3__.useScrub)(tw);
  const {
    paused
  } = (0,_utils_playback__WEBPACK_IMPORTED_MODULE_2__.usePlayback)();
  const held = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  const start = (0,_shared__WEBPACK_IMPORTED_MODULE_3__.num)(fx.countStart, 0),
    end = (0,_shared__WEBPACK_IMPORTED_MODULE_3__.num)(fx.countEnd, 100);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    const el = ref.current;
    if (!el || (0,_shared__WEBPACK_IMPORTED_MODULE_3__.prefersReducedMotion)(el)) return;
    const box = {
      v: start
    };
    el.textContent = (0,_shared__WEBPACK_IMPORTED_MODULE_3__.formatNumber)(start, fx);
    tw.current = gsap__WEBPACK_IMPORTED_MODULE_4__.gsap.to(box, {
      v: end,
      duration: Math.max(0.1, (0,_shared__WEBPACK_IMPORTED_MODULE_3__.num)(fx.countDuration, 2)),
      ease: _utils_options__WEBPACK_IMPORTED_MODULE_1__.modernFxEases[fx.ease] || 'power3.out',
      paused: true,
      repeat: fx.loop && null === scrub.current ? -1 : 0,
      repeatDelay: (0,_shared__WEBPACK_IMPORTED_MODULE_3__.num)(fx.loopDelay, 2),
      onUpdate: () => {
        el.textContent = (0,_shared__WEBPACK_IMPORTED_MODULE_3__.formatNumber)(box.v, fx);
      },
      onRepeat: () => {
        box.v = start;
      }
    });
    if (null !== scrub.current) tw.current.progress(scrub.current);
    return () => {
      tw.current?.kill();
      el.textContent = (0,_shared__WEBPACK_IMPORTED_MODULE_3__.formatNumber)(end, fx);
    };
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!play || !tw.current || null !== scrub.current) return;
    tw.current.delay((0,_shared__WEBPACK_IMPORTED_MODULE_3__.num)(fx.delay, 0)).restart(true);
  }, [play]);

  // Auto-pause (Smart Triggers): the wrapper can't see a tween on a plain object, so hold it here
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const t = tw.current;
    if (!t || null !== scrub.current) return;
    if (paused && !t.paused() && 1 > t.totalProgress()) {
      held.current = true;
      t.pause();
    } else if (!paused && held.current) {
      held.current = false;
      t.resume();
    }
  }, [paused]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    ref: ref,
    className: "content atbFxNumber",
    "aria-label": (0,_shared__WEBPACK_IMPORTED_MODULE_3__.formatNumber)(end, fx)
  }, (0,_shared__WEBPACK_IMPORTED_MODULE_3__.formatNumber)(end, fx));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CountUp);

/***/ })

}]);
//# sourceMappingURL=atb-fx-count-up.js.map