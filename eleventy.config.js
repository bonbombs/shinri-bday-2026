import path from "node:path";
import * as sass from "sass";

import { IdAttributePlugin, InputPathToUrlTransformPlugin, HtmlBasePlugin } from "@11ty/eleventy";
import pluginNavigation from "@11ty/eleventy-navigation";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginBundle from "@11ty/eleventy-plugin-bundle";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { generateUsers } from "./_plugin/generateUsers.js";

import pluginFilters from "./_config/filters.js";

export default async function (eleventyConfig) {
	eleventyConfig.ignores.add("_forum/**");
	eleventyConfig.addPairedShortcode("spoiler", function(content, title) {
		return `<details><summary>${title ?? "Spoiler Alert"}</summary>\n<div class="spoiler-content">\n${content}\n</div>\n</details>`;
	});

	eleventyConfig.addPairedShortcode("quote", function(content) {
		return `<blockquote>\n${content}\n</blockquote>`;
	});
    eleventyConfig.addExtension("scss", {
		outputFileExtension: "css",

		// opt-out of Eleventy Layouts
		useLayouts: false,

		compile: async function (inputContent, inputPath) {
			let parsed = path.parse(inputPath);
			// Don’t compile file names that start with an underscore
			if(parsed.name.startsWith("_")) {
				return;
			}

			let result = sass.compileString(inputContent, {
				loadPaths: [
					parsed.dir || ".",
					this.config.dir.includes,
				]
			});

			// Map dependencies for incremental builds
			this.addDependencies(inputPath, result.loadedUrls);

			return async (data) => {
				return result.css;
			};
		},
	});

    eleventyConfig
		.addPassthroughCopy({
			"./public/": "/",
            "./assets/": "/assets/",
            "./hints/": "/hints/"
		})
    
    // Watch CSS files
	eleventyConfig.addWatchTarget("css/**/*.css");
	// Watch images for the image pipeline.
	eleventyConfig.addWatchTarget("src/**/*.{svg,webp,png,jpg,jpeg,gif}");

	// Per-page bundles, see https://github.com/11ty/eleventy-plugin-bundle
	// Bundle <style> content and adds a {% css %} paired shortcode
	// eleventyConfig.addBundle("css", {
	// 	toFileDirectory: "dist",
	// 	// Add all <style> content to `css` bundle (use <style eleventy:ignore> to opt-out)
	// 	// Supported selectors: https://www.npmjs.com/package/posthtml-match-helper
	// 	bundleHtmlContentFromSelector: "style",
	// });

	// Bundle <script> content and adds a {% js %} paired shortcode
	// eleventyConfig.addBundle("js", {
	// 	toFileDirectory: "dist",
	// 	// Add all <script> content to the `js` bundle (use <script eleventy:ignore> to opt-out)
	// 	// Supported selectors: https://www.npmjs.com/package/posthtml-match-helper
	// 	bundleHtmlContentFromSelector: "script",
	// });

    // Plugins
    eleventyConfig.addPlugin(pluginNavigation);
    eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(HtmlBasePlugin);
	// eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
	eleventyConfig.addPlugin(pluginBundle);
    generateUsers();

    eleventyConfig.addPlugin(feedPlugin, {
        type: "atom", // or "rss", "json"
        outputPath: "/feed/feed.xml",
        stylesheet: "pretty-atom-feed.xsl",
        collection: {
            name: "posts",
            limit: 10,
        },
        metadata: {
            language: "en",
            title: "Dead Threads ARG",
            subtitle: "Shinri 2026 Birthday Project",
            base: "https://example.com/",
            author: {
                name: "Elysium Delivery Services"
            }
        }
    });

    // Image optimization: https://www.11ty.dev/docs/plugins/image/#eleventy-transform
	// eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
	// 	// Output formats for each image.
	// 	formats: ["avif", "webp", "auto"],

	// 	// widths: ["auto"],

	// 	failOnError: false,
	// 	htmlOptions: {
	// 		imgAttributes: {
	// 			// e.g. <img loading decoding> assigned on the HTML tag will override these values.
	// 			loading: "lazy",
	// 			decoding: "async",
	// 		}
	// 	},

	// 	sharpOptions: {
	// 		animated: true,
	// 	},
	// });

    eleventyConfig.addPlugin(pluginFilters);

    eleventyConfig.addPlugin(IdAttributePlugin, {
		// by default we use Eleventy’s built-in `slugify` filter:
		// slugify: eleventyConfig.getFilter("slugify"),
		// selector: "h1,h2,h3,h4,h5,h6", // default
	});

    eleventyConfig.addShortcode("currentBuildDate", () => {
		return (new Date()).toISOString();
	});
}

export const config = {
	// Control which files Eleventy will process
	// e.g.: *.md, *.njk, *.html, *.liquid
	templateFormats: [
		"md",
		"njk",
		"html",
		"liquid",
		"11ty.js",
        "scss"
	],

	// Pre-process *.md files with: (default: `liquid`)
	markdownTemplateEngine: "njk",

	// Pre-process *.html files with: (default: `liquid`)
	htmlTemplateEngine: "njk",

	// These are all optional:
	dir: {
		input: "src",          // default: "."
		includes: "../_includes",  // default: "_includes" (`input` relative)
		data: "../_data",          // default: "_data" (`input` relative)
		output: "_site"
	},

	// -----------------------------------------------------------------
	// Optional items:
	// -----------------------------------------------------------------

	// If your site deploys to a subdirectory, change `pathPrefix`.
	// Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

	// When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
	// it will transform any absolute URLs in your HTML to include this
	// folder name and does **not** affect where things go in the output folder.

	// pathPrefix: "/",
};