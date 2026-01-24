let archive_results = {};

function runSearch(q) {
    const results_node = document.getElementById("list_results");
    results_node.innerHTML = "";
    if (q.length > 0) {
        for (let i = 0; i < archive_results.items.length; i++) {
            const item = archive_results.items[i];
            const title_lower = item.title.toLowerCase();
            const text_lower = item.content_html.toLowerCase();
            if (title_lower.includes(q) || text_lower.includes(q)) {
                let s  ; const p_node = document.createElement("p");
                const link_node = document.createElement("a");
                const user_node = document.createElement("p");
                const thread_node = document.createElement("p");
                const d = Date.parse(item.date_published);
                const date_s = new Date(d).toISOString().substr(0, 10);
                const date_node = document.createTextNode(date_s);
                link_node.appendChild(date_node);
                link_node.href = item.url;
                user_node.innerHTML = item.user;
                thread_node.innerHTML = item.thread;
                let title_node = null;
                if (item.title.length > 0) {
                    title_node = document.createElement("span");
                    title_node.innerHTML = ": <b>" + item.title + "</b>";
                    s = item.title + ": " + item.content_html;
                }
                s = item.content_html;
                if (s.length > 200) {
                    s = s.substr(0, 200) + "...";
                }
                const text_node = document.createElement("span");
                text_node.innerHTML = ": " + s;
                p_node.appendChild(link_node);
                p_node.appendChild(user_node);
                p_node.appendChild(thread_node);
                if (title_node != null) {
                    p_node.appendChild(title_node);
                }
                p_node.appendChild(text_node);
                results_node.appendChild(p_node);
            }
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
        const params = new URLSearchParams(new URL(url).search);
        const q = params.get("q");
        if (q && (q.length > 0)) {
            document.getElementById("input_search").value = q;
            runSearch(q);
        }
    });
});
