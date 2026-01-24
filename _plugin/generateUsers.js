import fs from "node:fs";
import path from "node:path";
import users from "./userdata.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function generateUsers (eleventyConfig) {
    users.forEach(user => {
        const filePath = path.join(__dirname, "..", "src", "users", `${user.id}.md`);
        fs.openSync(filePath, "w");
        fs.writeFileSync(filePath, `---\nid: ${user.id}\n---\n`, { flag: 'a+' });
    })
    // try {
    //     eleventyConfig.versionCheck(pkg["11ty"].compatibility);
    // } catch(e) {
    //     console.log( `WARN: Eleventy Plugin (${pkg.name}) Compatibility: ${e.message}` );
    // }

    // eleventyConfig.addFilter("eleventyNavigation", EleventyNavigation.findNavigationEntries);
    // eleventyConfig.addFilter("eleventyNavigationBreadcrumb", EleventyNavigation.findBreadcrumbEntries);
    // eleventyConfig.addFilter("eleventyNavigationToHtml", function(pages, options) {
    //     return EleventyNavigation.toHtml.call(eleventyConfig, pages, options);
    // });
    // eleventyConfig.addFilter("eleventyNavigationToMarkdown", function(pages, options) {
    //     return EleventyNavigation.toMarkdown.call(eleventyConfig, pages, options);
    // });
};