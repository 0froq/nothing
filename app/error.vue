<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

const is404 = computed(() => props.error.statusCode === 404)
const code = computed(() => String(props.error.statusCode || 500))

useSeoMeta({
  title: () => `${code.value}: void`,
  robots: 'noindex',
})
</script>

<template>
  <NuxtLayout>
    <article class="prose-shell py-16 md:py-24">
      <TerminalBar
        :command="`cat ${route.path}`"
        :status="`EXIT ${code}`"
      />

      <p
        class="text-[clamp(120px,24vw,260px)] leading-[0.8] tracking-[-0.06em] m-0 mt-10 italic font-serif"
        aria-hidden="true"
      >
        {{ code }}<span class="text-signal">.</span>
      </p>

      <p class="label mt-10 normal-case">
        <span class="text-signal">{{ is404 ? 'ENOENT' : 'EFAIL' }}</span>
        <template v-if="is404">
          : no such file or directory, {{ route.path }}
        </template>
      </p>

      <h1 class="display-2 mt-6">
        {{ is404 ? t('error.notFound') : t('error.generic') }}
      </h1>
      <p class="lede mt-5">
        {{ t('error.lede') }}
      </p>

      <div class="mt-10">
        <InkButton :to="localePath('/')">
          {{ t('error.back') }}
        </InkButton>
      </div>
    </article>
  </NuxtLayout>
</template>
