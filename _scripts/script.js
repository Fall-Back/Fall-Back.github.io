/*------------------------------------------------------------------------------------------------*\
    Fall-Back Cookie Notice Pattern v0.1
    ------------------------------------
    
    To avoid any confusion, it's probably best to copy these settings to another file that you're
    concatenating and then make any changes to the defaults.
\*------------------------------------------------------------------------------------------------*/

var cookie_name                   = 'recipies_accept_cookies';
var cookie_expire_days            = 60;
var cookie_notice_id              = 'cookie_notice';
var cookie_button_id              = 'accept_cookies';
var cookie_notice_class           = 'cookie_notice';
var cookie_button_class           = '';
var cookie_close_class            = 'cookie_notice--close';
var cookie_notice_effect_duration = 1000;
var cookie_html                   = 
'<div id="' + cookie_notice_id + '" class="' + cookie_notice_class + '">' + "\n" +
'<p class="cookie_notice__message">This site uses <a href="http://www.allaboutcookies.org/" rel="external" target="_blank">cookies</a> to improve user experience. By using this site you agree to our use of cookies.</p>' + "\n" +
'<span class="cookie_notice__action"><button id="' + cookie_button_id + '" class="' + cookie_button_class + '">Dismiss</button></span>' + "\n" +
'</div>';

/*------------------------------------------------------------------------------------------------*\
    Fall-Back Cookie Notice Pattern v0.1
\*------------------------------------------------------------------------------------------------*/

function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}


var accepted_cookies = readCookie(cookie_name);
if (!accepted_cookies) {
    var body_el = document.getElementsByTagName('body')[0];
    body_el.insertAdjacentHTML('afterbegin', cookie_html);
    
    document.getElementById(cookie_button_id).onclick = function(){
        createCookie(cookie_name, 'true', cookie_expire_days);
        document.getElementById(cookie_notice_id).className += '  ' + cookie_close_class;
        /*
            Without CSS (or transition suport - IE9) the notice won't disappear, so wait until fade 
            has finished then remove:
        */
        setTimeout(function(){
            var c = document.getElementById(cookie_notice_id);
            c.parentNode.removeChild(c);
        }, cookie_notice_effect_duration);
    };
}

/*
    Prevents in-page action link clicks from being added to the browser history.
    If the JS fails to load or doesn't run, the actions still work but history is added to.
    I believe this is an acceptable fallback.
    
    Both plain JS and jQuery versions available
    Un/comment the one you want to use.
    May consider auto-detecting jQuery to decide which one to use.
*/

// Prevent errors in in-supporting browsers (old IE and old FF):
if (document.getElementsByClassName) {
    window.onload = (function(onload) {
        return function(event) {
            onload && onload(event);
            
            // Plain JS version:
            var links = document.getElementsByClassName('js-no-history');
            var l     = links.length;
            for(var i = 0; i < l; i++)
            {
                links.item(i).addEventListener('click', function(e) {
                    e.preventDefault();
                    location.replace(this.href);
                }, false);
            }
            
            // jQuery version:
            /*
            $(".js-no-history").on("click", function(e) {
                e.preventDefault();
                location.replace(e.target.href)
            });
            */
        }
    }(window.onload));
}