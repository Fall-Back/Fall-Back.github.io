/*------------------------------------------------------------------------------------------------*\
    Fall-Back Close BUtton Pattern v1.0
    ------------------------------------

    To avoid any confusion, it's probably best to copy these settings to another file that you're
    concatenating and then make any changes to the defaults.
\*------------------------------------------------------------------------------------------------*/

// Settings used in HTML.
// MAY BE Removed: I'm considering moving the HTML into the main template markup via a
// `<script type="template">` tag. If I do, these won't be necessary.
var close_button_label           = 'CLose';
var close_button_class           = 'close-button';
var close_button_id              = '';
var close_button_effect_duration = 1000;

if (close_button_class) {
    close_button_class = ' class="' + close_button_class +'"';
}

if (close_button_id) {
    close_button_id = ' class="' + close_button_id +'"';
}

var close_button_html =
'<button' + cookie_button_id + close_button_class + '">' +
'    <span hidden="" aria-hidden="false">Close</span>' +
'    <svg display="none" focusable="false" class="icon  icon--is-open"><use xlink:href="#icon-cross"></use></svg></button>' +
'</button>' + "\n";
