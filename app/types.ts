export type LocaleCode = 'en' | 'zh'

export type ColorSchemePref = 'auto' | 'light' | 'dark'

export interface Localized<T> {
  en: T
  zh: T
}

export interface Post {
  slug: string
  date: string
  title: Localized<string>
  excerpt: Localized<string>
  body: Localized<string[]>
}

export interface ChangelogEntry {
  version: string
  date: string
  title: Localized<string>
  notes: Localized<string[]>
}

export interface MetricItem {
  value: string
  label: string
  copy: string
}

export interface DimensionItem {
  label: string
  title: string
  copy: string
  caption: string
}

export interface QuoteItem {
  quote: string
  by: string
  empty?: boolean
}
