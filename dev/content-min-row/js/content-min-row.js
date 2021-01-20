/*!
    Fall-Back Content Min-row v1.0.0
    https://github.com/Fall-Back/Nav-Bar
    Copyright (c) 2017, Andy Kirk
    Released under the MIT license https://git.io/vwTVl
*/

// Remove polyfill:
(function() {
  function remove() { this.parentNode && this.parentNode.removeChild(this); }
  if (!Element.prototype.remove) Element.prototype.remove = remove;
  if (Text && !Text.prototype.remove) Text.prototype.remove = remove;
})();

(function() {

    var js_classname_prefix = 'js';
    var container_js_classname_wide_suffix  = 'wide';
    var container_js_classname_narrow_suffix = 'narrow';

    var check_for_css = function(selector) {

        var rules;
        var haveRule = false;
        if (typeof document.styleSheets != "undefined") {// is this supported
            var cssSheets = document.styleSheets;

            // IE doesn't have document.location.origin, so fix that:
            if (!document.location.origin) {
                document.location.origin = document.location.protocol + "//" + document.location.hostname + (document.location.port ? ':' + document.location.port: '');
            }
            var domain_regex  = RegExp('^' + document.location.origin);

            outerloop:
            for (var i = 0; i < cssSheets.length; i++) {
                var sheet = cssSheets[i];

                // Some browsers don't allow checking of rules if not on the same domain (CORS), so
                // checking for that here:
                if (sheet.href !== null && domain_regex.exec(sheet.href) === null) {
                    continue;
                }

                // Check for IE or standards:
                rules = (typeof sheet.cssRules != "undefined") ? sheet.cssRules : sheet.rules;
                for (var j = 0; j < rules.length; j++) {
                    if (rules[j].selectorText == selector) {
                        haveRule = true;
                        break outerloop;
                    }
                }
            }
        }
        return haveRule;

    }

    var ready = function(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

	var $cmr = {

        cmrs: null,

        root_font_size: window.getComputedStyle(document.documentElement).getPropertyValue('font-size'),

		set_style: function(element, style) {
			Object.keys(style).forEach(function(key) {
				element.style[key] = style[key];
			});
		},

		switcher: function(cmr) {

            // Check for browser font chnage and reset breakpoints if it has:
            if ($cmr.root_font_size != window.getComputedStyle(document.documentElement).getPropertyValue('font-size')) {
                $cmr.set_breakpoints($cmr.cmrs);
            }

			var wide = cmr.offsetWidth > cmr.dataset.jsBreakpoint;
			// Need to make these classnames dynamic
			if (wide) {
                cmr.classList.add(js_classname_prefix + '-cmr--' + container_js_classname_wide_suffix);
                cmr.classList.remove(js_classname_prefix + '-cmr--' + container_js_classname_narrow_suffix);

				cmr.style.outline = '3px solid red';
			} else {
                cmr.classList.add(js_classname_prefix + '-cmr--' + container_js_classname_narrow_suffix);
                cmr.classList.remove(js_classname_prefix + '-cmr--' + container_js_classname_wide_suffix);
				cmr.style.outline = '3px solid blue';
			}
		},

        set_breakpoints: function(cmrs) {

            Array.prototype.forEach.call(cmrs, function (cmr, i) {
                var clone = cmr.cloneNode(true);
                clone.classList.add(js_classname_prefix + '-cmr--' + container_js_classname_wide_suffix);

                $cmr.set_style(clone, {
					position: 'absolute',
					border: '0',
					left: '0',
					top: '0',
				});
                cmr.parentNode.appendChild(clone);

                var children   = clone.children;
                var breakpoint = 0;
                Array.prototype.forEach.call(children, function (child, i) {
                    // If this child is intended to be flexible, we need to add it's min-width,
                    // rather than actual width:
                    if (child.dataset.minWidth) {
                        breakpoint += Math.ceil(child.dataset.minWidth);
                    } else {
                        breakpoint += Math.ceil(child.offsetWidth);
                    }
                });

                cmr.dataset.jsBreakpoint = breakpoint;

                clone.remove();
            });
        },

        init: function() {

			var self = this;

            // Get all the CMR's:
            $cmr.cmrs = document.querySelectorAll('[data-js="cmr"]');

            $cmr.set_breakpoints($cmr.cmrs);

            var check = window.ResizeObserver;

            if (check) {
                var ro = new ResizeObserver(function (entries) {
                    Array.prototype.forEach.call(entries, function (entry, i) {
                        $cmr.switcher(entry.target);
                    });
                });

                Array.prototype.forEach.call($cmr.cmrs, function (cmr, i) {
                    ro.observe(cmr);
                    $cmr.switcher(cmr);
                });
            } else {
                console.log('No ResizeObserver support.');

                var style = {
                    position: 'absolute',
                    display: 'block',
                    border: '0',
                    left: '0',
                    top: '0',
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: '-1'
                };

                // Note visibility: hidden prevents the resize event from occuring in FF.

                Array.prototype.forEach.call($cmr.cmrs, function (cmr, i) {
                    var detector = document.createElement('iframe');
                    $cmr.set_style(detector, style);
                    detector.setAttribute('aria-hidden', 'true');

                    cmr.appendChild(detector);

                    detector.contentWindow.addEventListener('resize', function() {
                        $cmr.switcher(cmr);
                    });
                    $cmr.switcher(cmr);
                });
            }
            return;
        }
	}

	ready($cmr.init);
})();
