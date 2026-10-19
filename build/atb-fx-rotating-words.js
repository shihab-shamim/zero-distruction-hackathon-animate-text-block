"use strict";
(globalThis["webpackChunkanimated_text_block"] = globalThis["webpackChunkanimated_text_block"] || []).push([["atb-fx-rotating-words"],{

/***/ "./src/Components/Common/Themes/effects/RotatingWords.js":
/*!***************************************************************!*\
  !*** ./src/Components/Common/Themes/effects/RotatingWords.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var gsap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! gsap */ "./node_modules/gsap/index.js");
/* harmony import */ var _utils_options__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../utils/options */ "./src/utils/options.js");
/* harmony import */ var _shared__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shared */ "./src/Components/Common/Themes/effects/shared.js");






// One slot in the sentence that cycles through several words (clip, 3D flip or a letter wave)
const RotatingWords = ({
  attributes,
  fx
}) => {
  const ref = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const tl = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const play = (0,_shared__WEBPACK_IMPORTED_MODULE_2__.usePlay)(ref, fx);
  const words = (0,_shared__WEBPACK_IMPORTED_MODULE_2__.wordsOf)(attributes.content);
  const mode = ['clip', 'flip', 'wave'].includes(fx.rotateAnimation) ? fx.rotateAnimation : 'clip';
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    const el = ref.current;
    if (!el || 2 > words.length) return;
    const items = [...el.querySelectorAll('.atbFxWord')];
    // Reduced motion: keep the first word only, no cycling
    if ((0,_shared__WEBPACK_IMPORTED_MODULE_2__.prefersReducedMotion)(el)) {
      gsap__WEBPACK_IMPORTED_MODULE_3__.gsap.set(items.slice(1), {
        autoAlpha: 0
      });
      return () => gsap__WEBPACK_IMPORTED_MODULE_3__.gsap.set(items, {
        clearProps: 'all'
      });
    }
    const widths = items.map(w => w.scrollWidth);
    const dur = (0,_shared__WEBPACK_IMPORTED_MODULE_2__.num)(fx.duration, 0.9) * 0.7,
      hold = (0,_shared__WEBPACK_IMPORTED_MODULE_2__.num)(fx.holdTime, 2),
      ease = _utils_options__WEBPACK_IMPORTED_MODULE_1__.modernFxEases[fx.ease] || 'power3.out';

    // fromTo tweens below use immediateRender: false so building the loop does not hide the first word
    gsap__WEBPACK_IMPORTED_MODULE_3__.gsap.set(items.slice(1), {
      autoAlpha: 0
    });
    gsap__WEBPACK_IMPORTED_MODULE_3__.gsap.set(el, {
      width: widths[0]
    });
    const t = gsap__WEBPACK_IMPORTED_MODULE_3__.gsap.timeline({
      paused: true,
      repeat: -1
    });
    items.forEach((cur, i) => {
      const next = items[(i + 1) % items.length];
      const at = `+=${hold}`;
      t.to(el, {
        width: widths[(i + 1) % items.length],
        duration: dur,
        ease
      }, at);
      if ('flip' === mode) {
        t.to(cur, {
          rotationX: 90,
          autoAlpha: 0,
          duration: dur * 0.6,
          ease: 'power2.in'
        }, '<').fromTo(next, {
          rotationX: -90,
          autoAlpha: 0
        }, {
          rotationX: 0,
          autoAlpha: 1,
          duration: dur * 0.8,
          ease,
          immediateRender: false
        }, `<${dur * 0.45}`);
      } else if ('wave' === mode) {
        t.to(cur.children, {
          yPercent: -110,
          opacity: 0,
          duration: dur * 0.6,
          stagger: 0.025,
          ease: 'power2.in'
        }, '<').set(cur, {
          autoAlpha: 0
        }).set(next, {
          autoAlpha: 1
        }).fromTo(next.children, {
          yPercent: 110,
          opacity: 0
        }, {
          yPercent: 0,
          opacity: 1,
          duration: dur * 0.7,
          stagger: 0.03,
          ease,
          immediateRender: false
        }, '<');
      } else {
        t.to(cur, {
          yPercent: -110,
          autoAlpha: 0,
          duration: dur,
          ease
        }, '<').fromTo(next, {
          yPercent: 110,
          autoAlpha: 0
        }, {
          yPercent: 0,
          autoAlpha: 1,
          duration: dur,
          ease,
          immediateRender: false
        }, '<');
      }
    });
    tl.current = t;
    return () => {
      t.kill();
      gsap__WEBPACK_IMPORTED_MODULE_3__.gsap.set([el, ...items, ...items.flatMap(w => [...w.children])], {
        clearProps: 'all'
      });
    };
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!play || !tl.current) return;
    tl.current.delay((0,_shared__WEBPACK_IMPORTED_MODULE_2__.num)(fx.delay, 0)).restart(true);
  }, [play]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    ref: ref,
    className: `content atbFxRotator is-${mode}`,
    "aria-label": words.join(', ')
  }, words.map((w, i) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    key: i,
    className: "atbFxWord",
    "aria-hidden": "true"
  }, [...w].map((c, j) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    key: j,
    className: "atbFxChar"
  }, ' ' === c ? ' ' : c)))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RotatingWords);

/***/ })

}]);
//# sourceMappingURL=atb-fx-rotating-words.js.map