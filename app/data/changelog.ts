import type { ChangelogEntry } from '~/types'

export const changelog: ChangelogEntry[] = [
  {
    version: 'v0.0.1',
    date: '2026-09-19',
    title: {
      en: 'Nothing changed, but faster',
      zh: '什么都没改，但更快了',
    },
    notes: {
      en: [
        'Removed several SVG illustrations that were trying too hard to depict absence.',
        'Added a public site, which still contains nothing.',
        'Performance remains 0 ms. We checked.',
      ],
      zh: [
        '删掉了几张过于努力描绘“空”的 SVG。',
        '上线了站点。里面仍然什么都没有。',
        '性能仍是 0 ms。我们核对过。',
      ],
    },
  },
  {
    version: 'v0.0.0',
    date: '2026-09-01',
    title: {
      en: 'Nothing changed',
      zh: '什么都没改',
    },
    notes: {
      en: [
        'Initial release of nothing.',
        'Feature count: 0.',
        'Known issues: none, because there is no surface for issues to attach to.',
      ],
      zh: [
        'nothing 的首次发布。',
        '功能数量：0。',
        '已知问题：无。没有可供问题附着的表面。',
      ],
    },
  },
]
