#!/usr/bin/env node
/**
 * 批量压缩 src/static 下的图片（jpg / png / webp），原地覆盖。
 * 仅当输出体积小于原文件时才写入，避免变大。
 *
 * 用法:
 *   node scripts/compress-images.mjs
 *   node scripts/compress-images.mjs --dir src/static --max 1600 --quality 82
 */

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import sharp from "sharp"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function parseArgs(argv) {
  let dir = path.join(__dirname, "..", "src", "static")
  let maxDimension = 1600
  let jpegQuality = 82
  let webpQuality = 80
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--dir" && argv[i + 1]) {
      dir = path.resolve(argv[++i])
    } else if (argv[i] === "--max" && argv[i + 1]) {
      maxDimension = Number(argv[++i])
    } else if (argv[i] === "--quality" && argv[i + 1]) {
      jpegQuality = Number(argv[++i])
    } else if (argv[i] === "--webp-quality" && argv[i + 1]) {
      webpQuality = Number(argv[++i])
    } else if (argv[i] === "--help" || argv[i] === "-h") {
      console.log(`Usage: node scripts/compress-images.mjs [--dir PATH] [--max N] [--quality N] [--webp-quality N]`)
      process.exit(0)
    }
  }
  return { dir, maxDimension, jpegQuality, webpQuality }
}

const IMAGE_RE = /\.(jpe?g|png|webp)$/i

async function collectImages(rootDir) {
  const out = []
  async function walk(d) {
    let entries
    try {
      entries = await fs.readdir(d, { withFileTypes: true })
    } catch {
      return
    }
    for (const e of entries) {
      const full = path.join(d, e.name)
      if (e.isDirectory()) await walk(full)
      else if (IMAGE_RE.test(e.name)) out.push(full)
    }
  }
  await walk(rootDir)
  return out.sort()
}

async function compressOne(filePath, opts) {
  const before = (await fs.stat(filePath)).size
  const input = await fs.readFile(filePath)
  const meta = await sharp(input).metadata()
  let pipeline = sharp(input).rotate()

  const w = meta.width ?? 0
  const h = meta.height ?? 0
  if (
    w > 0 &&
    h > 0 &&
    (w > opts.maxDimension || h > opts.maxDimension)
  ) {
    pipeline = pipeline.resize(opts.maxDimension, opts.maxDimension, {
      fit: "inside",
      withoutEnlargement: true,
    })
  }

  const ext = path.extname(filePath).toLowerCase()
  let buf
  if (ext === ".png") {
    buf = await pipeline
      .png({ compressionLevel: 9, adaptiveFiltering: true, effort: 10 })
      .toBuffer()
  } else if (ext === ".webp") {
    buf = await pipeline.webp({ quality: opts.webpQuality }).toBuffer()
  } else {
    buf = await pipeline
      .jpeg({ quality: opts.jpegQuality, mozjpeg: true })
      .toBuffer()
  }

  const after = buf.length
  if (after < before) {
    await fs.writeFile(filePath, buf)
    return { before, after, written: true }
  }
  return { before, after, written: false }
}

function formatKb(n) {
  return `${(n / 1024).toFixed(1)}KB`
}

async function main() {
  const opts = parseArgs(process.argv)
  const files = await collectImages(opts.dir)
  if (files.length === 0) {
    console.log(`No images under: ${opts.dir}`)
    process.exit(0)
  }

  console.log(`Directory: ${opts.dir}`)
  console.log(`Files: ${files.length}, max edge: ${opts.maxDimension}px, jpeg q: ${opts.jpegQuality}, webp q: ${opts.webpQuality}\n`)

  let totalBefore = 0
  let totalAfter = 0
  let changed = 0

  for (const f of files) {
    try {
      const r = await compressOne(f, opts)
      totalBefore += r.before
      totalAfter += r.written ? r.after : r.before
      const rel = path.relative(path.join(__dirname, ".."), f)
      if (r.written) {
        changed++
        console.log(
          `✓ ${rel}  ${formatKb(r.before)} → ${formatKb(r.after)} (−${formatKb(r.before - r.after)})`,
        )
      } else {
        console.log(`· ${rel}  skip (${formatKb(r.before)}, output not smaller)`)
      }
    } catch (e) {
      console.error(`✗ ${f}:`, e.message || e)
    }
  }

  console.log(
    `\nDone. Updated ${changed}/${files.length} files. Total ${formatKb(totalBefore)} → ${formatKb(totalAfter)}`,
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
