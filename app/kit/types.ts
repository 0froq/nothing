export type Point = [number, number]

export interface LayerColors {
  paper: string
  ink: string
  accent: string
  dark: boolean
}

export interface PaperOptions {
  colors: LayerColors
  /** Elements whose centre receives a wash when `bloom()` runs. */
  marks?: HTMLElement[]
  /** Watercolour blooms (dwell, click, marks). Off leaves only the paper texture. */
  washes?: boolean
}

export interface BloomOptions {
  delay?: number
  strength?: number
}

export interface PaperLayer {
  bloom: () => void
  soak: (el: HTMLElement | null | undefined) => void
  add: (x: number, y: number, size: number, options?: BloomOptions) => void
  setColors: (colors: LayerColors) => void
  destroy: () => void
}

export interface PenOptions {
  /** Page root; the route is read from `[data-anchor]` descendants. */
  root: HTMLElement
  /** Handwrite this element's text. Null or empty text skips the hand. */
  hand?: HTMLElement | null
  colors: LayerColors
  /** Called when the pen reaches the final mark. Without it the pen dots the stop itself. */
  onArrive?: () => void
}

export interface PenLayer {
  setColors: (colors: LayerColors) => void
  destroy: () => void
}

export interface GlyphLayout {
  strokes: Point[][]
  width: number
  ascent: number
  descent: number
}
