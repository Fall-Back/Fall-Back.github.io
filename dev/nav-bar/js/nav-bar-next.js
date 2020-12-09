/*!
    Fall-Back Nav-Bar v2.0.0
    https://github.com/Fall-Back/Nav-Bar
    Copyright (c) 2017, Andy Kirk
    Released under the MIT license https://git.io/vwTVl
*/
(function() {

    var nav_bar_js_classname = 'js-nav-bar';
    var nav_bar_classname    = 'nav-bar';

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

	var $navbar = {
		
		set_style: function(element, style) {
			Object.keys(style).forEach(function(key) {
				element.style[key] = style[key];
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

            if (css_is_loaded) {
                // Add the JS class names ...
                /*if (nav_bar.classList) {
                    nav_bar.classList.add(nav_bar_js_classname);
                } else {
                    nav_bar.className += ' ' + nav_bar_js_classname;
                }*/

                var $navbars = document.querySelectorAll('.' + nav_bar_js_classname + ' .' + nav_bar_classname);
                console.log($navbars);
				
				var style = {
					position: 'absolute',
					border: '0',
					left: '0',
					top: '0',
					
				};
				
				Array.prototype.forEach.call($navbars, function (navbar, i) {
					var clone = navbar.cloneNode(true);
					clone.classList.add('js-nav-bar--expanded');
					$navbar.set_style(clone, style);
					navbar.parentNode.appendChild(clone);
					
					var navbar_main = navbar.querySelector('.nav-bar__main');
					var clone_navbar_main = clone.querySelector('.nav-bar__main');
					var navbar_main_breakpoint = clone.offsetWidth;
					
					navbar_main.dataset.breakpoint = navbar_main_breakpoint;
				});
				
				
				
				return;
                /*var switcher = function($navbar, expanded) {
                    //console.log($navbar);
                    if (expanded) {
						$navbar.classList.add('js-nav-bar--expanded');
						$navbar.classList.remove('js-nav-bar--collapsed');
                        console.log('Wrapped');
                        //item.target.style.outline = '3px solid red';
                    } else {
						$navbar.classList.add('js-nav-bar--collapsed');
						$navbar.classList.remove('js-nav-bar--expanded');
                        console.log('Not Wrapped');
                        //item.target.style.outline = '3px solid blue';
                    }
                }*/

				//var check = window.ResizeObserver;
				//var check = false;
				

                /*if (check) {
                    var ro = new ResizeObserver(function (entries) {
                        Array.prototype.forEach.call(entries, function (entry, i) {
                            var cr = entry.contentRect;
                            var item_height = entry.target.querySelector('li').offsetHeight;
                            switcher(entry.target, cr.height < item_height);
                        });
                    });

                    Array.prototype.forEach.call($navbars, function ($navbar, i) {
                        ro.observe($navbar);
                    });
                } else {
                    console.log('No ResizeObserver support.');
					
					var setStyle = function(element, style) {
                        Object.keys(style).forEach(function(key) {
                            element.style[key] = style[key];
                        });
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
					
					// Note visibility: hidden prevents the resize event from occuring in FF.
					
					Array.prototype.forEach.call($navbars, function ($navbar, i) {
						var detector = document.createElement('iframe');
                        setStyle(detector, style);
						detector.setAttribute('aria-hidden', 'true');
						
						var lastWidth = $navbar.offsetWidth;
						var lastHeight = $navbar.offsetHeight;
						
						$navbar.appendChild(detector);
						
						detector.contentWindow.addEventListener('resize', function() {

							switcher($navbar, $navbar.offsetHeight < lastHeight);
							//console.log('iframe resized');
							/*if ($navbar.offsetHeight < lastHeight) {
								//doAction('height decreased');
								switcher($navbar, true);
							}
							if ($navbar.offsetHeight > lastHeight) {
								//doAction('height increased');
								switcher($navbar, false);
							}*

							lastWidth = $navbar.offsetWidth;
							lastHeight = $navbar.offsetHeight;
                        });
					});
                }*/
			}
        }
	}

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

	ready($navbar.init);
})();
