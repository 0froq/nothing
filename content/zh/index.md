---
title: void. 一款什么都不返回的产品
description: void 零字节、零副作用、零功能。
head: false
---

::hero
---
tagline: i shipped nothing.
lede: void 零字节、零副作用、零功能。每次调用都准时返回。
---
::

::block
---
id: specs
label: 规格
title: 四项指标，全部为零。
---
  :::figures
  ---
  items:
    - { value: '0', unit: ms, label: 延迟, copy: 没有任务被调度，也就没有等待。 }
    - { value: '0', unit: B, label: 体积, copy: 完全支持 tree-shaking，打包产物里不留任何部分。 }
    - { value: '0', unit: 次写入, label: 副作用, copy: 不读、不写，也不发起任何请求。 }
    - { value: '0', unit: 个错误, label: 可靠性, copy: 没有代码路径，也就没有失败路径。 }
  ---
  :::
::

::block{label="原则"}
  :::statement
  ---
  lines:
    - 函数返回 void。
    - 产品也是。
  ---
  :::
::

::block{label="评价"}
  :::quotes
  ---
  items:
    - quote: 我们把一整个服务换成了 void，值班的同事至今没有察觉。
      by: 资深工程师，金融科技
    - quote: 构建更快，产物更小，也没有什么需要评审的了。
      by: 前端负责人，设计工作室
    - quote: 这是我加过的依赖里，第一个让项目变得更简单的。
      by: 独立开发者
  ---
  :::
::

::block{id="pricing" label="价格"}
  :::price
  ---
  price: $0
  period: 永久
  lede: 只有一种方案，不分档位。没有用量需要计量，也没有席位需要统计。
  facts:
    - { label: 席位, value: 不限 }
    - { label: 用量, value: 不计量 }
    - { label: 合同, value: 无 }
    - { label: 信用卡, value: 无需 }
  ---
  :::
::

::block{label="Q&A"}
  :::faq
  ---
  items:
    - { q: '`void()` 会返回什么？', a: 什么都不返回，每次都准时。 }
    - { q: 能接入我的技术栈吗？, a: 只要你的语言能表达「什么都不做」，就已经支持。大多数语言还不止一种写法。 }
    - { q: 有付费版吗？, a: 没有。没有可以收费的东西。 }
    - { q: 能退款吗？, a: 可以，已经退回了。 }
    - { q: 路线图上有什么？, a: 没有新东西。我们不打算发布破坏性变更。 }
  ---
  :::
::

::final
---
id: install
title: ship void.
lede: 无需配置，无需维护，也无需规划迁移。
---
::
