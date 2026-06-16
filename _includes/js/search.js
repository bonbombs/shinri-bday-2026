let archive_results = {};

function runSearch(q) {
    const results_node = document.getElementById("list_results");
    results_node.innerHTML = "";
    if (q.length > 0) {
        let foundCount = 0;
        for (let i = 0; i < archive_results.items.length; i++) {
            const item = archive_results.items[i];
            const title_lower = item.title.toLowerCase();
            const text_lower = item.content_html.toLowerCase();
            if (text_lower.includes(q)) {
                foundCount++;
                const d = Date.parse(item.date_published);
                const date_s = new Date(d).toLocaleTimeString(undefined, {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    timeZone: "utc"
                                                });
                const postString = `<div id="{{ postid or post.fileSlug }}" class="post">
                    <div class="inner">
                        <dl class="profile">
                            <div class="avatar">
                                <img src="/assets/img/user/profile/${item.user}.jpg" alt="${item.userdata.profilealt}"/>
                            </div>
                            <dt><u><a href="/users/${item.user}">${item.userdata.username}</a></u></dt>
                            <dd>posts: ${ item.userdata.postcount }</dd>
                            ${item.userdata.title ? `<dd><b>Title</b>: ${item.userdata.title}</dd>` : ""}
                            ${item.userdata.location ? `<dd><b>Location</b>: ${item.userdata.location}</dd>` : ""}
                            ${item.userdata.hobbies ? `<dd><b>Hobbies</b>: ${item.userdata.hobbies}</dd>` : ""}
                            <dd><b>Joined:</b> ${new Date(Date.parse(item.userdata.joined)).toLocaleDateString(undefined, {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}</dd>
                        </dl>
                        <div class="body">
                            <div class="header">
                            <span><a href="${item.url}">${item.title}</a> by <a href="/users/${item.user}">${item.userdata.username}</a> » ${date_s}</span>
                            </div>
                            <div class="content">
                                ${item.content_html}
                            </div>
                        </div>
                        <div class="clear"></div>
                    </div>
                </div>`;
                const parser = new DOMParser();
                const doc = parser.parseFromString(postString, 'text/html');
                const post = doc.body.firstElementChild;
                replaceTextModern(post.querySelector(".content"), escapeRegExp(q), "<mark>$&</mark>")
                results_node.append(post);
            }
        }
        document.getElementById("results").innerHTML = `${foundCount} results with "${q}"`;
    }
    else {
        document.getElementById("results").innerHTML = `no results with "${q}"`;
    }
}

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function replaceTextModern(element, find, replace) {
    const iterator = document.createNodeIterator(element, NodeFilter.SHOW_TEXT);
    let node;
    while (node = iterator.nextNode()) {
        if (!['SCRIPT', 'STYLE'].includes(node.parentNode.tagName) && node.nodeValue.includes(find)) {
            let replacedText = node.nodeValue.replace(find, replace);
            let fragment = document.createRange().createContextualFragment(replacedText);
            node.replaceWith(fragment);
            node = iterator.nextNode();
        }
    }
}

function submitSearch(q) {
    runSearch(q);

    const url = new URL(window.location.href);
    url.searchParams.set("q", q);
    history.pushState({}, "", url);
}

document.addEventListener("DOMContentLoaded", function() {
    fetch("/feed/archive.json").then(response => response.json()).then(data => {
        archive_results = data;

        const url = window.location.href;
        console.log(url)
        const params = new URLSearchParams(new URL(url).search);
        const q = params.get("q");
        if (q && (q.length > 0)) {
            document.getElementById("input_search").value = q;
            runSearch(q);
        }
    });
});
