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
/*
    Adds the Opera Mini class name and provides tweaks for some of the odd Opera Mini behaviour.
    I've not managed to disable JS on Opera Mini, so I guess this is safe.
*/
var isOperaMini  = (navigator.userAgent.indexOf('Opera Mini') > -1);
/*var isOperaMini8 = (navigator.userAgent.indexOf('Opera Mini/8') > -1);*/
if (isOperaMini) {
    var root = document.documentElement;
    root.className += " opera-mini";
    
    /*if (isOperaMini8) {
        var root = document.documentElement;
        root.className += "-8";
    }*/
    
    /* Add input size attribute for Opera Mini so that the input can collapse */
    window.onload = (function(onload) {
        return function(event) {
            onload && onload(event);

            var search_fields = document.getElementsByClassName('search-form__field');
            var i = search_fields.length;
            while (i--) {
                search_fields[i].setAttribute("size", "1");
            }
        }
    }(window.onload));
}
/*
    Fix CSS shortcomings in older browsers. Specifically fix the width of the objects container
    to be the same width as the object.
*/

if (!!(
    document.body.style.msTouchSelect !== undefined /* IE10+ */
 || (document.all && document.addEventListener && !window.atob) /* IE9 */
 || Object.prototype.toString.call(window.operamini) === '[object OperaMini]' /* Opera Mini */
)) {

    //console.log('Applying inline-block fix');

    window.onload = (function(onload) {
        return function(event) {

            var objs = document.getElementsByTagName('object');
            var i = 0
              , l = objs.length
              , data
              , obj;

            for (i; i < l; i++) {
                obj = objs[i];
                // Check object is inside of an .svg__link and
                // not inside of an .svg--fluid
                if (obj.parentNode.className.indexOf('svg__link') == -1 || obj.parentNode.parentNode.className.indexOf('svg--fluid') >= 0) {
                    continue;
                }
                obj.style.maxWidth          = 'none';
                obj.style.minWidth          = '0';
                obj.parentNode.style.width  = '100%';
                obj.parentNode.style.width  = obj.offsetWidth + 'px';
                obj.style.maxWidth          = '100%';
            }
        }
    }(window.onload));
}
