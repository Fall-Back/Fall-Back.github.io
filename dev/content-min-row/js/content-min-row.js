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
    var container_js_classname_expanded_suffix  = 'expanded';
    var container_js_classname_collapsed_suffix = 'collapsed';
    //var container_classname           = '';
    //var nav_bar_js_classname = 'js-nav-bar';
    //var nav_bar_classname    = 'nav-bar';
    

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
        cmrs_grouped: {},
        
        root_font_size: window.getComputedStyle(document.documentElement).getPropertyValue('font-size'),

		set_style: function(element, style) {
			Object.keys(style).forEach(function(key) {
				element.style[key] = style[key];
			});
		},

		switcher: function(cmr) {
            //console.log(window.getComputedStyle(document.documentElement).getPropertyValue('font-size'));
			console.log(cmr);
            
            // Check for browser font chnage and reset breakpoints if it has:
            if ($cmr.root_font_size != window.getComputedStyle(document.documentElement).getPropertyValue('font-size')) {
                for(cmr_group in $cmr.cmrs_grouped) {
                    $cmr.set_breakpoints(cmr_group);
                }
            }
            
			var expanded = cmr.offsetWidth > cmr.dataset.jsBreakpoint;
            console.log(cmr.offsetWidth, cmr.dataset.jsBreakpoint);
			// Need to make these classnames dynamic
			if (expanded) {
				//cmr.classList.add('js-nav-bar--expanded');
				//cmr.classList.remove('js-nav-bar--collapsed');
                cmr.classList.add(js_classname_prefix + '-' + cmr.dataset.jsComponent + '--' + container_js_classname_expanded_suffix);
                cmr.classList.remove(js_classname_prefix + '-' + cmr.dataset.jsComponent + '--' + container_js_classname_collapsed_suffix);
                
				cmr.style.outline = '3px solid red';
			} else {
				//cmr.classList.add('js-nav-bar--collapsed');
				//cmr.classList.remove('js-nav-bar--expanded');
                cmr.classList.add(js_classname_prefix + '-' + cmr.dataset.jsComponent + '--' + container_js_classname_collapsed_suffix);
                cmr.classList.remove(js_classname_prefix + '-' + cmr.dataset.jsComponent + '--' + container_js_classname_expanded_suffix);
				cmr.style.outline = '3px solid blue';
			}
		},
        
        set_breakpoints: function(cmrs) {
            Array.prototype.forEach.call(cmrs, function (cmr, i) {
                var clone = cmr.cloneNode(true);
                // Need to make this classname dynamic
                //clone.classList.add('js-nav-bar--expanded');
                // Why expanded to start with?
                // tmp              js                                    navbar                             expanded
                clone.classList.add(js_classname_prefix + '-' + clone.dataset.jsComponent + '--' + container_js_classname_expanded_suffix);
                
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

                //var nav_link = clone.querySelector('.nav-bar__link');

                //console.log(window.getComputedStyle(nav_link).getPropertyValue('font-size'));

                /*
                navbar_start_width = 0;
                navbar_main_width = 0;
                navbar_end_width = 0;

                var clone_navbar_start = clone.querySelector('.nav-bar__start');
                if (clone_navbar_start) {
                    var navbar_start_width = Math.ceil(clone_navbar_start.offsetWidth);
                }

                var clone_navbar_main = clone.querySelector('.nav-bar__main');
                if (clone_navbar_main) {
                    var navbar_main_width = Math.ceil(clone_navbar_main.offsetWidth);
                }

                // Note this will need special handling as it's designed to be a flexible
                // container (e.g. for a search input) so will need to discover min-width.
                var clone_navbar_end = clone.querySelector('.nav-bar__end');
                if (clone_navbar_end) {
                    var navbar_end_width = Math.ceil(clone_navbar_end.offsetWidth);
                }

                navbar.dataset.breakpoint = navbar_start_width
                                          + navbar_main_width
                                          + navbar_end_width;
                */
                clone.remove();
            });
        },

        init: function() {
			var self = this;
            
            /*var nav_bar = document.querySelector('.nav-bar');

            // Note that `getComputedStyle` on pseudo elements doesn't work in Opera Mini, but in
            // this case I'm happy to serve only the un-enhanced version to Opera Mini.
            var css_is_loaded = (
                window.getComputedStyle(nav_bar, ':before')
                .getPropertyValue('content')
                .replace(/(\"|\')/g, '')
                == 'CSS Loaded'
            );*/

            //if (css_is_loaded) {
                // Add the JS class names ...
                /*if (nav_bar.classList) {
                    nav_bar.classList.add(nav_bar_js_classname);
                } else {
                    nav_bar.className += ' ' + nav_bar_js_classname;
                }*/

                //$navbar.navbars = document.querySelectorAll('.' + nav_bar_js_classname + ' .' + nav_bar_classname)
                
                // Get all the CMR's that have a component name (nothing would happen without one):
                $cmr.cmrs = document.querySelectorAll('[data-js="cmr"][data-js-component]');
                
                // We then need to group similar CMRs so we can handle each type separately
                // (currently only useful for checking the component CSS has loaded)
                Array.prototype.forEach.call($cmr.cmrs, function (cmr, i) {
                    if (!(cmr.dataset.jsComponent in $cmr.cmrs_grouped)) {
                        console.log('Adding ' + cmr.dataset.jsComponent);
                        $cmr.cmrs_grouped[cmr.dataset.jsComponent] = new Array();
                    }
                    $cmr.cmrs_grouped[cmr.dataset.jsComponent].push(cmr);
                });
                
                //console.log($cmr.cmrs_grouped);
                
                // Perform checks for CSS:
                for(cmr_group in $cmr.cmrs_grouped) {
                    var classname = '.' + js_classname_prefix + '-' + cmr_group;
                    console.log(classname);
                    if (!check_for_css(classname)) {
                        continue;
                    }
                    
                    var cmr_group = $cmr.cmrs_grouped[cmr_group];

                    $cmr.set_breakpoints(cmr_group);

                    //return;

                    var check = window.ResizeObserver;
                    //var check = false;

                    if (check) {
                        var ro = new ResizeObserver(function (entries) {
                            Array.prototype.forEach.call(entries, function (entry, i) {
                                //var cr = entry.contentRect;
                                ////var item_height = entry.target.querySelector('li').offsetHeight;
                                //var item_height = entry.target.offsetHeight;
                                //$cmr.switcher(entry.target, cr.height < item_height);
                                $cmr.switcher(entry.target);
                            });
                        });

                        Array.prototype.forEach.call(cmr_group, function (cmr, i) {
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

                        Array.prototype.forEach.call(cmr_group, function (cmr, i) {
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
                };
				return;
			//}
        }
	}
    
    /*
    There's no CSS for this generic tool, but we'll need to check for the specific CSS later I guess?
    // This is _here_ to mitigate a Flash of Basic Styled $navbar:
    var css_is_loaded = check_for_css('.' + nav_bar_js_classname);

    if (css_is_loaded) {
        // Add the JS class name ...
        var html_el = document.querySelector('html');

        if (html_el.classList) {
            html_el.classList.add(nav_bar_js_classname);
        } else {
            html_el.className += ' ' + nav_bar_js_classname;
        }
    }
    */

	ready($cmr.init);
})();
