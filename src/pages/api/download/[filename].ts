import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const ASSETS_DIR = path.join(process.cwd(), "src", "assets"); // << correct folder

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const filenameParam = req.query.filename;
  const filename = Array.isArray(filenameParam) ? filenameParam[0] : filenameParam;

  if (!filename || !filename.toLowerCase().endsWith(".pdf")) {
    return res.status(400).send("Invalid filename");
  }

  // Build and sanitize path
  const filePath = path.join(ASSETS_DIR, filename);
  const resolved = path.normalize(filePath);
  if (!resolved.startsWith(ASSETS_DIR)) {
    return res.status(400).send("Bad path");
  }

  if (!fs.existsSync(resolved)) {
    return res.status(404).send("Not found");
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${path.basename(filename)}"`);

  fs.createReadStream(resolved).pipe(res);
}
