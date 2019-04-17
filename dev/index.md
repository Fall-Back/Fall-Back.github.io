---
layout: dev/structure--basic
title: Fall-Back developement contents
---
{% assign root_url = '/dev/' %}
{% for page in site.pages %}
{% assign url_array = page.url | split:root_url %}
{% if url_array[0] == '' %}
* [{{ page.title }}]({{ page.url }})
{% endif %}
{% endfor %}