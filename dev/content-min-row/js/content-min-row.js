/*!
    Fall-Back Content Min-row v1.0.1
    https://github.com/Fall-Back/Patterns/tree/master/Content%20Min%20Row
    Copyright (c) 2021, Andy Kirk
    Released under the MIT license https://git.io/vwTVl
*/

// Remove polyfill:
(function() {
  function remove() { this.parentNode && this.parentNode.removeChild(this); }
  if (!Element.prototype.remove) Element.prototype.remove = remove;
  if (Text && !Text.prototype.remove) Text.prototype.remove = remove;
})();

(function() {

    var debug                                = true;
    //var debug                                = false;
    var ident                                = 'cmr';
    var selector                             = '[data-js="' + ident + '"]';
    var js_classname_prefix                  = 'js';
    var container_js_classname_wide_suffix   = 'wide';
    var container_js_classname_narrow_suffix = 'narrow';

    var ready = function(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }
    
    var set_style = function(element, style) {
        Object.keys(style).forEach(function(key) {
            element.style[key] = style[key];
        });
    }

    var $cmr = {

        cmrs: null,

        root_font_size: window.getComputedStyle(document.documentElement).getPropertyValue('font-size'),

        switcher: function(cmr) {

            // Check for browser font change and reset breakpoints if it has:
            if ($cmr.root_font_size != window.getComputedStyle(document.documentElement).getPropertyValue('font-size')) {
                $cmr.set_breakpoints($cmr.cmrs);
            }

            // Note using getAttribute('data-') instead of dataset so it doesn't fail on older
            // browsers and leave behind the clone.
            // May rethink this as I don't NEED to support older browsers witht this - I just don't
            // want it broken. Maybe I should quit out of this if dataset isn't supported, but it's
            // ok for now.
            var wide = cmr.offsetWidth > cmr.getAttribute('data-js-breakpoint');
            // Need to make these classnames dynamic
            if (wide) {
                cmr.classList.add(js_classname_prefix + '-' + ident + '--' + container_js_classname_wide_suffix);
                cmr.classList.remove(js_classname_prefix + '-' + ident + '--' + container_js_classname_narrow_suffix);

                if (debug) {
                    cmr.style.outline = '3px solid red';
                }
            } else {
                cmr.classList.add(js_classname_prefix + '-' + ident + '--' + container_js_classname_narrow_suffix);
                cmr.classList.remove(js_classname_prefix + '-' + ident + '--' + container_js_classname_wide_suffix);

                if (debug) {
                    cmr.style.outline = '3px solid blue';
                }
            }
        },

        set_breakpoints: function(cmrs) {

            Array.prototype.forEach.call(cmrs, function (cmr, i) {
                var clone = cmr.cloneNode(true);
                clone.classList.add(js_classname_prefix + '-' + ident + '--' + container_js_classname_wide_suffix);

                set_style(clone, {
                    border: '0',
                    left: '0',
                    top: '0',
                    width: '1000%',
                    flexWrap: 'nowrap',
                    justifyContent: 'flex-start'
                });
                cmr.parentNode.appendChild(clone);
                var gap    = parseInt(getComputedStyle(cmr).gap);
                var pLeft  = parseInt(getComputedStyle(cmr).paddingLeft);
                var pRight = parseInt(getComputedStyle(cmr).paddingRight);
                console.log(gap, pLeft, pRight);
                var children   = clone.children;
                var n_children = children.length;
                var breakpoint = 0;
                if (pLeft) {
                    breakpoint += pLeft;
                }
                if (pRight) {
                    breakpoint += pRight;
                }
                if (gap && n_children > 1) {
                    breakpoint += (n_children - 1) * gap;
                }
                Array.prototype.forEach.call(children, function (child, i) {
                    // If this child is intended to be flexible, we need to add it's min-width,
                    // rather than actual width:
                    if (child.getAttribute('data-min-width')) {
                        breakpoint += Math.round(child.getAttribute('data-min-width'));
                    } else {
                        breakpoint += Math.ceil(child.offsetWidth);
                    }
                });

                cmr.setAttribute('data-js-breakpoint', breakpoint);

                clone.remove();
            });
        },

        init: function() {

            if (debug) {
                console.log('Initialising ' + ident);
            }

            var self = this;

            // Get all the CMR's:
            $cmr.cmrs = document.querySelectorAll(selector);

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
                if (debug) {
                    console.log('No ResizeObserver support.');
                }

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

                // Note visibility: hidden prevents the resize event from occurring in FF.

                Array.prototype.forEach.call($cmr.cmrs, function (cmr, i) {
                    var detector = document.createElement('iframe');
                    set_style(detector, style);
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

    window.setTimeout(function(){ready($cmr.init)}, 50);
})();
