/*!
    Fall-Back Cookie Notice v1.1.0
    https://github.com/Fall-Back/Cookie-Notice
    Copyright (c) 2017, Andy Kirk
    Released under the MIT license https://git.io/vwTVl
*/
(function() {

    var close_button_container_selector = '[data-js="close-button"]';
    var close_button_class     = 'close-button';
    var close_button_id        = '';
    
    if (close_button_class) {
        close_button_class = ' class="' + close_button_class +'"';
    }

    if (close_button_id) {
        close_button_id = ' class="' + close_button_id +'"';
    }

    
    var close_button_html  =
'<button' + close_button_id + close_button_class + '">' +
'    <span hidden="" aria-hidden="false">Close</span>' +
'    <svg focusable="false" class="icon  icon--is-open"><use xlink:href="#icon-cross"></use></svg></button>' +
'</button>' + "\n";

    var ready = function(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }
    
    var $close_button = {
        
        close_buttons: null,
        close_button_containers: null,

        init: function() {
			var self = this;
            
            $close_button.close_button_containers = document.querySelectorAll(close_button_container_selector);
            
            Array.prototype.forEach.call($close_button.close_button_containers, function (close_button_container, i) {
                close_button_container.innerHTML += close_button_html;
            });
        }
    }
    
    ready($close_button.init);
})();
