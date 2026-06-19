import { DateTime } from "luxon";
import _ from "lodash";

export default function(eleventyConfig) {
	eleventyConfig.addFilter("toJSDate", (str, format, zone) => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return new Date(str);
	});

	eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toLocaleString({ month: 'short', day: 'numeric', year: "numeric" });
	});

	eleventyConfig.addFilter("htmlDateString", (dateObj) => {
		// dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
		dateObj.setFullYear(1996);
		return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat('LL-dd-yyyy');
	});

	eleventyConfig.addFilter("htmlDateTime", (dateObj, zone) => {
		// dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
		return DateTime.fromJSDate(dateObj, { zone: zone || "local" }).toLocaleString({ month: 'short', day: 'numeric', year: "numeric", hour: '2-digit', minute: '2-digit' });
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

	eleventyConfig.addFilter("sortByLatest", strings =>
		(strings || []).sort((b, a) => Date.parse(b.date) - Date.parse(a.date))
	);

	eleventyConfig.addFilter("noTitle", (threads) => threads.filter(thread => thread.data.title))

    eleventyConfig.addCollection("recentThreads", function (collectionAPI) {
		const posts = collectionAPI.getFilteredByGlob("./src/**/post-*.md");
		const threads = {};
		posts.sort((b, a) => Date.parse(a.date) - Date.parse(b.date));
		posts.forEach(item => {
			const thread = item.data.thread;
            if (!threads[thread] && item.data.category != "Password Protected") {
                threads[thread] = item;
            }
		})
		console.log(threads)
		return Object.values(threads);
	})

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

		// for (var thread in postsByThread) {
		// 	postsByThread[thread].sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
		// }

        // You can now access this as collections.postsByThread['your-tag-name']
        return postsByThread;
    });
   
	eleventyConfig.addCollection("thread", function (collectionAPI) {
		return collectionAPI.getFilteredByGlob("./src/**/thread.md");
	});
	eleventyConfig.addCollection("posts", function (collectionAPI) {
		return collectionAPI.getFilteredByGlob("./src/**/post-*.md");
	});
	eleventyConfig.addCollection("threadsByCategory", function (collectionAPI) {
		const threads = collectionAPI.getFilteredByGlob("./src/**/thread.md");
        const threadsByCategory = {};

        threads.forEach(item => {
            const category = item.data.category;
            if (category) {
                if (!threadsByCategory[category]) {
                    threadsByCategory[category] = [];
                }
                threadsByCategory[category].push(item);
            }
        });
		// for (var category in threadsByCategory) {
		// 	threadsByCategory[category].sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
		// }
		console.log(threadsByCategory)
        // You can now access this as collections.threadsByCategory['your-tag-name']
        return threadsByCategory;
	});
	
	eleventyConfig.addCollection("postsByCategory", function (collectionAPI) {
		const posts = collectionAPI.getFilteredByGlob("./src/**/post-*.md");
        const postsByCategory = {};

        posts.forEach(item => {
            const category = item.data.category;
            if (category) {
                if (!postsByCategory[category]) {
                    postsByCategory[category] = [];
                }
                postsByCategory[category].push(item);
            }
        });
		console.log(postsByCategory)
        // You can now access this as collections.postsByCategory['your-tag-name']
        return postsByCategory;
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

	eleventyConfig.addFilter("findThread", (threads, id) => {
		return threads.find((t) => t.data.id == id)
	});

	eleventyConfig.addNunjucksFilter("where", (arr, key, expected = null) => {
		if ([null, undefined].includes(expected)) {
			return arr.filter(item => !!_.get(item, key));
		}
		return arr.filter(item => _.get(item, key) === expected);
	});
}