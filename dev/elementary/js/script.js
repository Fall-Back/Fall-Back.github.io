/*------------------------------------------------------------------------------------------------*\
    Fall-Back Cookie Notice Pattern v1.0
    ------------------------------------

    To avoid any confusion, it's probably best to copy these settings to another file that you're
    concatenating and then make any changes to the defaults.
\*------------------------------------------------------------------------------------------------*/

// Settings used in HTML.
// MAY BE Removed: I'm considering moving the HTML into the main template markup via a
// `<script type="template">` tag. If I do, these won't be necessary.
var cookie_notice_id              = 'cookie_notice';
var cookie_button_id              = 'accept_cookies';

// Settings used to generate cookie.
// If I remove the HTML settings, I'd be tempted to remove these too, perhaps as attributes to the
// script tag. Then I won't need this file at all, and I've never liked having to configure JS in
// this way. I've always preferred doing it via markup.
// Not sure of the best way to handle this though:

// Example 1 (attribute-based):
// `<script type="template" cookie_notice cookie_notice_name="cookie_notice" cookie_expire_days="60" cookie_notice_effect_duration="1000">`

// Example 2 (JSON):
// `<script type="template" cookie_notice="{name:'cookie_notice', expire_days:60, effect_duration:1000}">`

// Example 3: (function-esque)
// `<script type="template" cookie_notice="cookie_notice, 60, 1000">`

var cookie_name                   = 'cookie_notice';
var cookie_expire_days            = 60;
var cookie_notice_effect_duration = 1000;

var cookie_html                   =
'<div id="' + cookie_notice_id + '">' + "\n" +
'<p>This site uses <a href="http://www.allaboutcookies.org/" rel="external noopener noreferrer" target="_blank">cookies</a> to improve user experience. By using this site you agree to our use of cookies.</p>' + "\n" +
'<button id="' + cookie_button_id + '">Dismiss</button>' + "\n" +
'</div>';

/*!
    Fall-Back Cookie Notice v1.1.0
    https://github.com/Fall-Back/Cookie-Notice
    Copyright (c) 2017, Andy Kirk
    Released under the MIT license https://git.io/vwTVl
*/
(function() {
    var ready = function(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }
    
    var createCookie = function(name,value,days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
    }

    var readCookie = function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    var eraseCookie = function(name) {
        createCookie(name,"",-1);
    }
    
    var cookienotice = {

        init: function() {
            var accepted_cookies = readCookie(cookie_name);
            if (!accepted_cookies) {
                var body_el = document.getElementsByTagName('body')[0];
                body_el.insertAdjacentHTML('afterbegin', cookie_html);
                
                document.getElementById(cookie_button_id).onclick = function(){
                    createCookie(cookie_name, 'true', cookie_expire_days);
                    document.getElementById(cookie_notice_id).setAttribute('data-close', true);
                    //document.getElementById(cookie_notice_id).className += '  ' + cookie_close_class;
                    /*
                        Without CSS (or transition support - IE9) the notice won't disappear, so wait until fade 
                        has finished then remove:
                    */
                    setTimeout(function(){
                        var c = document.getElementById(cookie_notice_id);
                        c.parentNode.removeChild(c);
                    }, cookie_notice_effect_duration);
                };
            }
        }
    }
    
    ready(cookienotice.init);
})();
