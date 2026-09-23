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

export interface FeatureItem {
  label: string
  title: string
  copy: string
  unit: string
}

export interface FaqItem {
  q: string
  a: string
}

export interface QuoteItem {
  quote: string
  by: string
}

export interface FactItem {
  k: string
  v: string
}
