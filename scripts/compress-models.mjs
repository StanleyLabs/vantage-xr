#!/usr/bin/env node
/**
 * Compress GLB models in public/models/ with DRACO mesh compression
 * and WebP texture compression.
 * Run: npm run compress:models
 *
 * Looks for .glb files in public/models/ and its subdirectories.
 * Keep all model files (GLB, .bin, textures) in the same folder so
 * texture references resolve correctly.
 * Output overwrites originals. Back up your models first if needed.
 */

import { execSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

/** Replace dest with src; uses temp dir + copy to avoid EPERM on Windows/OneDrive */
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const modelsDir = path.join(projectRoot, "public", "models");

function findGlbFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findGlbFiles(fullPath, files);
    } else if (entry.name.endsWith(".glb")) {
      files.push(fullPath);
    }
  }
  return files;
}

const glbFiles = findGlbFiles(modelsDir);
if (glbFiles.length === 0) {
  console.error(
    `No .glb files found in ${modelsDir} or subdirectories\n` +
      "Add your 3D models (e.g. models/apple-vision-pro/apple-vision-pro.glb) and run again."
  );
  process.exit(1);
}

console.log("Compressing models...\n");

for (const inputPath of glbFiles) {
  const tmpPath = `${inputPath}.tmp`;
  const relativePath = path.relative(modelsDir, inputPath);
  const basename = path.basename(inputPath, ".glb");
  const useWebP = basename.includes("vision-pro"); // Only Vision Pro benefits from WebP

  try {
    // 1. DRACO geometry compression (all models)
    execSync(
      `npx gltf-transform draco "${inputPath}" "${tmpPath}" --method edgebreaker`,
      { stdio: "inherit", cwd: projectRoot }
    );
    replaceFile(tmpPath, inputPath);

    // 2. WebP texture compression (Vision Pro only—others get bigger with WebP)
    if (useWebP) {
      execSync(
        `npx gltf-transform webp "${inputPath}" "${tmpPath}" --quality 85`,
        { stdio: "inherit", cwd: projectRoot }
      );
      replaceFile(tmpPath, inputPath);
    }

    const stats = fs.statSync(inputPath);
    console.log(`  ✓ ${relativePath} (${(stats.size / 1024).toFixed(1)} KB)${useWebP ? " + WebP" : ""}\n`);
  } catch (err) {
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    console.error(`  ✗ Failed: ${relativePath}`, err.message);
    process.exit(1);
  }
}

// 3. Cleanup: remove original jpg/png textures that have been replaced by WebP
function findFiles(dir, ext, files = []) {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findFiles(fullPath, ext, files);
    } else if (entry.name.toLowerCase().endsWith(ext)) {
      files.push(fullPath);
    }
  }
  return files;
}

const webpFiles = findFiles(modelsDir, ".webp");
if (webpFiles.length > 0) {
  const webpBaseNames = new Set(
    webpFiles.map((f) => path.basename(f, ".webp").toLowerCase())
  );
  const toRemove = findFiles(modelsDir, ".jpg")
    .concat(findFiles(modelsDir, ".jpeg"))
    .concat(findFiles(modelsDir, ".png"))
    .filter((f) => webpBaseNames.has(path.basename(f, path.extname(f)).toLowerCase()));

  for (const file of toRemove) {
    fs.unlinkSync(file);
    console.log(`  🗑 Removed ${path.relative(modelsDir, file)}`);
  }
  if (toRemove.length > 0) console.log("");
}

console.log("Done. Vision Pro: DRACO + WebP. Others: DRACO only.");
