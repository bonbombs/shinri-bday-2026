---
user: beegfeesh                  # username id (see src/users for the list of user ids)
thread: its-my-birthday               # should match id from thread.md
date: "1996-02-22T22:00:22.1Z"  # timestamp
category: General Discussion            # category post should belong in (should be the name as in thread.md)
permalink: "/category/{{ category | slugify }}/{{ thread }}/thread/index.html#{{ page.fileSlug | slugify }}" # do not change this. copy & paste as-is
---

happy solar circuit, big man!