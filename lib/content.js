import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const contentDirectory = path.join(process.cwd(), "content");

export function getPageSlugs() {
  return fs
    .readdirSync(contentDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export async function getPageContent(slug) {
  const filePath = path.join(contentDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);
  const processedContent = await remark().use(html).process(content);

  return {
    slug,
    frontmatter: data,
    markdown: content,
    contentHtml: processedContent.toString(),
  };
}
