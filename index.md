---
layout: page
<!-- title: Wots ... Uh the Deal -->
---
{% include JB/setup %}

## Wots ... Uh the Deal

I'm a software developer living in Raleigh, North Carolina.

Find me on:

* [linkedin](http://linkedin.com/in/wintersp){:target="_blank"}
* [github](http://github.com/pcwinters){:target="_blank"}

## Recent Posts

<ul class="posts">
  {% for post in site.posts limit:20 %} 
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>
