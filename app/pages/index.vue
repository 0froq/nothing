<script setup lang="ts">
import type { DiagramType } from '~/components/AsciiDiagram.vue'
import type { FactItem, FaqItem, FeatureItem, QuoteItem } from '~/types'
import { changelog } from '~/data/changelog'

const { t, tm, rt, locale } = useI18n()
const { vanish } = useVanish()

useSeoMeta({
  title: () => t('meta.title'),
  description: () => t('meta.description'),
})

function list(key: string): unknown[] {
  void locale.value
  const raw = tm(key)
  return Array.isArray(raw) ? raw : Object.values(raw ?? {})
}

function text(value: unknown): string {
  if (typeof value === 'string' || value == null)
    return value ?? ''
  return rt(value as never)
}

function field(row: unknown, key: string): string {
  return text((row as Record<string, unknown>)[key])
}

const version = changelog[0]?.version ?? 'v0.0.0'

const tickerItems = computed(() => list('ticker').map((item) => {
  const [key = '', ...rest] = text(item).split(/[:：]/)
  return { key: key.trim(), value: rest.join(':').trim() }
}))
const tickerBatch = computed(() => [...tickerItems.value, ...tickerItems.value])

const featureItems = computed(() => list('features.items').map((row): FeatureItem => ({
  label: field(row, 'label'),
  title: field(row, 'title'),
  copy: field(row, 'copy'),
  unit: field(row, 'unit'),
})))

/** Where each spec starts before it settles at zero */
const featureSpecs: { diagram: DiagramType, from: number }[] = [
  { diagram: 'latency', from: 212 },
  { diagram: 'footprint', from: 148213 },
  { diagram: 'purity', from: 36 },
  { diagram: 'coverage', from: 17 },
]

const quoteItems = computed(() => list('quotes.items').map((row): QuoteItem => ({
  quote: field(row, 'quote'),
  by: field(row, 'by'),
})))

const priceFacts = computed(() => list('pricing.facts').map((row): FactItem => ({
  k: field(row, 'k'),
  v: field(row, 'v'),
})))

const faqItems = computed(() => list('faq.items').map((row): FaqItem => ({
  q: field(row, 'q'),
  a: field(row, 'a'),
})))

function codeParts(value: string): { text: string, code: boolean }[] {
  return value.split('`').map((part, i) => ({ text: part, code: i % 2 === 1 })).filter(part => part.text)
}

useReveal()
</script>

<template>
  <div>
    <div
      class="remaining"
      aria-hidden="true"
    >
      <p class="remaining-label">
        {{ t('remaining') }}
      </p>
      <div class="remaining-track" />
    </div>

    <!-- Hero: the canvas renders both words; these spans are layout anchors -->
    <section class="flex select-none items-center justify-center relative overflow-hidden min-h-dvh">
      <h1
        class="m-0 text-center flex flex-col items-center justify-center relative z-10"
        :aria-label="`${t('hero.introducing')} ${t('hero.word')}`"
      >
        <span
          class="text-[clamp(18px,2.6vw,32px)] leading-[1] tracking-[0.32em] font-normal min-h-[1.4em] block font-mono"
          aria-hidden="true"
          data-ascii-intro
        >{{ t('hero.introducing') }}</span>
        <span
          class="hero-word mt-6 block"
          aria-hidden="true"
          data-ascii-word
        >{{ t('hero.word') }}</span>
      </h1>

      <div
        class="hero-foot label-xs page-shell pb-6 flex items-end bottom-0 left-0 right-0 justify-between absolute"
        aria-hidden="true"
      >
        <span><span class="text-signal">{{ version }}</span> · {{ t('hero.tagline') }}</span>
        <span>{{ t('hero.scroll') }} <span class="hero-scroll-arrow text-ink">↓</span></span>
      </div>
    </section>

    <!-- Ticker -->
    <div
      class="ticker label py-3.5 border-y border-line bg-paper/60 flex select-none overflow-hidden backdrop-blur-xs"
      aria-hidden="true"
    >
      <div class="ticker-track whitespace-nowrap">
        <div
          v-for="group in 2"
          :key="group"
          class="flex shrink-0 items-center"
        >
          <span
            v-for="(item, index) in tickerBatch"
            :key="`${group}-${index}`"
            class="flex shrink-0 items-center"
          >
            <span>{{ item.key }}</span>
            <span
              v-if="item.value"
              class="text-ink ml-2"
            >{{ item.value }}</span>
            <span class="text-signal mx-7">/</span>
          </span>
        </div>
      </div>
    </div>

    <!-- 01 Specs -->
    <section
      id="proof"
      class="page-shell py-24 scroll-mt-14 md:py-32"
    >
      <SectionHead
        index="01"
        :label="t('features.label')"
        meta="void(): void"
        :title="t('features.title')"
      />

      <div
        v-spotlight
        class="mt-14 panel-grid lg:grid-cols-4 sm:grid-cols-2"
      >
        <article
          v-for="(item, index) in featureItems"
          :key="item.label"
          class="group p-6 bg-paper flex flex-col min-h-[23rem] justify-between"
        >
          <div
            class="reveal"
            :style="{ '--reveal-delay': `${index * 80}ms` }"
          >
            <div class="label pb-3 border-b border-line">
              <span class="text-signal">0{{ index + 1 }}</span> / {{ item.label }}
            </div>
            <AsciiDiagram :type="featureSpecs[index]?.diagram ?? 'latency'" />
            <h3 class="title mt-2">
              {{ item.title }}
            </h3>
            <p class="copy-sm mt-3">
              {{ item.copy }}
            </p>
          </div>

          <div
            class="reveal mt-6 pt-3 border-t border-line flex items-baseline justify-end"
            :style="{ '--reveal-delay': `${index * 80 + 160}ms` }"
          >
            <CountZero
              class="text-[15px] text-ink tracking-[-0.01em] font-mono"
              :from="featureSpecs[index]?.from ?? 0"
              :unit="item.unit"
            />
          </div>
        </article>
      </div>
    </section>

    <!-- 02 Principle -->
    <section class="section-shell">
      <AsciiDivider
        section="02"
        :label="t('statement.label')"
      />

      <div class="py-14 md:py-20">
        <p class="reveal display-xl">
          {{ t('statement.a') }}
        </p>
        <p
          class="reveal display-xl text-muted mt-2 text-right italic"
          style="--reveal-delay: 140ms"
        >
          <TypeLine :text="t('statement.b')" />
        </p>
      </div>

      <div
        class="reveal label pt-4 border-t border-line gap-2 grid sm:grid-cols-3"
        style="--reveal-delay: 220ms"
      >
        <span><span class="text-signal">✓</span> pure</span>
        <span class="sm:text-center"><span class="text-signal">✓</span> idempotent</span>
        <span class="sm:text-right"><span class="text-signal">✓</span> never throws</span>
      </div>
    </section>

    <!-- 03 Reviews -->
    <section class="section-shell">
      <SectionHead
        index="03"
        :label="t('quotes.label')"
        :title="t('quotes.title')"
      />

      <div
        v-spotlight
        class="mt-14 panel-grid md:grid-cols-3"
      >
        <blockquote
          v-for="(item, index) in quoteItems"
          :key="item.by"
          class="m-0 p-6 bg-paper flex flex-col min-h-[17rem] justify-between"
        >
          <div class="label-xs pb-3 border-b border-line flex justify-between">
            <span>0{{ index + 1 }}</span>
            <span class="text-signal">5/5</span>
          </div>

          <p
            class="reveal title-lg my-8"
            :style="{ '--reveal-delay': `${index * 80}ms` }"
          >
            “{{ item.quote }}”
          </p>

          <div
            class="reveal label-xs pt-3 border-t border-line"
            :style="{ '--reveal-delay': `${index * 80 + 160}ms` }"
          >
            — {{ item.by }}
          </div>
        </blockquote>
      </div>
    </section>

    <!-- 04 Pricing -->
    <section
      id="pricing"
      class="section-shell"
    >
      <SectionHead
        index="04"
        :label="t('pricing.label')"
        :title="t('pricing.title')"
      />

      <div class="mt-14 gap-12 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-start">
        <div class="min-w-0">
          <p class="reveal lede">
            {{ t('pricing.lede') }}
          </p>

          <dl class="m-0 mt-10 max-w-[28rem]">
            <div
              v-for="(fact, index) in priceFacts"
              :key="fact.k"
              class="reveal text-[13px] py-3 border-t border-line flex items-center justify-between font-mono last:border-b"
              :style="{ '--reveal-delay': `${index * 60}ms` }"
            >
              <dt class="text-muted">
                {{ fact.k }}
              </dt>
              <dd class="text-ink m-0">
                {{ fact.v }}
              </dd>
            </div>
          </dl>

          <p class="reveal copy-sm mt-8 pl-4 border-l border-signal max-w-[30rem]">
            {{ t('pricing.enterprise') }}
          </p>
        </div>

        <div
          class="reveal flex justify-start lg:justify-end"
          style="--reveal-delay: 120ms"
        >
          <AsciiReceipt
            :price="t('pricing.price')"
            :period="t('pricing.period')"
            :cta="t('hero.cta')"
            @action="vanish"
          />
        </div>
      </div>
    </section>

    <!-- 05 Q&A -->
    <section class="section-shell">
      <SectionHead
        index="05"
        :label="t('faq.label')"
        :title="t('faq.title')"
      />

      <dl class="m-0 mt-14 border-t border-line">
        <div
          v-for="(item, index) in faqItems"
          :key="item.q"
          class="reveal group py-7 border-b border-line gap-3 grid items-baseline md:gap-8 md:grid-cols-2"
          :style="{ '--reveal-delay': `${index * 60}ms` }"
        >
          <dt class="m-0 flex gap-5 items-baseline">
            <span
              class="label text-signal shrink-0 w-7"
              aria-hidden="true"
            >0{{ index + 1 }}</span>
            <span class="title transition-colors duration-300 group-hover:text-signal">
              <template
                v-for="(part, i) in codeParts(item.q)"
                :key="i"
              >
                <code
                  v-if="part.code"
                  class="inline-code"
                >{{ part.text }}</code>
                <template v-else>{{ part.text }}</template>
              </template>
            </span>
          </dt>
          <dd class="text-[15px] text-muted leading-[1.6] m-0 pl-12 md:pl-0">
            <template
              v-for="(part, i) in codeParts(item.a)"
              :key="i"
            >
              <code
                v-if="part.code"
                class="inline-code"
              >{{ part.text }}</code>
              <template v-else>
                {{ part.text }}
              </template>
            </template>
          </dd>
        </div>
      </dl>
    </section>

    <!-- Final CTA -->
    <section class="border-t border-line relative overflow-hidden">
      <div
        class="label-xs text-muted/60 py-3 text-center border-b border-line select-none whitespace-nowrap normal-case overflow-hidden"
        aria-hidden="true"
      >
        $ pnpm add void
      </div>

      <div class="page-shell py-28 text-center md:py-40">
        <h2 class="reveal text-[clamp(64px,13vw,184px)] leading-[0.86] tracking-[-0.06em] font-normal m-0 italic font-serif">
          {{ t('final.title') }}
        </h2>
        <p
          class="reveal text-[18px] text-muted leading-[1.6] m-0 mx-auto mt-8 max-w-[34rem]"
          style="--reveal-delay: 100ms"
        >
          {{ t('final.lede') }}
        </p>
        <div
          class="reveal mt-12 flex flex-col gap-5 items-center"
          style="--reveal-delay: 180ms"
        >
          <InkButton @click="vanish">
            {{ t('hero.cta') }}
          </InkButton>
          <span class="label-xs text-muted/60">
            {{ t('final.note') }}
          </span>
        </div>
      </div>

      <div
        class="final-rule border-t border-line h-6"
        aria-hidden="true"
      />
    </section>
  </div>
</template>

<style scoped>
.inline-code {
  font-family: var(--font-mono);
  font-size: 0.82em;
  letter-spacing: -0.02em;
}

.final-rule {
  background-image: repeating-linear-gradient(to right, var(--line) 0 6px, transparent 6px 12px);
  background-size: 100% 1px;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
