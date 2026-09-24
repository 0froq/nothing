<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const copy = useCopy()
const link = useKitLink()
const { product } = useAppConfig()

useHead({
  htmlAttrs: { style: `--brand: ${product.accent.light}; --brand-dark: ${product.accent.dark ?? product.accent.light}` },
  title: () => copy('notFound.title'),
})
</script>

<template>
  <NuxtLayout>
    <Sheet>
      <PageHead
        :kicker="String(props.error.statusCode ?? 404)"
        :title="copy('notFound.title')"
        :lede="copy('notFound.lede')"
        long
      >
        <template #meta>
          <NuxtLink
            class="l-cta"
            :to="link('/')"
            @click.prevent="clearError({ redirect: link('/') })"
          >
            {{ copy('notFound.back') }}
          </NuxtLink>
        </template>
      </PageHead>
    </Sheet>
  </NuxtLayout>
</template>
