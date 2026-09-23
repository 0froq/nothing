import type { ChangelogEntry } from '~/types'

export const changelog: ChangelogEntry[] = [
  {
    version: 'v0.1.0',
    date: '2026-09-22',
    title: {
      en: 'Renamed to void',
      zh: '更名为 void',
    },
    notes: {
      en: [
        'Renamed from nothing to void. Behavior is unchanged.',
        'The new name is three characters shorter, which reduces the product by 43%.',
        'No migration required.',
      ],
      zh: [
        '由 nothing 更名为 void，行为不变。',
        '新名字少了 3 个字符，产品因此缩小了 43%。',
        '无需迁移。',
      ],
    },
  },
  {
    version: 'v0.0.1',
    date: '2026-09-19',
    title: {
      en: 'Removed side effects',
      zh: '移除副作用',
    },
    notes: {
      en: [
        'Removed the last remaining side effect.',
        'Latency holds at 0 ms.',
      ],
      zh: [
        '移除了最后一个副作用。',
        '延迟保持在 0 ms。',
      ],
    },
  },
  {
    version: 'v0.0.0',
    date: '2026-09-01',
    title: {
      en: 'Initial release',
      zh: '首次发布',
    },
    notes: {
      en: [
        'Initial release.',
        'Known issues: none.',
      ],
      zh: [
        '首次发布。',
        '已知问题：无。',
      ],
    },
  },
]
