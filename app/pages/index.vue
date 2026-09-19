<script setup lang="ts">
import type { DimensionItem, MetricItem, QuoteItem } from '~/types'

const { t, tm } = useI18n()
const { vanish } = useVanish()
const localePath = useLocalePath()

useSeoMeta({
  title: () => t('meta.title'),
  description: () => t('meta.description'),
})

const proofItems = computed(() => tm('proof.items') as MetricItem[])
const dimensionItems = computed(() => tm('dimensions.items') as DimensionItem[])
const quoteItems = computed(() => tm('quotes.items') as QuoteItem[])
const demoList = computed(() => tm('demo.list') as string[])
const priceItems = computed(() => tm('pricing.items') as string[])

const featuredDimension = computed(() => dimensionItems.value[0] ?? {
  label: '',
  title: '',
  copy: '',
  caption: '',
})
const restDimensions = computed(() => dimensionItems.value.slice(1))
</script>

<template>
  <div>
    <section class="page-shell pb-20 pt-16 min-h-[calc(100dvh-3.5rem)] md:pb-28 md:pt-20">
      <div class="gap-12 grid lg:grid-cols-[minmax(0,1.2fr)_minmax(12rem,0.55fr)] lg:items-start">
        <div>
          <h1 class="text-[clamp(72px,14vw,168px)] leading-[0.78] tracking-[-0.07em] font-medium m-0">
            {{ t('hero.word') }}
          </h1>
          <p class="text-[clamp(18px,2vw,28px)] leading-[1.28] tracking-[-0.03em] m-0 mt-8 max-w-[36rem]">
            {{ t('hero.lede') }}
          </p>
          <div class="mt-10 flex flex-wrap gap-3 items-center">
            <InkButton @click="vanish">
              {{ t('hero.cta') }}
            </InkButton>
            <NuxtLink
              :to="localePath('/#proof')"
              class="text-[14px] text-muted px-2 no-underline inline-flex min-h-11 items-center hover:text-ink"
            >
              {{ t('hero.inspect') }}
            </NuxtLink>
          </div>
        </div>
        <HairlineFrame class="min-h-[22rem] hidden relative lg:block">
          <p class="text-[10px] text-muted tracking-[0.14em] m-0 uppercase left-4 top-4 absolute font-mono">
            {{ t('demo.label') }}
          </p>
        </HairlineFrame>
      </div>
    </section>

    <section
      id="proof"
      class="page-shell py-24 border-t border-line scroll-mt-20"
    >
      <h2 class="text-[clamp(32px,4.4vw,56px)] leading-[1.02] tracking-[-0.045em] font-normal m-0 max-w-[22ch]">
        {{ t('proof.title') }}
      </h2>
      <div class="mt-16 gap-10 grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
        <div>
          <p class="text-[clamp(120px,18vw,220px)] leading-[0.72] tracking-[-0.08em] m-0">
            0
          </p>
          <p class="text-[11px] text-muted tracking-[0.14em] m-0 mt-4 uppercase font-mono">
            {{ t('proof.benchmark') }}
          </p>
        </div>
        <ul class="m-0 p-0 list-none">
          <li
            v-for="item in proofItems"
            :key="item.label"
            class="py-5 border-t border-line gap-6 grid grid-cols-[5.5rem_1fr]"
          >
            <p class="text-[22px] tracking-[-0.04em] m-0 font-mono">
              {{ item.value }}
            </p>
            <div>
              <p class="text-[11px] text-muted tracking-[0.12em] m-0 mb-2 uppercase font-mono">
                {{ item.label }}
              </p>
              <p class="text-[15px] text-muted m-0 max-w-[42ch]">
                {{ item.copy }}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <section class="page-shell py-24 border-t border-line">
      <h2 class="text-[clamp(32px,4.4vw,56px)] leading-[1.02] tracking-[-0.045em] font-normal m-0 max-w-[20ch]">
        {{ t('dimensions.title') }}
      </h2>
      <article class="mt-16 py-10 border-t border-ink">
        <p class="text-[11px] text-muted tracking-[0.14em] m-0 mb-4 uppercase font-mono">
          {{ featuredDimension.label }}
        </p>
        <h3 class="text-[clamp(28px,4vw,48px)] leading-[1.05] tracking-[-0.04em] font-normal m-0 mb-4 max-w-[18ch]">
          {{ featuredDimension.title }}
        </h3>
        <p class="text-muted m-0 max-w-[42ch]">
          {{ featuredDimension.copy }}
        </p>
        <p class="text-[11px] text-wry m-0 mt-8 font-mono">
          {{ featuredDimension.caption }}
        </p>
      </article>
      <div class="gap-8 grid md:grid-cols-3">
        <article
          v-for="item in restDimensions"
          :key="item.label"
          class="pt-6 border-t border-line"
        >
          <p class="text-[11px] text-muted tracking-[0.14em] m-0 mb-3 uppercase font-mono">
            {{ item.label }}
          </p>
          <h3 class="text-[22px] leading-[1.15] tracking-[-0.03em] font-normal m-0 mb-3">
            {{ item.title }}
          </h3>
          <p class="text-[15px] text-muted m-0 mb-6">
            {{ item.copy }}
          </p>
          <p class="text-[11px] text-wry m-0 font-mono">
            {{ item.caption }}
          </p>
        </article>
      </div>
    </section>

    <section class="page-shell py-24 border-t border-line">
      <h2 class="text-[clamp(32px,4.4vw,56px)] leading-[1.02] tracking-[-0.045em] font-normal m-0 max-w-[22ch]">
        {{ t('demo.title') }}
      </h2>
      <HairlineFrame
        dashed
        class="mt-12 min-h-[18rem] relative md:min-h-[28rem]"
      >
        <p class="text-[10px] text-muted tracking-[0.14em] m-0 uppercase left-5 top-4 absolute font-mono">
          {{ t('demo.label') }}
        </p>
        <p class="text-[10px] text-muted tracking-[0.12em] m-0 uppercase bottom-4 right-5 absolute font-mono">
          {{ t('demo.size') }}
        </p>
      </HairlineFrame>
      <div class="mt-10 gap-8 grid md:grid-cols-[1.2fr_0.8fr] md:items-start">
        <p class="text-muted m-0 max-w-[42ch]">
          {{ t('demo.copy') }}
        </p>
        <ul class="text-[12px] tracking-[0.04em] m-0 p-0 list-none font-mono">
          <li
            v-for="line in demoList"
            :key="line"
            class="py-2.5 border-t border-line"
          >
            {{ line }}
          </li>
        </ul>
      </div>
    </section>

    <section class="page-shell py-24 border-t border-line">
      <h2 class="text-[clamp(32px,4.4vw,56px)] leading-[1.02] tracking-[0.045em] font-normal m-0 max-w-[16ch]">
        {{ t('quotes.title') }}
      </h2>
      <div class="mt-12 max-w-[42rem]">
        <blockquote
          v-for="item in quoteItems"
          :key="item.by"
          class="m-0 py-8 border-t border-line"
        >
          <p
            class="text-[clamp(22px,3vw,34px)] leading-[1.2] tracking-[-0.03em] m-0"
            :class="item.empty ? 'text-muted/30 select-none' : ''"
          >
            {{ item.empty ? '“ ”' : `“${item.quote}”` }}
          </p>
          <p class="text-[11px] text-muted tracking-[0.08em] m-0 mt-5 uppercase font-mono">
            - {{ item.by }}
          </p>
        </blockquote>
      </div>
    </section>

    <section
      id="pricing"
      class="page-shell py-24 border-t border-line gap-12 grid lg:grid-cols-[1fr_auto] lg:items-end"
    >
      <div>
        <h2 class="text-[clamp(32px,4.4vw,56px)] leading-[1.02] tracking-[-0.045em] font-normal m-0">
          {{ t('pricing.title') }}
        </h2>
        <p class="text-muted m-0 mt-5 max-w-[36rem]">
          {{ t('pricing.lede') }}
        </p>
        <ul class="text-[12px] m-0 mt-8 p-0 list-none max-w-[22rem] font-mono">
          <li
            v-for="line in priceItems"
            :key="line"
            class="text-muted py-2.5 border-t border-line line-through"
          >
            {{ line }}
          </li>
        </ul>
      </div>
      <div>
        <p class="text-[clamp(96px,14vw,168px)] leading-[0.72] tracking-[-0.08em] m-0">
          <sup class="text-[0.18em] mr-1 align-top">$</sup>{{ t('pricing.price') }}<span class="text-[14px] text-muted tracking-[0.08em] font-mono">{{ t('pricing.period') }}</span>
        </p>
        <div class="mt-8">
          <InkButton @click="vanish">
            {{ t('pricing.cta') }}
          </InkButton>
        </div>
      </div>
    </section>

    <section class="text-paper bg-ink">
      <div class="page-shell py-24 md:py-32">
        <h2 class="text-[clamp(48px,9vw,128px)] leading-[0.86] tracking-[-0.07em] font-normal m-0">
          {{ t('final.title') }}
        </h2>
        <p class="text-[18px] text-paper/70 m-0 mt-6 max-w-[34rem]">
          {{ t('final.lede') }}
        </p>
      </div>
    </section>
  </div>
</template>
