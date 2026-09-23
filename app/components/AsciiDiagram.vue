<script setup lang="ts">
export type DiagramType = 'latency' | 'footprint' | 'purity' | 'coverage'

defineProps<{
  type: DiagramType
}>()

const INNER = 33

function box(lines: string[]): string {
  const rule = `+${'-'.repeat(INNER + 2)}+`
  return [rule, ...lines.map(line => `| ${line.padEnd(INNER)} |`), rule].join('\n')
}

const diagrams: Record<DiagramType, string> = {
  latency: box([
    '$ time void()',
    '',
    'real    0m0.000s',
    'user    0m0.000s',
    'sys     0m0.000s',
  ]),
  footprint: box([
    '$ vite build',
    '',
    'dist/void.js          0.00 kB',
    '  gzip                0.00 kB',
    'tree-shaken           100%',
  ]),
  purity: box([
    '$ diff state.before state.after',
    '',
    '(no differences)',
    '',
    'exit 0',
  ]),
  coverage: box([
    '$ vitest --coverage',
    '',
    'lines       0/0        100%',
    'branches    0/0        100%',
    '[####################] 0 failed',
  ]),
}
</script>

<template>
  <div
    class="ascii-diagram text-[10px] text-muted/80 leading-[1.35] py-4 select-none overflow-x-auto group-hover:text-ink"
    aria-hidden="true"
  >
    <pre class="ascii-print m-0 p-0 bg-transparent">{{ diagrams[type] }}</pre>
  </div>
</template>

<style scoped>
.ascii-diagram pre {
  font-family: var(--font-mono);
  font-variant-ligatures: none;
  --print-steps: 7;
}

@media (prefers-reduced-motion: no-preference) {
  .ascii-diagram {
    transition: color 0.3s var(--ease);
  }
}
</style>
