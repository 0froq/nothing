import type { Post } from '~/types'

export const posts: Post[] = [
  {
    slug: 'shipping-void',
    date: '2026-09-19',
    title: {
      en: 'How we shipped void on schedule',
      zh: '我们如何按期交付 void',
    },
    excerpt: {
      en: 'A launch review with no incidents, no rollbacks and a very short diff.',
      zh: '一次没有事故、没有回滚、diff 极短的上线复盘。',
    },
    body: {
      en: [
        'We committed to shipping something by Friday. During planning, the riskiest part of the plan was the something, so we removed it and kept the rest of the scope.',
        'What remained passed review on the first pass. There was no telemetry to approve, no migration to schedule and no feature flag to clean up later. The diff was empty and nobody requested changes.',
        'We deployed at 16:59. The dashboards stayed flat through the weekend. This review is the only artifact the launch produced.',
      ],
      zh: [
        '我们承诺周五前交付点什么。评估风险时，整份计划里最危险的部分就是那个「什么」，于是我们把它拿掉，其余范围保持不变。',
        '剩下的部分一次就通过了评审：没有埋点要审批，没有数据迁移要排期，也没有日后要清理的 feature flag。diff 是空的，没有人提修改意见。',
        '我们在 16:59 完成部署，整个周末监控曲线都很平。这篇复盘是这次上线唯一的产物。',
      ],
    },
  },
  {
    slug: 'void-as-a-service',
    date: '2026-09-12',
    title: {
      en: 'Void as a Service',
      zh: 'Void as a Service',
    },
    excerpt: {
      en: 'How void reaches 0 ms in every region, without caching or edge compute.',
      zh: 'void 如何在所有区域做到 0 ms，而且没有用缓存，也没有用边缘计算。',
    },
    body: {
      en: [
        'The usual way to cut latency is caching, edge compute and a long evening with a flame graph. We skipped all three and removed the work instead. A request that asks for nothing can be answered before it arrives.',
        'We benchmarked void against the leading platforms. Every metric converged to zero, which made the charts unusually easy to read.',
        'There is no status page. Nothing can degrade, so the page would only ever say one thing.',
      ],
      zh: [
        '降低延迟的常规办法是缓存、边缘计算，再对着火焰图熬一个晚上。我们三样都没做，而是把工作本身删掉了。一个什么都不要的请求，可以在它抵达之前就被答复。',
        '我们拿 void 和主流平台做了基准测试。所有指标都收敛到零，图表因此异常易读。',
        '我们没有状态页。没有东西会降级，那个页面永远只会写同一句话。',
      ],
    },
  },
]
