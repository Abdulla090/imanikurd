#!/usr/bin/env node
/**
 * Sync JSON data from packages/imanikurd/data to Flutter and React Native packages.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SOURCE = path.join(ROOT, "packages/imanikurd/data");
const TARGETS = [
  path.join(ROOT, "packages/imanikurd_flutter/assets/data"),
  path.join(ROOT, "packages/imanikurd-react-native/data"),
];

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (!fs.existsSync(SOURCE)) {
  console.error(`Source data directory not found: ${SOURCE}`);
  process.exit(1);
}

for (const target of TARGETS) {
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }
  copyDir(SOURCE, target);
  const count = fs.readdirSync(target).length;
  console.log(`Synced ${count} data files to ${path.relative(ROOT, target)}`);
}
