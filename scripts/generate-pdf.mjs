import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const browserExe = fs.existsSync(chromePath) ? chromePath : edgePath;

const outputPath = path.resolve("public/presentation.pdf");
const targetUrl = "http://localhost:3000/presentation";

console.log(`Using browser: ${browserExe}`);
console.log(`Generating PDF for ${targetUrl} -> ${outputPath}`);

try {
  execFileSync(browserExe, [
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    `--print-to-pdf=${outputPath}`,
    targetUrl
  ], { timeout: 30000 });

  if (fs.existsSync(outputPath)) {
    const stats = fs.statSync(outputPath);
    console.log(`SUCCESS! Generated ${outputPath} (${(stats.size / 1024).toFixed(1)} KB)`);
  } else {
    console.error("PDF was not created.");
  }
} catch (err) {
  console.error("Error generating PDF:", err.message);
}
