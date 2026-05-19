# shinri-bday-2026

This repo houses the Dead Threads site forum!

## Getting Started

Clone this repo locally, and run `npm run start` to get a dev environment running.

## Adding threads & posts

Threads on the site are organized as such:

```
src
    category_a
        thread_a
            thread.md
            post-01.md
            post-02.md
    category_b
        thread_b
            thread.md
            post-01.md
        thread_c
            thread.md
            post-01.md
            post-02.md
            post-03.md
```

To create a new thread: 

1. Create a new folder in one of the category folders (name should be snakecase)
2. Create a `thread.md` file inside new folder with the following contents
```yaml
---
id: thread-name                 # internal name. snakecase. should match whatever you named the folder
title: Thread Display Name      # The name of the thread that is displayed on the site
category: Welcome               # category thread should belong in
date: "1996-02-22T22:00:22.1Z"  # timestamp
---
```
3. Create posts inside new folder as `post-0[x].md` where `[x]` is the order of post
```yaml
---
user: username                  # username id (see src/users for the list of user ids)
thread: thread-id               # should match id from thread.md
date: "1996-02-22T22:00:22.1Z"  # timestamp
category: Forum Fun!            # category post should belong in (should be the name as in thread.md)
permalink: "/category/{{ category | slugify }}/{{ thread }}/thread/index.html#{{ page.fileSlug | slugify }}" # do not change this. copy & paste as-is
---

Post contents go here!

<p>HTML is allowed, if additional formatting & layout is required, of if you need to insert images</p>
<img src="/assets/img/path-to-img.png"/>

{% spoiler %}
example of spoiler text syntax
{% endspoiler %}

```

## To Build/Publish

Run `npm run build`. This will process & compile all the md files and convert them in HTML pages to `_site`.

The contents inside `_site` will be deployed. For this project, it'll be manually deployed to a neocities page.