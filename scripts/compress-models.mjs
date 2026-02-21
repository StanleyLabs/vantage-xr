#!/usr/bin/env node
/**
 * Compress GLB models with DRACO + WebP (Vision Pro only).
 * Each model is output to its own folder with its textures—fully self-contained.
 *
 * Run: npm run compress:models
 *
 * Expects original uncompressed models in public/models/ (flat).
 * Output: public/models/<model>/<model>.glb + textures in same folder.
 *
 * Restore original models from backup first if textures are broken.
 */

import { execSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const modelsDir = path.join(projectRoot, "public", "models");

/** Replace dest with src; avoids EPERM on Windows/OneDrive */
function replaceFile(src, dest) {
  const tmpFile = path.join(os.tmpdir(), `gltf-${Date.now()}-${path.basename(dest)}`);
  fs.copyFileSync(src, tmpFile);
  try {
    fs.copyFileSync(tmpFile, dest);
  } finally {
    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
  }
  fs.unlinkSync(src);
}

/** Get GLB files in root only (flat structure) */
function getRootGlbFiles() {
  if (!fs.existsSync(modelsDir)) return [];
  return fs
    .readdirSync(modelsDir, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith(".glb"))
    .map((e) => path.join(modelsDir, e.name));
}

/** Process one model: output to model/model.glb so it gets its own textures */
function processModel(inputPath, outputDir, useWebP) {
  const basename = path.basename(inputPath, ".glb");
  const outputPath = path.join(outputDir, `${basename}.glb`);
  const tmpPath = path.join(outputDir, `${basename}.glb.tmp`);

  fs.mkdirSync(outputDir, { recursive: true });

  // 1. DRACO — output to model folder; gltf-transform writes textures there
  execSync(
    `npx gltf-transform draco "${inputPath}" "${tmpPath}" --method edgebreaker`,
    { stdio: "inherit", cwd: projectRoot }
  );
  replaceFile(tmpPath, outputPath);

  // 2. WebP (Vision Pro only)
  if (useWebP) {
    execSync(
      `npx gltf-transform webp "${outputPath}" "${tmpPath}" --quality 85`,
      { stdio: "inherit", cwd: projectRoot }
    );
    replaceFile(tmpPath, outputPath);
    // Remove original jpg/png in this folder only (Vision Pro's textures)
    const dirFiles = fs.readdirSync(outputDir);
    const webpBase = new Set(
      dirFiles.filter((f) => f.endsWith(".webp")).map((f) => path.basename(f, ".webp").toLowerCase())
    );
    for (const f of dirFiles) {
      const ext = path.extname(f).toLowerCase();
      if ((ext === ".jpg" || ext === ".jpeg" || ext === ".png") && webpBase.has(path.basename(f, ext).toLowerCase())) {
        fs.unlinkSync(path.join(outputDir, f));
      }
    }
  }

  return outputPath;
}

// ── Main ──
const rootGlbs = getRootGlbFiles();
if (rootGlbs.length === 0) {
  console.error(
    `No .glb files in ${modelsDir}\n` +
      "Place original uncompressed models there, then run again.\n" +
      "Restore from backup if textures are broken."
  );
  process.exit(1);
}

console.log("Compressing models (each to its own folder)...\n");

for (const inputPath of rootGlbs) {
  const basename = path.basename(inputPath, ".glb");
  const outputDir = path.join(modelsDir, basename);
  const useWebP = basename.includes("vision-pro");

  try {
    processModel(inputPath, outputDir, useWebP);
    const outPath = path.join(outputDir, `${basename}.glb`);
    const stats = fs.statSync(outPath);
    console.log(`  ✓ ${basename}/ (${(stats.size / 1024).toFixed(1)} KB GLB)${useWebP ? " + WebP" : ""}\n`);
  } catch (err) {
    console.error(`  ✗ Failed: ${basename}`, err.message);
    process.exit(1);
  }
}

// Remove root-level files (now duplicated in subfolders)
const toRemove = fs.readdirSync(modelsDir, { withFileTypes: true });
for (const e of toRemove) {
  if (e.isFile()) {
    const p = path.join(modelsDir, e.name);
    if (e.name !== "README.md") {
      fs.unlinkSync(p);
      console.log(`  🗑 Removed root ${e.name}`);
    }
  }
}

console.log("\nDone. Each model is in its own folder with its textures.");
