import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "index.html", "product.html", "collection.html", "cart.html", "wishlist.html",
  "account.html", "women.html", "men.html", "new-arrivals.html", "search.html",
  "checkout.html", "about.html", "styles.css", "pages.css", "vercel.json", "js/products.mjs",
  "js/app.mjs", "js/subpages.mjs"
];
const errors = [];
for (const file of required) {
  if (!existsSync(path.join(root, file))) errors.push("Missing required file: " + file);
}
function read(file) {
  try { return readFileSync(path.join(root, file), "utf8"); }
  catch { return ""; }
}
for (const file of required.filter(file => file.endsWith(".html") && existsSync(path.join(root,file)))) {
  const html = read(file);
  const idList = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]);
  const idCounts = new Map();
  for (const id of idList) idCounts.set(id, (idCounts.get(id) || 0) + 1);
  for (const [id, count] of idCounts) {
    if (count > 1) errors.push(file + ": duplicate id attribute #" + id);
  }
  const ids = new Set(idList);
  for (const match of html.matchAll(/<img\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi)) {
    if (!/\balt\s*=/i.test(match[0])) errors.push(file + ": image missing alt attribute");
  }
  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) {
    let target = match[1].trim();
    if (!target || /^(?:https?:|mailto:|tel:|data:|javascript:|\/\/|#)/i.test(target)) {
      if (target.startsWith("#") && !ids.has(target.slice(1))) errors.push(file + ": broken in-page anchor " + target);
      continue;
    }
    target = decodeURIComponent(target.split(/[?#]/)[0]);
    if (!target) continue;
    const normalized = target.replace(/^\/+/, "");
    const actual = normalized === "" ? "index.html" : normalized;
    if (!existsSync(path.join(root, actual))) errors.push(file + ": missing local asset or page " + match[1]);
  }
  if (!/<meta\s+name=["']viewport["']/.test(html)) errors.push(file + ": missing responsive viewport metadata");
}
const productsSource = read("js/products.mjs");
const productRows = [...productsSource.matchAll(/\{id:(\d+),slug:"([^"]+)"[^}]*image:"([^"]+)"/g)];
const ids = productRows.map(match => Number(match[1]));
const slugs = productRows.map(match => match[2]);
if (productRows.length < 20) errors.push("Expected at least 20 local products; found " + productRows.length);
if (new Set(ids).size !== ids.length) errors.push("Product IDs must be unique");
if (new Set(slugs).size !== slugs.length) errors.push("Product slugs must be unique");
for (const match of productRows) {
  const file = match[3].replace(/^\/+/, "");
  if (!existsSync(path.join(root, file))) errors.push("Missing local product image: " + file);
}
const sourceFiles = required.filter(file => /\.(?:html|css|mjs)$/.test(file));
const combinedSource = sourceFiles.map(read).join("\n");
for (const blocked of ["images.unsplash.com","fonts.googleapis.com"]) {
  if (combinedSource.includes(blocked)) errors.push("External asset dependency found: " + blocked);
}
for (const page of ["product.html","collection.html","cart.html","wishlist.html","account.html","women.html","men.html","new-arrivals.html","search.html","checkout.html","about.html"]) {
  if (!read(page).includes('src="/js/subpages.mjs"')) errors.push(page + ": missing subpage behaviour module");
}
if (!read("index.html").includes('src="/js/app.mjs"')) errors.push("index.html: missing storefront behaviour module");
try {
  const config = JSON.parse(read("vercel.json"));
  if (config.framework !== null) errors.push("vercel.json must explicitly disable framework detection");
  if (config.outputDirectory !== ".") errors.push("vercel.json outputDirectory should be repository root for this static site");
} catch {
  errors.push("vercel.json is not valid JSON");
}
if (errors.length) {
  console.error("Static site validation FAILED");
  for (const error of errors) console.error(" - " + error);
  process.exit(1);
}
console.log("Static site validation passed: " + required.filter(file => file.endsWith(".html")).length + " HTML pages, " + productRows.length + " unique products, local assets, links, metadata and Vercel config.");
