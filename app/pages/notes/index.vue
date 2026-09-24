<script setup lang="ts">
const { t, locale } = useI18n()
const copy = useCopy()
const link = useKitLink()
const contentPath = useContentPath()

const { data: notes } = await useAsyncData(
  () => `notes-${locale.value}`,
  () => queryCollection('notes').where('path', 'LIKE', `${contentPath('/notes')}/%`).order('date', 'DESC').all(),
)

const slug = (path: string): string => path.split('/').pop() ?? ''

useHead({ title: () => t('notes.label') })
</script>

<template>
  <Sheet line>
    <PageHead
      :kicker="copy('notes.label')"
      :title="copy('notes.title')"
      :lede="copy('notes.lede')"
    >
      <template #meta>
        {{ t('notes.count', { n: notes?.length ?? 0 }) }}
      </template>
    </PageHead>
    <Block
      v-for="note in notes"
      :key="note.path"
      :label="note.date"
      entry
    >
      <NuxtLink
        class="l-entry"
        :to="link(`/notes/${slug(note.path)}`)"
      >
        <h2 class="l-entry-title">
          <Fill
            :value="note.title"
            :size="16"
          />
        </h2>
        <p
          v-if="note.description"
          class="l-copy"
        >
          {{ note.description }}
        </p>
        <span class="l-more">{{ t('notes.read') }} <small>{{ t('notes.minutes', { n: readingMinutes(note.body) }) }}</small></span>
      </NuxtLink>
    </Block>
    <Final
      :title="copy('notes.end')"
      end
    />
  </Sheet>
</template>
