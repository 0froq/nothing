<script setup lang="ts">
/**
 * Modular ASCII Field Engine
 * Designed for future extraction into standalone `@nothing/ascii-canvas` library / composable.
 */

// ============================================================================
// 1. Types & Interfaces
// ============================================================================

interface ThemeRgb {
  r: number
  g: number
  b: number
}

interface PointerTrackerConfig {
  radius: number // Base Gaussian radius of the primary glow (compact & bright)
  damp: number // Lerp damping factor (0 < damp <= 1, lower = lazier delay)
  cyanRadiusRatio: number // Ratio of radius where cyan tone concentrates
  maxCyan: number // Max cyan color mix (0..1)
  trailMaxPoints: number // Max history nodes in the comet trail
  trailMinDist: number // Min distance between recorded trail nodes
  trailDecay: number // Alpha decay rate per frame for trail nodes
}

interface TrailNode {
  x: number
  y: number
  life: number // 1.0 down to 0.0
}

interface GridSpark {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  decay: number
  char: string
}

interface SparkGridCell {
  char: string
  alpha: number
  colorMix: number
}

interface Attractor {
  x: number
  y: number
  vx: number
  vy: number
  r: number
}

interface CharBound {
  char: string
  startX: number
  endX: number
  topY: number
  bottomY: number
  index: number
}

interface RasterizedWord {
  text: string
  width: number
  height: number
  data: Uint8ClampedArray
  auraData: Uint8ClampedArray
  charBounds: CharBound[]
  startX: number
  endX: number
}

interface IntroLayout {
  coreRow: number
  startCol: number
  step: number
  centerCol: number
  radiusCol: number
  radiusRow: number
  chars: string[]
  charSet: string[]
}

interface LocaleLayout {
  row: number
  startCol: number
  len: number
  isHovered: boolean
}

// ============================================================================
// 2. Constants & Presets
// ============================================================================

const BG_GLYPHS = ' .·:-=+*#%@'
const DENSITY_RAMP = ['·', ':', '-', '=', '░', '▒', '▓', '■', '█']
const SCRAMBLE_GLYPHS = '/\\|+=-:*#%&?!01x<>~$'.split('')
const EXPLOSION_GLYPHS = ['✦', '*', '•', '░', '▒', '■', '▫', '+', 'x', '%']

/**
 * Tangent of ~11 deg italic slant angle in EB Garamond Italic.
 * Allows projecting all italic stroke pixels into an upright (deslant) coordinate space.
 */
const ITALIC_SLANT = 0.195

function getStraightX(x: number, y: number, yMid: number): number {
  return x - ITALIC_SLANT * (yMid - y)
}

const DEFAULT_POINTER_CONFIG: PointerTrackerConfig = {
  radius: 20, // Smaller, razor-sharp bright pinpoint (previously 38px)
  damp: 0.16, // Smooth responsive delayed follow
  cyanRadiusRatio: 0.55, // Clean, intense cyan core
  maxCyan: 1.0,
  trailMaxPoints: 22, // Rich trailing comet tail
  trailMinDist: 4, // Record node every 4px movement
  trailDecay: 0.038, // Graceful decay over ~26 frames (~430ms)
}

// ============================================================================
// 3. Pure Helper Modules (Ready for external extraction)
// ============================================================================

function randomBgGlyph(): string {
  return BG_GLYPHS[Math.floor(Math.random() * BG_GLYPHS.length)] ?? ' '
}

/**
 * Color System: resolves theme colors and provides linear RGB blending
 * Must match --ink and --signal in tokens.css (#2dd4bf in dark, #0f766e in light)
 */
function getThemeColors(isDark: boolean): { ink: ThemeRgb, cyan: ThemeRgb } {
  return {
    ink: isDark ? { r: 242, g: 242, b: 238 } : { r: 22, g: 22, b: 26 },
    cyan: isDark ? { r: 45, g: 212, b: 191 } : { r: 15, g: 118, b: 110 },
  }
}

function mixRgb(base: ThemeRgb, target: ThemeRgb, mix: number): string {
  const m = Math.min(1, Math.max(0, mix))
  const r = Math.round(base.r + (target.r - base.r) * m)
  const g = Math.round(base.g + (target.g - base.g) * m)
  const b = Math.round(base.b + (target.b - base.b) * m)
  return `${r}, ${g}, ${b}`
}

/**
 * Pointer & Trail System: handles delayed position tracking and comet trail history
 */
function updatePointerPosition(
  current: { x: number, y: number } | null,
  target: { x: number, y: number } | null,
  damp: number,
): { x: number, y: number } | null {
  if (!target)
    return null
  if (!current)
    return { x: target.x, y: target.y }

  const nextX = current.x + (target.x - current.x) * damp
  const nextY = current.y + (target.y - current.y) * damp
  return { x: nextX, y: nextY }
}

function updateTrail(
  trail: TrailNode[],
  pointer: { x: number, y: number } | null,
  config: PointerTrackerConfig,
): void {
  // Age existing nodes
  for (let i = trail.length - 1; i >= 0; i--) {
    const node = trail[i]
    if (!node)
      continue
    node.life -= config.trailDecay
    if (node.life <= 0)
      trail.splice(i, 1)
  }

  if (!pointer)
    return

  const last = trail[0]
  if (!last || Math.hypot(pointer.x - last.x, pointer.y - last.y) >= config.trailMinDist) {
    trail.unshift({ x: pointer.x, y: pointer.y, life: 1.0 })
    if (trail.length > config.trailMaxPoints)
      trail.pop()
  }
}

/**
 * Evaluates combined glow and cyan color mix across the primary pointer and its comet trail.
 * Trail is tuned to be almost the same width as the primary pinpoint, tapering slightly towards the tail.
 */
function samplePointerAndTrailAura(
  px: number,
  py: number,
  pointer: { x: number, y: number } | null,
  trail: TrailNode[],
  config: PointerTrackerConfig,
): { alphaBoost: number, colorMix: number, isDense: boolean } {
  let maxAlpha = 0
  let maxColorMix = 0

  // 1. Primary cursor glow: intense, tight pinpoint
  if (pointer) {
    const pd = Math.hypot(px - pointer.x, py - pointer.y)
    if (pd <= config.radius * 2.2) {
      const glow = Math.exp(-(pd ** 2) / (2 * config.radius ** 2))
      if (glow > 0.02) {
        maxAlpha = glow * 0.96 // Extra bright
        const cyanThreshold = 1 - config.cyanRadiusRatio
        const cyanNorm = Math.max(0, (glow - cyanThreshold) / (1 - cyanThreshold))
        maxColorMix = Math.min(1, (cyanNorm ** 1.3) * config.maxCyan)
      }
    }
  }

  // 2. Comet trail nodes: calibrated to be comparable to pointer radius (80%..95%), slightly smaller
  for (let i = 0; i < trail.length; i++) {
    const node = trail[i]
    if (!node)
      continue
    const trailRadius = config.radius * (0.80 + 0.16 * node.life)
    const td = Math.hypot(px - node.x, py - node.y)
    if (td <= trailRadius * 2.0) {
      const tglow = Math.exp(-(td ** 2) / (2 * trailRadius ** 2)) * node.life
      if (tglow > 0.02) {
        maxAlpha = Math.max(maxAlpha, tglow * 0.82)
        maxColorMix = Math.max(maxColorMix, tglow * 0.9)
      }
    }
  }

  return {
    alphaBoost: maxAlpha,
    colorMix: maxColorMix,
    isDense: maxAlpha > 0.42,
  }
}

/**
 * Grid-Native Explosion System:
 * Completely implemented ON THE ASCII BACKGROUND GRID CELLS, without arbitrary floating layers.
 */
function spawnGridExplosion(
  x: number,
  y: number,
  sparks: GridSpark[],
): void {
  // Radial ASCII sparks mapped to grid cells
  const count = 42 + Math.floor(Math.random() * 16)
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35
    const speed = 2.2 + Math.random() * 7.4
    sparks.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1.0,
      decay: 0.016 + Math.random() * 0.020, // ~40..60 frames
      char: EXPLOSION_GLYPHS[Math.floor(Math.random() * EXPLOSION_GLYPHS.length)] ?? '*',
    })
  }
}

/**
 * Dedicated Compact Haptic Spark Feedback for Interactive ASCII elements.
 * Generates only a few delicate micro-sparks strictly localized around the interactive target,
 * markedly distinct from the sprawling cosmic fireworks of background clicks.
 */
function spawnInteractiveHapticSparks(
  x: number,
  y: number,
  sparks: GridSpark[],
): void {
  const count = 6
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3
    const speed = 0.6 + Math.random() * 0.9
    sparks.push({
      x: x + (Math.random() - 0.5) * 6,
      y: y + (Math.random() - 0.5) * 4,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed * 0.5,
      life: 1.0,
      decay: 0.055 + Math.random() * 0.025,
      char: ['·', ':', '✦', '*', '+'][i % 5] ?? '·',
    })
  }
}

function updateGridExplosions(
  sparks: GridSpark[],
): void {
  // Update spark physics
  for (let i = sparks.length - 1; i >= 0; i--) {
    const sp = sparks[i]
    if (!sp)
      continue

    sp.x += sp.vx
    sp.y += sp.vy
    sp.vx *= 0.94
    sp.vy = sp.vy * 0.94 + 0.05
    sp.life -= sp.decay

    if (sp.life <= 0)
      sparks.splice(i, 1)
  }
}

/**
 * Builds an index map of all grid cells actively occupied by explosion debris sparks
 */
function buildSparkCellMap(
  sparks: GridSpark[],
  cols: number,
  rows: number,
  cellW: number,
  cellH: number,
): Map<number, SparkGridCell> {
  const map = new Map<number, SparkGridCell>()
  if (sparks.length === 0)
    return map

  for (let i = 0; i < sparks.length; i++) {
    const sp = sparks[i]
    if (!sp || sp.life <= 0)
      continue

    const gx = Math.floor(sp.x / cellW)
    const gy = Math.floor(sp.y / cellH)

    if (gx >= 0 && gx < cols && gy >= 0 && gy < rows) {
      const idx = gy * cols + gx
      const existing = map.get(idx)
      const alpha = Math.min(1, sp.life * 1.15)

      if (!existing || existing.alpha < alpha) {
        map.set(idx, {
          char: sp.char,
          alpha,
          colorMix: 0.95,
        })
      }
    }
  }

  return map
}

/**
 * Text Rasterizer: renders crisp vector typography to offscreen buffer for grid sampling
 * Tracks per-character horizontal bounding zones for sequential typewriter reveal
 */
function rasterizeText(
  text: string,
  targetW: number,
  targetH: number,
  offCanvas: HTMLCanvasElement,
): RasterizedWord | null {
  offCanvas.width = targetW
  offCanvas.height = targetH

  const octx = offCanvas.getContext('2d', { willReadFrequently: true })
  if (!octx)
    return null

  octx.clearRect(0, 0, targetW, targetH)

  try {
    octx.letterSpacing = '0.04em'
  }
  catch {}

  let fontSize = Math.round(targetH * 0.88)
  octx.font = `italic 700 ${fontSize}px "EB Garamond Variable", "EB Garamond", serif`
  const measured = octx.measureText(text).width
  if (measured > 0) {
    const scale = (targetW * 0.94) / measured
    fontSize = Math.min(Math.round(fontSize * scale), Math.round(targetH * 0.92))
  }

  octx.font = `italic 700 ${fontSize}px "EB Garamond Variable", "EB Garamond", serif`
  octx.textBaseline = 'middle'
  octx.fillStyle = '#000000'

  const totalWidth = octx.measureText(text).width
  const leftOrigin = Math.round((targetW - totalWidth) / 2)

  const yMid = targetH * 0.52
  octx.textAlign = 'left'

  // 1. Core glyph rasterization
  octx.clearRect(0, 0, targetW, targetH)
  octx.fillStyle = '#000000'
  octx.fillText(text, leftOrigin, yMid)
  const coreImgData = octx.getImageData(0, 0, targetW, targetH)
  const data = coreImgData.data

  // 2. Peripheral stroke aura for transient entrance transition & inter-character bridge
  octx.clearRect(0, 0, targetW, targetH)
  const auraLineWidth = Math.round(Math.max(30, targetH * 0.11))
  octx.lineWidth = auraLineWidth
  octx.lineJoin = 'round'
  octx.lineCap = 'round'
  octx.strokeStyle = '#000000'
  octx.strokeText(text, leftOrigin, yMid)
  const auraImgData = octx.getImageData(0, 0, targetW, targetH)
  const auraData = auraImgData.data

  const charBounds: CharBound[] = []
  for (let i = 0; i < text.length; i++) {
    const prevWidth = i === 0 ? 0 : octx.measureText(text.slice(0, i)).width
    const currWidth = octx.measureText(text.slice(0, i + 1)).width
    charBounds.push({
      char: text[i] ?? '',
      startX: leftOrigin + prevWidth,
      endX: leftOrigin + currWidth,
      topY: targetH,
      bottomY: 0,
      index: i,
    })
  }

  // Scan all canvas pixels using deslant upright coordinate to find exact topY and bottomY for each character
  for (let y = 0; y < targetH; y++) {
    const rowOffset = y * targetW
    for (let x = 0; x < targetW; x++) {
      const a = data[(rowOffset + x) * 4 + 3] ?? 0
      if (a > 15) {
        const straightX = getStraightX(x, y, yMid)
        const bound = getCharBoundAtX(straightX, charBounds)
        if (bound) {
          if (y < bound.topY)
            bound.topY = y
          if (y > bound.bottomY)
            bound.bottomY = y
        }
      }
    }
  }

  for (const b of charBounds) {
    if (b.topY >= b.bottomY) {
      b.topY = Math.round(targetH * 0.2)
      b.bottomY = Math.round(targetH * 0.8)
    }
  }

  const startX = charBounds[0]?.startX ?? leftOrigin
  const endX = charBounds[charBounds.length - 1]?.endX ?? (leftOrigin + totalWidth)

  return {
    text,
    width: targetW,
    height: targetH,
    data,
    auraData,
    charBounds,
    startX,
    endX,
  }
}

/**
 * Resolves which CharBound object a given horizontal coordinate (rx) belongs to
 */
function getCharBoundAtX(rx: number, bounds: CharBound[]): CharBound | null {
  if (bounds.length === 0)
    return null
  const first = bounds[0]
  if (first && rx <= first.startX)
    return first
  const last = bounds[bounds.length - 1]
  if (last && rx >= last.endX)
    return last

  for (let k = 0; k < bounds.length; k++) {
    const b = bounds[k]
    if (!b)
      continue
    if (rx >= b.startX && rx < b.endX)
      return b
    if (k < bounds.length - 1) {
      const nextB = bounds[k + 1]
      if (nextB && rx >= b.endX && rx < nextB.startX)
        return (rx - b.endX < nextB.startX - rx) ? b : nextB
    }
  }
  return null
}

// ============================================================================
// 4. Component Core
// ============================================================================

const canvasRef = ref<HTMLCanvasElement | null>(null)
const nuxtApp = useNuxtApp()

if (import.meta.client) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let raf = 0
  let targetPointer: { x: number, y: number } | null = null
  let currentPointer: { x: number, y: number } | null = null
  const pointerTrail: TrailNode[] = []
  const gridSparks: GridSpark[] = []

  let resizeObserver: ResizeObserver | undefined
  let frame = 0
  let entranceProgress = reduced ? 1.0 : 0.0
  let postEntranceFrames = 0
  let interactiveHover = 0.0
  let interactivePulse = 0.0
  let cols = 0
  let rows = 0
  let cellW = 0
  let cellH = 0
  let chars: string[] = []
  let phases: number[] = []
  let freqs: number[] = []
  let flash: Float32Array = new Float32Array(0)
  let paint: Float32Array = new Float32Array(0)
  let painting = false
  let paintMoved = false
  let lastPaint: { x: number, y: number } | null = null
  let paintOrigin: { x: number, y: number } | null = null
  let ctx: CanvasRenderingContext2D | null = null
  let attractors: Attractor[] = []

  let wordCache: RasterizedWord | null = null
  let offCanvas: HTMLCanvasElement | null = null
  let currentLocaleLayout: LocaleLayout | null = null

  function updateWordRasterization(viewportWidth: number) {
    const anchor = document.querySelector('[data-ascii-word]')
    if (!anchor) {
      wordCache = null
      return
    }

    const text = anchor.textContent?.trim()
    if (!text) {
      wordCache = null
      return
    }

    const rect = anchor.getBoundingClientRect()
    const targetW = Math.round(Math.min(viewportWidth * 0.94, Math.max(viewportWidth * 0.72, rect.width * 1.25)))
    const targetH = Math.round(Math.max(200, Math.min(620, Math.max(rect.height * 1.35, viewportWidth * 0.34))))

    if (wordCache?.text === text && wordCache.width === targetW && wordCache.height === targetH)
      return

    if (!offCanvas)
      offCanvas = document.createElement('canvas')

    wordCache = rasterizeText(text, targetW, targetH, offCanvas)
  }

  function resolveIntroLayout(viewportHeight: number): IntroLayout | null {
    const introAnchor = document.querySelector('[data-ascii-intro]')
    if (!introAnchor)
      return null

    const irect = introAnchor.getBoundingClientRect()
    const itext = introAnchor.textContent?.trim() || ''
    if (!itext || irect.bottom <= 0 || irect.top >= viewportHeight)
      return null

    const introChars = itext.split('')
    const introCharSet = [...new Set(introChars.filter(c => c.trim()))]
    const coreRow = Math.round((irect.top + irect.height * 0.5) / cellH)
    const centerCol = Math.round((irect.left + irect.width * 0.5) / cellW)

    const step = (cols > introChars.length * 3 + 12) ? 2 : 1
    const totalSpan = (introChars.length - 1) * step
    const startCol = Math.round(centerCol - totalSpan / 2)

    const radiusCol = Math.max(introChars.length * (step === 2 ? 1.5 : 1.2), 14)
    const radiusRow = 2.4

    return {
      coreRow,
      startCol,
      step,
      centerCol,
      radiusCol,
      radiusRow,
      chars: introChars,
      charSet: introCharSet,
    }
  }

  function resolveLocaleLayout(viewportWidth: number, viewportHeight: number): LocaleLayout | null {
    const localeAnchor = document.querySelector('[data-ascii-locale]')
    if (!localeAnchor)
      return null

    const rect = localeAnchor.getBoundingClientRect()
    if (rect.bottom <= 0 || rect.top >= viewportHeight || rect.right <= 0 || rect.left >= viewportWidth)
      return null

    const len = Math.ceil(rect.width / cellW)
    const row = Math.round((rect.top + rect.height * 0.5) / cellH)
    const startCol = Math.max(0, Math.floor(rect.left / cellW))

    const isHovered = Boolean(
      targetPointer
      && targetPointer.x >= rect.left - 4
      && targetPointer.x <= rect.right + 4
      && targetPointer.y >= rect.top - 4
      && targetPointer.y <= rect.bottom + 4,
    )

    return {
      row,
      startCol,
      len,
      isHovered,
    }
  }

  function buildGrid(width: number, height: number) {
    const canvas = canvasRef.value
    if (!canvas)
      return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx = canvas.getContext('2d')
    if (!ctx)
      return
    ctx.scale(dpr, dpr)

    const fontSize = Math.max(12, Math.min(16, width / 76))
    ctx.font = `${fontSize}px "DM Mono", ui-monospace, monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const metrics = ctx.measureText('M')
    cellW = metrics.width * 1.15
    cellH = fontSize * 1.25
    cols = Math.ceil(width / cellW)
    rows = Math.ceil(height / cellH)

    const n = cols * rows
    chars = Array.from({ length: n }, randomBgGlyph)
    phases = Array.from({ length: n }, () => Math.random() * Math.PI * 2)
    freqs = Array.from({ length: n }, () => 0.15 + Math.random() * 1.1)
    flash = new Float32Array(n)
    paint = new Float32Array(n)

    attractors = Array.from({ length: 6 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: 100 + Math.random() * 200,
    }))

    updateWordRasterization(width)
  }

  function draw() {
    if (!ctx || !canvasRef.value)
      return

    const width = canvasRef.value.clientWidth
    const height = canvasRef.value.clientHeight
    ctx.clearRect(0, 0, width, height)

    if (frame % 45 === 0)
      updateWordRasterization(width)

    const dark = document.documentElement.classList.contains('dark')
    const { ink, cyan } = getThemeColors(dark)

    const timeSec = frame * 0.016

    // Smooth entrance progression (0.0 -> 1.0)
    // Carefully tuned pace (~330 frames, ~5.5s) to give ample time for color fade & cipher scramble
    if (!reduced && entranceProgress < 1.0) {
      entranceProgress = Math.min(1.0, entranceProgress + 0.003)
    }

    // 1. Background fluid attractors breathing (gentle, low frequency ~18s)
    const bgBreathe = 0.88 + 0.12 * Math.sin(timeSec * 0.35)

    // 2. Word breathe (wordBreathe):
    // Strictly disable during entrance animation (entranceProgress < 1.0) to eliminate blinking / flashing.
    let wordBreathe = 1.0
    if (!reduced && entranceProgress >= 1.0) {
      postEntranceFrames += 1
      // Solid stabilization phase after entrance completion (~160 frames, ~2.6s) before gradual fade-in
      const breatheActivation = Math.max(0, Math.min(1.0, (postEntranceFrames - 160) / 180))
      if (breatheActivation > 0) {
        // Ultra-low frequency (~28.5s cycle, angular freq 0.22 rad/s, down from 1.1)
        // Uses smooth cosine (1 - cos) starting at 0 with zero derivative for seamless transition
        const osc = (1 - Math.cos((postEntranceFrames - 160) * 0.016 * 0.22)) * 0.5
        // Controlled subtle dip (~0.08 max depth) avoiding jarring square-to-dot collapse
        wordBreathe = 1.0 - osc * 0.08 * breatheActivation
      }
    }
    else {
      postEntranceFrames = 0
    }

    // Resolve introducing and interactive locale layout early for dynamic aura adjustments
    const introLayout = resolveIntroLayout(height)
    const localeLayout = resolveLocaleLayout(width, height)
    currentLocaleLayout = localeLayout

    // Smooth transition for interactive hover dampening and click haptic pulse
    const targetInteractiveHover = (localeLayout?.isHovered) ? 1.0 : 0.0
    interactiveHover += (targetInteractiveHover - interactiveHover) * 0.22

    if (interactivePulse > 0.01) {
      interactivePulse = Math.max(0, interactivePulse - 0.045)
    }
    else {
      interactivePulse = 0
    }

    // Interactive element hover: shrink pointer aura radius and damp comet trail
    const effectiveRadius = Math.max(4, DEFAULT_POINTER_CONFIG.radius * (1 - interactiveHover * 0.78))
    const activePointerConfig: PointerTrackerConfig = {
      ...DEFAULT_POINTER_CONFIG,
      radius: effectiveRadius,
      trailMaxPoints: Math.round(DEFAULT_POINTER_CONFIG.trailMaxPoints * (1 - interactiveHover * 0.85)),
    }

    // Smooth delayed pointer follow + trailing comet tail
    currentPointer = updatePointerPosition(currentPointer, targetPointer, activePointerConfig.damp)
    updateTrail(pointerTrail, currentPointer, activePointerConfig)

    // Physics update for grid explosions
    updateGridExplosions(gridSparks)
    const sparkMap = buildSparkCellMap(gridSparks, cols, rows, cellW, cellH)

    // Attractor physics
    for (const a of attractors) {
      a.x += a.vx
      a.y += a.vy
      if (a.x < -a.r)
        a.x = width + a.r
      if (a.x > width + a.r)
        a.x = -a.r
      if (a.y < -a.r)
        a.y = height + a.r
      if (a.y > height + a.r)
        a.y = -a.r
    }

    // Resolve word position in screen space
    let wordLeft = -9999
    let wordTop = -9999
    const wordAnchor = document.querySelector('[data-ascii-word]')
    const wordRect = wordAnchor?.getBoundingClientRect()
    if (wordRect && wordRect.width > 0 && wordCache && wordCache.width > 0 && wordCache.height > 0) {
      const rect = wordRect
      wordLeft = Math.round(rect.left + rect.width / 2 - wordCache.width / 2)
      wordTop = Math.round(rect.top + rect.height / 2 - wordCache.height / 2)
    }

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x
        const px = (x + 0.5) * cellW
        const py = (y + 0.5) * cellH

        let char = chars[i] ?? ' '
        let alpha = 0
        let colorMix = 0
        let isWordCell = false
        let isLocaleCell = false
        let isIntroCore = false
        let m = 0

        // Keep the background clear behind the DOM locale toggle
        if (localeLayout && y === localeLayout.row) {
          const colOffset = x - localeLayout.startCol
          if (colOffset >= -1 && colOffset <= localeLayout.len) {
            isLocaleCell = true
            char = ' '
            alpha = 0
          }
        }

        // 1. Word mask sampling: Continuous Horizontal Cipher Wave & Inter-character Scramble
        if (wordCache) {
          const rx = Math.round(px - wordLeft)
          const ry = Math.round(py - wordTop)
          if (rx >= 0 && rx < wordCache.width && ry >= 0 && ry < wordCache.height) {
            const idx = (ry * wordCache.width + rx) * 4 + 3
            const rawM = (wordCache.data[idx] ?? 0) / 255
            let rawAuraM = (wordCache.auraData[idx] ?? 0) / 255

            const yMid = wordCache.height * 0.52
            const rxStraight = getStraightX(rx, ry, yMid)
            const wordStartX = wordCache.startX
            const wordEndX = wordCache.endX
            const totalWordW = Math.max(1, wordEndX - wordStartX)
            const wordU = (rxStraight - wordStartX) / totalWordW

            const isCore = rawM > 0.06
            const inWordY = ry >= wordCache.height * 0.26 && ry <= wordCache.height * 0.82
            const inWordX = rxStraight >= wordStartX - 8 && rxStraight <= wordEndX + 8

            // Soft bridging across inter-character gaps so cipher sweeps continuously without breaks
            if (!isCore && rawAuraM < 0.20 && inWordY && inWordX) {
              rawAuraM = 0.26
            }

            const isAura = !isCore && rawAuraM > 0.06

            if (isCore || isAura) {
              // Settled stable state (reduced-motion or post-entrance completion)
              if (reduced || entranceProgress >= 1.0) {
                if (isCore) {
                  m = rawM
                  isWordCell = true
                  const baseDensity = Math.min(1, Math.max(0, (rawM - 0.06) / 0.88 * wordBreathe))
                  const glyphIndex = Math.min(
                    DENSITY_RAMP.length - 1,
                    Math.max(4, Math.floor(baseDensity * DENSITY_RAMP.length)),
                  )
                  char = DENSITY_RAMP[glyphIndex] ?? '█'
                  alpha = Math.min(1.0, 0.80 + baseDensity * 0.20)
                  colorMix = 0
                }
              }
              else {
                // Continuous scanning wave front advancing from left to right across the entire word
                const scanFront = (entranceProgress - 0.18) / 0.67
                const cellSeed = ((x * 7919 + y * 6547) % 1000) / 1000

                // Wake-up threshold with subtle granular jitter
                const wakeThreshold = wordU + (cellSeed - 0.5) * 0.08
                const scrambleBandWidth = isCore ? 0.22 : 0.16
                const lockThreshold = wakeThreshold + scrambleBandWidth

                if (scanFront >= wakeThreshold) {
                  if (scanFront < lockThreshold) {
                    // Active cipher scramble wave (sweeping continuously across glyphs and gutters)
                    const bandT = (scanFront - wakeThreshold) / scrambleBandWidth

                    if (isCore) {
                      m = rawM
                      isWordCell = true
                      const glyphIdx = (Math.floor(frame / 2) + x * 7 + y * 13) % SCRAMBLE_GLYPHS.length
                      char = SCRAMBLE_GLYPHS[glyphIdx] ?? '?'
                      alpha = Math.min(1.0, 0.75 + 0.25 * (rawM / 0.95))
                      colorMix = 0.72 + 0.18 * Math.sin(frame * 0.25 + x * 0.4 + y * 0.3)
                    }
                    else if (isAura) {
                      const auraBell = Math.sin(bandT * Math.PI)
                      if (auraBell > 0.05) {
                        m = rawAuraM * 0.45
                        isWordCell = true
                        const glyphIdx = (Math.floor(frame / 3) + x * 11 + y * 17) % SCRAMBLE_GLYPHS.length
                        char = SCRAMBLE_GLYPHS[glyphIdx] ?? '·'
                        alpha = (0.24 + 0.36 * (rawAuraM / 0.95)) * auraBell
                        colorMix = 0.60 + 0.25 * Math.sin(frame * 0.25 + x * 0.3 + y * 0.5)
                      }
                    }
                  }
                  else {
                    // Crystallized solid lock phase behind the scanning wave
                    if (isCore) {
                      m = rawM
                      isWordCell = true
                      const postLock = scanFront - lockThreshold
                      const baseDensity = Math.min(1, Math.max(0, (rawM - 0.06) / 0.88 * wordBreathe))
                      const glyphIndex = Math.min(
                        DENSITY_RAMP.length - 1,
                        Math.max(4, Math.floor(baseDensity * DENSITY_RAMP.length)),
                      )
                      char = DENSITY_RAMP[glyphIndex] ?? '█'
                      colorMix = Math.max(0, 0.45 * (1 - postLock / 0.06))
                      alpha = Math.min(1.0, 0.80 + baseDensity * 0.20)
                    }
                    else if (isAura) {
                      // Transient aura and inter-character scramble dissipate completely
                      const postLock = scanFront - lockThreshold
                      if (postLock < 0.03) {
                        isWordCell = true
                        const fade = 1 - postLock / 0.03
                        alpha = 0.14 * fade
                        char = '·'
                        colorMix = 0.2
                      }
                    }
                  }
                }
              }
            }
          }
        }

        if (!isLocaleCell && !isWordCell) {
          // 2. Check if within introducing region
          let inIntroCloud = false
          if (introLayout) {
            const dx = (x - introLayout.centerCol) / introLayout.radiusCol
            const dy = (y - introLayout.coreRow) / introLayout.radiusRow
            const distIntro2 = dx * dx + dy * dy

            if (distIntro2 < 1.0) {
              inIntroCloud = true

              // Center row: introducing letters with gentle sequential alpha fade + cipher scramble
              if (y === introLayout.coreRow && introLayout.chars.length > 0) {
                const colOffset = x - introLayout.startCol
                if (colOffset >= 0 && colOffset % introLayout.step === 0) {
                  const charIdx = colOffset / introLayout.step
                  if (charIdx >= 0 && charIdx < introLayout.chars.length) {
                    isIntroCore = true
                    const targetChar = introLayout.chars[charIdx] ?? ' '
                    const charStart = 0.04 + (charIdx / introLayout.chars.length) * 0.20
                    const charDuration = 0.18

                    if (entranceProgress >= charStart) {
                      const rawT = Math.min(1, (entranceProgress - charStart) / charDuration)
                      const t = rawT * rawT * (3 - 2 * rawT)
                      alpha = t * (0.86 + 0.08 * Math.sin(timeSec * 0.9 + charIdx * 0.18))

                      if (t < 0.72) {
                        // In scramble phase, smoothly fading in
                        const glyphIdx = (Math.floor(frame / 2) + charIdx * 3) % SCRAMBLE_GLYPHS.length
                        char = SCRAMBLE_GLYPHS[glyphIdx] ?? '*'
                      }
                      else {
                        // Resolved into real letter
                        char = targetChar
                      }
                    }
                    else {
                      char = ' '
                      alpha = 0
                    }
                  }
                }
              }

              // Negative space around introducing: keep it clean from noise
              if (!isIntroCore) {
                alpha = 0
                char = ' '
              }
            }
          }

          if (!inIntroCloud) {
            // 3. Faint generative background field
            if (Math.random() < 0.0005)
              chars[i] = randomBgGlyph()

            char = chars[i] ?? ' '
            alpha = 0.012 + 0.02 * (0.5 + 0.5 * Math.sin(timeSec * (freqs[i] ?? 0.4) * 2 + (phases[i] ?? 0)))

            // Drifting organic clumps
            for (const a of attractors) {
              const d2 = (px - a.x) ** 2 + (py - a.y) ** 2
              if (d2 < a.r * a.r * 4)
                alpha += Math.exp(-d2 / (a.r * a.r)) * 0.035 * bgBreathe
            }

            // Rare sparks
            const f = flash[i] ?? 0
            if (f > 0.02) {
              alpha += f * 0.15
              flash[i] = f * 0.94
            }
            else if (Math.random() < 0.00003) {
              flash[i] = 1
            }

            // Clear space directly around letter silhouettes
            if (m > 0.01)
              alpha *= 0.12
          }
        }

        // 4. Pointer highlight + Compact Comet trailing tail (cyan phosphor aura)
        // Suppresses giant ASCII beacon / light pillars when hovering over interactive elements
        const aura = samplePointerAndTrailAura(px, py, currentPointer, pointerTrail, activePointerConfig)
        const effectiveAlphaBoost = aura.alphaBoost * (1 - interactiveHover * 0.88)
        if (effectiveAlphaBoost > 0) {
          alpha = Math.min(1, alpha + effectiveAlphaBoost)
          if (aura.isDense && m <= 0.06 && !isLocaleCell && interactiveHover < 0.25)
            char = BG_GLYPHS[Math.min(BG_GLYPHS.length - 1, Math.floor(effectiveAlphaBoost * BG_GLYPHS.length * 1.5))] ?? '@'
          colorMix = Math.max(colorMix, aura.colorMix)
        }

        // 5. Grid-Native Explosion Debris (Sparks mapped directly to background cells)
        const sparkCell = sparkMap.get(i)
        if (sparkCell) {
          char = sparkCell.char
          alpha = Math.min(1, Math.max(alpha, sparkCell.alpha))
          colorMix = Math.max(colorMix, sparkCell.colorMix)
        }

        // 6. Persistent brush strokes on the background grid
        const stroke = paint[i] ?? 0
        if (stroke > 0.02) {
          paint[i] = reduced ? stroke : stroke * 0.992
          if (!isWordCell && !isLocaleCell && !isIntroCore) {
            const settled = stroke < 0.72
            if (settled) {
              const glyphIndex = Math.min(
                DENSITY_RAMP.length - 1,
                Math.max(2, Math.floor(stroke * DENSITY_RAMP.length)),
              )
              char = DENSITY_RAMP[glyphIndex] ?? '▓'
            }
            else {
              const glyphIdx = (Math.floor(frame / 2) + x * 5 + y * 9) % SCRAMBLE_GLYPHS.length
              char = SCRAMBLE_GLYPHS[glyphIdx] ?? '+'
            }
            alpha = Math.max(alpha, 0.28 + stroke * 0.68)
            colorMix = Math.max(colorMix, 0.22 + stroke * 0.62)
          }
        }

        if (alpha < 0.008)
          continue

        const colorStr = mixRgb(ink, cyan, colorMix)
        ctx.fillStyle = `rgba(${colorStr}, ${Math.min(alpha, 0.96)})`
        ctx.fillText(char, px, py)
      }
    }

    frame += 1

    if (!reduced)
      raf = requestAnimationFrame(draw)
  }

  function isUiPointerTarget(event: PointerEvent): boolean {
    const targetEl = event.target as HTMLElement | null
    return Boolean(
      targetEl?.closest?.('a, button, input, textarea, select, [data-ascii-locale], [data-ascii-interactive]')
      || (currentLocaleLayout && currentLocaleLayout.isHovered),
    )
  }

  function stampPaint(x: number, y: number) {
    if (cellW <= 0 || cellH <= 0 || paint.length === 0)
      return

    const cx = x / cellW
    const cy = y / cellH
    const radius = 1.25
    const y0 = Math.max(0, Math.floor(cy - radius))
    const y1 = Math.min(rows - 1, Math.ceil(cy + radius))
    const x0 = Math.max(0, Math.floor(cx - radius))
    const x1 = Math.min(cols - 1, Math.ceil(cx + radius))

    for (let gy = y0; gy <= y1; gy++) {
      for (let gx = x0; gx <= x1; gx++) {
        const d = Math.hypot(gx + 0.5 - cx, gy + 0.5 - cy)
        if (d > radius)
          continue
        const fall = 1 - d / radius
        const cell = gy * cols + gx
        paint[cell] = Math.max(paint[cell] ?? 0, fall * fall)
      }
    }
  }

  function strokeTo(x: number, y: number) {
    if (!lastPaint) {
      stampPaint(x, y)
      lastPaint = { x, y }
      return
    }

    const dist = Math.hypot(x - lastPaint.x, y - lastPaint.y)
    const step = Math.max(2, cellW * 0.4)
    const steps = Math.max(1, Math.ceil(dist / step))
    for (let s = 1; s <= steps; s++) {
      const t = s / steps
      stampPaint(
        lastPaint.x + (x - lastPaint.x) * t,
        lastPaint.y + (y - lastPaint.y) * t,
      )
    }
    lastPaint = { x, y }
  }

  function onPointerMove(event: PointerEvent) {
    targetPointer = { x: event.clientX, y: event.clientY }
    if (!painting)
      return

    if (paintOrigin && Math.hypot(event.clientX - paintOrigin.x, event.clientY - paintOrigin.y) > 5)
      paintMoved = true

    if (paintMoved)
      strokeTo(event.clientX, event.clientY)

    if (reduced)
      draw()
  }

  function onPointerLeave() {
    targetPointer = null
    painting = false
    lastPaint = null
    paintOrigin = null
  }

  function onPointerDown(event: PointerEvent) {
    if (event.button !== 0)
      return

    const hitInteractive = isUiPointerTarget(event)

    if (hitInteractive) {
      if (reduced)
        return
      interactivePulse = 1.0
      spawnInteractiveHapticSparks(event.clientX, event.clientY, gridSparks)
      return
    }

    painting = true
    paintMoved = false
    paintOrigin = { x: event.clientX, y: event.clientY }
    lastPaint = null
    targetPointer = paintOrigin
  }

  function onPointerUp(event: PointerEvent) {
    if (!painting)
      return

    painting = false
    lastPaint = null
    paintOrigin = null

    if (!paintMoved && !reduced && !isUiPointerTarget(event))
      spawnGridExplosion(event.clientX, event.clientY, gridSparks)
  }

  onMounted(() => {
    const canvas = canvasRef.value
    if (!canvas)
      return

    buildGrid(canvas.clientWidth, canvas.clientHeight)
    resizeObserver = new ResizeObserver(() => {
      buildGrid(canvas.clientWidth, canvas.clientHeight)
      if (reduced)
        draw()
    })
    resizeObserver.observe(canvas)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('pointerup', onPointerUp, { passive: true })
    window.addEventListener('pointercancel', onPointerUp, { passive: true })
    document.documentElement.addEventListener('pointerleave', onPointerLeave)

    document.fonts?.ready.then(() => {
      updateWordRasterization(canvas.clientWidth)
      if (reduced)
        draw()
    }).catch(() => {})

    draw()
  })

  // Pages swap out-in, so the next page's anchors only exist once it has resolved
  let initialPage = true
  const offPageFinish = nuxtApp.hook('page:finish', () => {
    const canvas = canvasRef.value
    if (!canvas)
      return
    updateWordRasterization(canvas.clientWidth)
    if (initialPage) {
      initialPage = false
      return
    }
    postEntranceFrames = 0
    if (!reduced)
      entranceProgress = 0.15
    else
      draw()
  })

  onBeforeUnmount(() => {
    offPageFinish()
    cancelAnimationFrame(raf)
    resizeObserver?.disconnect()
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerdown', onPointerDown)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointercancel', onPointerUp)
    document.documentElement.removeEventListener('pointerleave', onPointerLeave)
  })
}
</script>

<template>
  <canvas
    ref="canvasRef"
    class="ascii-field"
    aria-hidden="true"
  />
</template>
