---
layout: full
title: Philosophy and History
---

Ok, so I made up the word 'Philistory'.

Why I started
-------------

UI toolkits or frameworks such as Bootstrap or Foundation have a lot to offer, but I always find myself getting frustrated with them at some point or another, especially when trying to design a bespoke website design for a client. I first turned to using a framework to _avoid_ the frustration of having to solve the same problems again and again, but I feel I just exchanged one set of frustrations with another. Bootstrap and Foundation - out of necessity (or possibly sanity) only claim to support the modern band of browsers. This just doesn't cut it for me - leaving older browsers with what could potentially be an unusable page just doesn't sit right.

Repetitive strain
-----------------

The frustrations with repetitive problem solving include things like SVG, menus and navigation bars. These elements of a web page are so common as to be ubiquitous and yet each time I'd throw one together it would break in some browser or other. Turning to framework seemed like a great idea, but ultimately it didn't solve the problem. Something would always break, or I was forced to use extraneous markup and CSS to produce 'near' success. So I've thrown in the towel for using frameworks for websites.

One step at a time
------------------

I wanted to solve each of the problems I was having by identifying patterns, reducing them to their absolute minimum, and making sure that any enhancements wouldn't cause breakage elsewhere. That's PE. I wanted to use modern CSS methodologies and create small discrete modules of markup and CSS that would just work everywhere - and by everywhere don't just mean across browsers and devices, I mean that they would work wherever you put them on the page itself. By making them context-agnostic, they'd be **much more reusable** and far **less error prone**.

So I started with the HTML. The minimum semantic markup needed to represent the pattern or content sufficiently without any CSS at all - just the browser defaults. This sort of thing tends to be good for Accessibility and SEO which are part of the whole picture and something I wanted to get right from the start.

Then I focused on adding as little CSS as possible to make the pattern _function_ as it should. I tend not to like relying on JavaScript (JS) for function design behaviour - if it doesn't load or JS is turned off, things still need to work. Menus still need to open, content still needs to be accessible. So I decided to try and remove JS from the picture completely - at least to start with. I figured I could add some of that later on to improve things if necessary. Again, very PE.

I started adding CSS, but it wasn't long before I came across problems in older browsers. And I'm not even talking about CSS stuff, this was some really, really basic CSS. Things like [`inline-block`](http://caniuse.com/#feat=inline-block)[not being supported properly](https://blog.mozilla.org/webdev/2009/02/20/cross-browser-inline-block/). I realise that some of those older browsers are long dead, but for me the challenge was to create something that was fool-proof, that just worked whatever ancient browser was being used. For me, that's what the Web is _supposed_ to be like.

On encountering these inconsistencies and problems, I started using a variety of [browser hacks](http://browserhacks.com/) to add or remove styles for these problematic browsers, but it soon became very very messy, unmanageable and yes, frustrating. I concluded that the landscape of ancient browsers far too full of pitfalls and broken things for even very simple layout-based CSS to be reliably applied. No, I was going to have to find a different approach.

Cutting the mustard
-------------------

What I wanted to do was only give these old browsers _just_ the HTML. No CSS at all. At least that way it would only look unstlyed, not broken. “Just. Not. Broken.” became a bit of mantra for me from that point on - the fundamental guiding principle when nothing else could be acheived - at least things wouldn't be broken. After a lot of thinking, reading, researching and agonizing, I decided that the only way I was going to be able to reliably was to use JS to feature detect the browsers capabilities and only load the CSS if the browser wasn't going to have problem with it. I wasn't the only one to think like this. There was already a phrase out there: [Cutting the Mustard](http://responsivenews.co.uk/post/18948466399/cutting-the-mustard). “Brilliant!” I thought - that'll do nicely. I can detect unsupported browsers and give them little or no CSS and then I'd be free and safe to design my modules the way I wanted.

But what if JS wasn't available or didn't load? It's not as rare an occurrence as some people think (see Craig Buckler's post on [“The JavaScript-Dependency Backlash”](http://www.sitepoint.com/javascript-dependency-backlash-myth-busting-progressive-enhancement/) - heading 'MYTH: No One Disables JavaScript' and the quote from [Jake Archibald](https://t.co/uTM3255RuW): “All your users are non-JS while they're downloading your JS” taken from [Everyone has JavaScript, right?](http://kryogenix.org/code/browser/everyonehasjs.html)).

The more I thought about it, the more I felt it was unfair to penalize modern browsers that would be perfectly capable of displaying a fully-styled and functional web page but can't just because they chose to disable JS or it just didn't load for some reason. 

After all, I was trying to eliminate the need for JS in the name of PE and this just puts me back to square one! So I continued looking and I stumbled on an [old post by Craig Buckler](http://www.sitepoint.com/support-old-browsers-responsive-web-design/). It uses Media Queries (MQs) on the `<link>` tag itself in order to prevent the styles from being applied if the MQ isn't matched. Excellent! That sounded just like what I wanted and no JS. 

After a fair bit of experimentation and adaptation, I came up with a pair of MQs that I've dubbed the CSS-Only Mustard Cut:

~~~ html
<link rel="stylesheet" href="css/your-stylesheet.css" media="only screen and (min-resolution: 0.1dpcm)">
<link rel="stylesheet" href="css/your-stylesheet.css" media="only screen and (-webkit-min-device-pixel-ratio:0) and (min-color-index:0)">
~~~

This only allows the modern band of browsers to apply the CSS, leaving old ones with the just HTML. Perfect. I'll no longer have to find hacks and workarounds to avoid breaking things on old browsers! It can be a little bit more involved than that, though, so I've written up a full article that's published on [SitePoint](http://www.sitepoint.com) ([Cutting the Mustard with CSS Media Queries.](http://www.sitepoint.com/cutting-the-mustard-with-css-media-queries/)).

Browser support for the CSS-Only Mustard Cut is as follows:

*   IE 9+
*   FF 8+
*   Opera 12+
*   Chrome 29+
*   Safari 6.1+
*   iOS 7+
*   Android 4.4+


That's it for now
-----------------

I'm sure I'll add-to and revise this little 'Philistory' over time, but I think that's it for now.