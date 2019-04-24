---
layout: dev/structure--basic
title: Fall-Back developement contents
---
{% assign root_url = '/dev/' %}
{% assign pages = site.pages | sort:"title" %}
{% for page in pages %}
{% assign url_array = page.url | split:root_url %}
{% if url_array[0] == '' %}
* [{{ page.title }}]({{ page.url }})
{% endif %}
{% endfor %}