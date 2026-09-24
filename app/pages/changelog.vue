<script setup lang="ts">
const { t, locale } = useI18n()
const copy = useCopy()
const contentPath = useContentPath()

const { data: releases } = await useAsyncData(
  () => `changelog-${locale.value}`,
  () => queryCollection('changelog').where('path', 'LIKE', `${contentPath('/changelog')}/%`).order('date', 'DESC').all(),
)

useHead({ title: () => t('changelog.label') })
</script>

<template>
  <Sheet line>
    <PageHead
      :kicker="copy('changelog.label')"
      :title="copy('changelog.title')"
      :lede="copy('changelog.lede')"
    >
      <template #meta>
        {{ t('changelog.count', { n: releases?.length ?? 0 }) }}
      </template>
    </PageHead>
    <Block
      v-for="(release, index) in releases"
      :id="release.version"
      :key="release.path"
      :label="release.version"
      entry
    >
      <p class="l-kicker">
        {{ release.date }}<template v-if="index === 0">
          · {{ t('changelog.latest') }}
        </template>
      </p>
      <h2 class="l-entry-title">
        <Fill
          :value="release.title"
          :size="12"
        />
      </h2>
      <ContentRenderer
        :value="release"
        class="l-notes"
      />
    </Block>
    <Final
      :title="copy('changelog.end')"
      end
    />
  </Sheet>
</template>
