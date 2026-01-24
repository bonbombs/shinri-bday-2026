import { DateTime } from "luxon";

export default function(eleventyConfig) {
	eleventyConfig.addFilter("toJSDate", (str, format, zone) => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return new Date(str);
	});

	eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "dd LLLL yyyy");
	});

	eleventyConfig.addFilter("htmlDateString", (dateObj) => {
		// dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
		return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat('yyyy-LL-dd');
	});

	eleventyConfig.addFilter("htmlDateTime", (dateObj) => {
		// dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
		return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat('ff');
	});

	// Get the first `n` elements of a collection.
	eleventyConfig.addFilter("head", (array, n) => {
		if(!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if( n < 0 ) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});

	// Return the smallest number argument
	eleventyConfig.addFilter("min", (...numbers) => {
		return Math.min.apply(null, numbers);
	});

	// Return the keys used in an object
	eleventyConfig.addFilter("getKeys", target => {
		return Object.keys(target);
	});

	eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
		return (tags || []).filter(tag => ["all", "threads", "posts"].indexOf(tag) === -1);
	});

	eleventyConfig.addFilter("sortAlphabetically", strings =>
		(strings || []).sort((b, a) => b.localeCompare(a))
	);

	eleventyConfig.addFilter("noTitle", (threads) => threads.filter(thread => thread.data.title))

    eleventyConfig.addCollection("postsByThread", function (collectionAPI) {
        const posts = collectionAPI.getFilteredByGlob("./src/**/post-*.md");
        const postsByThread = {};

        posts.forEach(item => {
            const thread = item.data.thread;
            if (thread) {
                if (!postsByThread[thread]) {
                    postsByThread[thread] = [];
                }
                postsByThread[thread].push(item);
            }
        });

        // You can now access this as collections.postsByThread['your-tag-name']
        return postsByThread;
    });
   
	eleventyConfig.addCollection("posts", function (collectionAPI) {
		return collectionAPI.getFilteredByGlob("./src/**/post-*.md");
	});
	eleventyConfig.addCollection("postsByUser", function (collectionAPI) {
        const posts = collectionAPI.getFilteredByGlob("./src/**/post-*.md");
        const postsByUser = {};

        posts.forEach(item => {
            const user = item.data.user;
            if (user) {
                if (!postsByUser[user]) {
                    postsByUser[user] = [];
                }
                postsByUser[user].push(item);
            }
        });

        // You can now access this as collections.postsByUser['your-tag-name']
        return postsByUser;
    });

	eleventyConfig.addFilter("findUser", (users, id) => {
		return users.find((u) => u.id == id)
	});
}