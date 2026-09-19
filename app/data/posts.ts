import type { Post } from '~/types'

export const posts: Post[] = [
  {
    slug: 'shipping-nothing',
    date: '2026-09-19',
    title: {
      en: 'How we shipped nothing, on schedule',
      zh: '我们如何准时把 nothing 做出来',
    },
    excerpt: {
      en: 'A brief postmortem of a launch with no product, no incident, and no remaining work.',
      zh: '一次没有产品、没有事故、也没有剩余工作的上线复盘。',
    },
    body: {
      en: [
        'We had promised to ship something today. The most fragile part of that plan was the something. Removing it was, in retrospect, the only architectural decision that survived review.',
        'Nothing required no onboarding, no feature flags, and no “powered by AI” footnote. The demo is empty because the product is empty. This is not a placeholder. It is the complete surface.',
        'If you were hoping for a roadmap: we have one. It is this page, plus the space around it.',
      ],
      zh: [
        '我们说过今天要交出点什么。那份计划里最脆弱的部分，正是那个“什么”。事后看，把它拿掉是唯一通过评审的架构决策。',
        'Nothing 不需要引导、不需要 feature flag，也不需要“由 AI 驱动”的脚注。演示是空的，因为产品是空的。这不是占位，这就是完整界面。',
        '如果你在等路线图：我们有。就是这一页，以及它周围的空白。',
      ],
    },
  },
  {
    slug: 'zero-as-a-service',
    date: '2026-09-12',
    title: {
      en: 'Zero as a service',
      zh: '零即服务',
    },
    excerpt: {
      en: 'Latency is 0 ms because nothing happens. A bold technical direction, and also the only honest one.',
      zh: '延迟是 0 ms，因为什么都没发生。这是大胆的技术方向，也是唯一诚实的方向。',
    },
    body: {
      en: [
        'People keep asking how we achieved 0 ms latency. The answer is unfashionable: we declined to start the work that would have produced a wait.',
        'Benchmarks against other products are available. They are all zero, which makes the chart unusually readable.',
        'We will not be adding a status page. There is nothing to status.',
      ],
      zh: [
        '总有人问我们如何做到 0 ms 延迟。答案并不时髦：我们拒绝开始那些会产生等待的工作。',
        '和其他产品的对比基准都在。数字全是零，所以图表出奇地好读。',
        '我们不会做状态页。没有什么可状态的。',
      ],
    },
  },
]
