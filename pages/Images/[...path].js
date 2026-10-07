import fs from "fs";
import path from "path";
import mime from "mime-types";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  const segments = req.query.path;

  if (!segments || !Array.isArray(segments)) {
    res.status(400).json({ message: "Invalid image path" });
    return;
  }

  const filePath = path.join(process.cwd(), "Images", ...segments);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ message: "Image not found" });
    return;
  }

  const mimeType = mime.lookup(filePath) || "application/octet-stream";
  res.setHeader("Content-Type", mimeType);
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
}
