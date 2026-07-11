import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'

// Minimal dependency-free PNG generator for placeholder PWA icons.
// Draws a rounded indigo square with a light check mark. Replace anytime.

const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()

function crc32(buf) {
  let c = 0xffffffff
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii')
  const body = Buffer.concat([typeBuf, data])
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

function png(size, draw) {
  const raw = Buffer.alloc(size * (size * 4 + 1))
  for (let y = 0; y < size; y++) {
    const rowStart = y * (size * 4 + 1)
    raw[rowStart] = 0 // filter: none
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = draw(x, y)
      const o = rowStart + 1 + x * 4
      raw[o] = r
      raw[o + 1] = g
      raw[o + 2] = b
      raw[o + 3] = a
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// Indigo bg (#4f46e5) with a white check. `maskable` fills the whole canvas
// (safe zone), otherwise rounded corners.
function makeDraw(size, maskable) {
  const radius = maskable ? 0 : size * 0.22
  return (x, y) => {
    // rounded-corner alpha
    let inside = true
    if (radius > 0) {
      const cx = Math.min(x, size - 1 - x)
      const cy = Math.min(y, size - 1 - y)
      if (cx < radius && cy < radius) {
        const dx = radius - cx
        const dy = radius - cy
        inside = dx * dx + dy * dy <= radius * radius
      }
    }
    if (!inside) return [0, 0, 0, 0]

    // check mark: two strokes
    const nx = x / size
    const ny = y / size
    const t = size * 0.06 // stroke half-thickness in px
    // stroke 1: from (0.30,0.52) to (0.45,0.68)
    // stroke 2: from (0.45,0.68) to (0.72,0.34)
    const onSeg = (ax, ay, bx, by) => {
      const px = nx - ax
      const py = ny - ay
      const vx = bx - ax
      const vy = by - ay
      const len2 = vx * vx + vy * vy
      let tt = (px * vx + py * vy) / len2
      tt = Math.max(0, Math.min(1, tt))
      const dx = (px - vx * tt) * size
      const dy = (py - vy * tt) * size
      return dx * dx + dy * dy <= t * t
    }
    if (onSeg(0.3, 0.52, 0.45, 0.68) || onSeg(0.45, 0.68, 0.72, 0.34)) {
      return [255, 255, 255, 255]
    }
    return [79, 70, 229, 255] // indigo-600
  }
}

mkdirSync('public', { recursive: true })

const targets = [
  ['public/pwa-192x192.png', 192, false],
  ['public/pwa-512x512.png', 512, false],
  ['public/maskable-icon-512x512.png', 512, true],
  ['public/apple-touch-icon-180x180.png', 180, false],
]

for (const [file, size, maskable] of targets) {
  writeFileSync(file, png(size, makeDraw(size, maskable)))
  console.log('wrote', file)
}

// SVG favicon (crisp at any size)
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="22" fill="#4f46e5"/>
  <path d="M30 52 L45 68 L72 34" fill="none" stroke="#fff" stroke-width="10"
    stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`
writeFileSync('public/favicon.svg', favicon)
console.log('wrote public/favicon.svg')
