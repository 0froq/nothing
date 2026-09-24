---
title: Void as a Service
description: How void reaches 0 ms in every region, without caching or edge compute.
date: '2026-09-12'
---

The usual way to cut latency is caching, edge compute and a long evening with a flame graph. We skipped all three and removed the work instead. A request that asks for nothing can be answered before it arrives.

We benchmarked void against the leading platforms. Every metric converged to zero, which made the charts unusually easy to read.

There is no status page. Nothing can degrade, so the page would only ever say one thing.
