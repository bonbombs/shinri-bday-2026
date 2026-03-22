---
user: koi-mod
thread: thread-spoiler-test
category: General
permalink: "/thread/{{ thread }}/index.html#{{ page.fileSlug | slugify }}"
---

Hello! Here's a test on how spoilers will work for the site.

{% spoiler %}
Woah! You found the spoiler text

Syntax:
```
{% raw %}
{% spoiler %}
Woah! You found my hidden spoiler
{% endspoiler %}
{% endraw %}
```
{% endspoiler %}

<br/>


{% spoiler "Warning!" %}
This one has a custom title

Syntax:
```
{% raw %}
{% spoiler "Warning!" %}
This one has a custom title
{% endspoiler %}
{% endraw %}
```
{% endspoiler %}