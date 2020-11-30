/*!
    Fall-Back Nav-Bar v2.0.0
    https://github.com/Fall-Back/Nav-Bar
    Copyright (c) 2017, Andy Kirk
    Released under the MIT license https://git.io/vwTVl
*/
(function() {
    
    var nav_bar_js_classname = 'js-nav-bar'; 
    var nav_bar_classname    = 'd-nav-bar'; 

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

	var navbar = {

        init: function() {
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
                
                var navbars = document.querySelectorAll('.' + nav_bar_js_classname + ' .' + nav_bar_classname);
                console.log(navbars);
                
                var switcher = function(item, wide_enough) {
                    //console.log(item);
                    if (wide_enough) {
                        console.log('Wrapped');
                        item.target.style.outline = '3px solid red';
                    } else {
                        console.log('Not Wrapped');
                        item.target.style.outline = '3px solid blue';
                    }
                }
                
                var callback = function(mutationsList, observer) {
                    // Use traditional 'for loops' for IE 11
                    for(const mutation of mutationsList) {
                        if (mutation.type === 'childList') {
                            console.log('A child node has been added or removed.');
                        }
                        else if (mutation.type === 'attributes') {
                            console.log('The ' + mutation.attributeName + ' attribute was modified.');
                        }
                    }
                };
                
                var observer = new MutationObserver(callback);
                Array.prototype.forEach.call(navbars, function(navbar, i) {
                    observer.observe(navbar, {attributes: true});
                });
                
                
                
                /*
                Array.prototype.forEach.call(navbars, function(navbar, i) {
                    navbar.style.outline = '1px solid red';
                    
                    navbar.addEventListener("scroll", function(){
                        navbar.style.outline = '1px solid blue';
                    });
                });
                */
                
                /*
                var ro = new ResizeObserver(entries => {
                    for (let entry of entries) {
                        const cr = entry.contentRect;
                        var item_height = entry.target.querySelector('li').offsetHeight;
                        switcher(entry, cr.height > item_height);
                    }
                });

                Array.prototype.forEach.call(navbars, function(navbar, i) {
                    ro.observe(navbar);
                });
                */

                // Observe one or multiple elements
                /*navbars.forEach(navbar => {
                    ro.observe(navbar);
                });*/
                
                
                /*Array.prototype.forEach.call(navbars, function(navbar, i) {
                    
                });
                
                // ... and button actions:*/
                // CSS all good, add button actions:
                /*var buttons = document.querySelectorAll('[data-js="nav-bar__button"]');
                Array.prototype.forEach.call(buttons, function(button, i) {
                    var button_id = button.getAttribute('id');

                    button.setAttribute('aria-expanded', 'false');

                    // Main button:
                    button.addEventListener('click', function() {
                        // Switch the `aria-expanded` attribute:
                        var expanded = this.getAttribute('aria-expanded') === 'true' || false;

                        // Close any open submenu:
                        var expanded_buttons = document.querySelectorAll('[data-js="nav-bar__button"][aria-expanded="true"]');
                        Array.prototype.forEach.call(expanded_buttons, function(expanded_button, i) {
                            expanded_button.setAttribute('aria-expanded', 'false');
                        });

                        // Set the attribute:
                        this.setAttribute('aria-expanded', !expanded);

                        // Set the focus to the first link if submenu newly opened:
                        if (!expanded) {
                            var first_link = document.querySelector('#' + button_id + '--target [data-js="nav-bar__focus-start"]');
                            if (first_link) {
                                first_link.focus();
                            }
                        }
                    });

                });*/
            }
        }
	}

    // This is _here_ to mitigate a Flash of Basic Styled Navbar:
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

	ready(navbar.init);
})();
