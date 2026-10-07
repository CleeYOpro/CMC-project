import fs from "fs";
import path from "path";
import matter from "gray-matter";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const { slug, frontmatter = {}, body = "" } = req.body || {};

  if (!slug) {
    res.status(400).json({ message: "Missing slug" });
    return;
  }

  const contentDirectory = path.join(process.cwd(), "content");
  const filePath = path.join(contentDirectory, `${slug}.md`);

  try {
    const fileContent = matter.stringify(body, frontmatter);
    fs.writeFileSync(filePath, fileContent, "utf-8");
    res.status(200).json({ message: "Content saved" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
