---
title: void. The product that returns nothing.
description: void is a product with zero bytes, zero side effects and zero features.
head: false
---

::hero
---
tagline: i shipped nothing.
lede: void is a product with zero bytes, zero side effects and zero features. Every call returns on time.
---
::

::block
---
id: specs
label: Specs
title: Four measurements. All zero.
---
  :::figures
  ---
  items:
    - { value: '0', unit: ms, label: Latency, copy: 'No work is scheduled, so nothing waits.' }
    - { value: '0', unit: B, label: Footprint, copy: Fully tree-shakeable. Nothing remains in your bundle. }
    - { value: '0', unit: writes, label: Side effects, copy: 'It reads nothing, writes nothing, requests nothing.' }
    - { value: '0', unit: errors, label: Reliability, copy: There is no failure path because there is no code path. }
  ---
  :::
::

::block{id="statement" label="Principle"}
  :::statement
  ---
  lines:
    - Functions return void.
    - So does the product.
  ---
  :::
::

::block{id="quotes" label="Reviews"}
  :::quotes
  ---
  items:
    - quote: We replaced an entire service with void. Nobody on call has noticed.
      by: Staff engineer, fintech
    - quote: The build is faster, the bundle is smaller, and there is nothing left to review.
      by: Frontend lead, design studio
    - quote: The first dependency I have added that made the project simpler.
      by: Independent developer
  ---
  :::
::

::block{id="pricing" label="Pricing"}
  :::price
  ---
  price: $0
  period: forever
  lede: One plan, no tiers. There is no usage to meter and no seat to count.
  facts:
    - { label: Seats, value: Unlimited }
    - { label: Usage, value: Unmetered }
    - { label: Contract, value: None }
    - { label: Card, value: Not required }
  ---
  :::
::

::block{id="faq" label="Q&A"}
  :::faq
  ---
  items:
    - { q: 'What does `void()` return?', a: 'Nothing. On time, every time.' }
    - { q: Does it work with my stack?, a: Any language that can express doing nothing is supported. Most offer several ways. }
    - { q: Is there a paid tier?, a: No. There is nothing to charge for. }
    - { q: Can I get a refund?, a: Yes. It has already been processed. }
    - { q: What is on the roadmap?, a: Nothing new. We do not plan to ship breaking changes. }
  ---
  :::
::

::final
---
id: install
title: ship void.
lede: No configuration, no maintenance, no migration to plan.
---
::
