<script setup lang="ts">
defineProps<{
  price: string
  period: string
  cta: string
}>()

const emit = defineEmits<{
  (e: 'action'): void
}>()

const INNER = 37

function row(left: string, right = ''): string {
  return `| ${left.padEnd(INNER - right.length)}${right} |`
}

const rule = `+${'-'.repeat(INNER + 2)}+`

const table = [
  rule,
  row('ITEM', 'AMOUNT'),
  rule,
  row('01  void, lifetime license', '$0.00'),
  row('02  setup', '$0.00'),
  row('03  support', '$0.00'),
  row('04  updates', '$0.00'),
  rule,
  row('TOTAL', '$0.00'),
  rule,
].join('\n')
</script>

<template>
  <div class="receipt-edge p-px bg-line max-w-[28rem] w-full">
    <div class="receipt-edge ascii-receipt px-5 pb-9 pt-5 bg-paper sm:px-6 sm:pt-6">
      <div
        class="label-xs mb-4 pb-3 border-b border-line flex select-none justify-between"
        aria-hidden="true"
      >
        <span>INVOICE #0000</span>
        <span>USD</span>
      </div>

      <pre
        class="ascii-print text-[11px] text-ink/85 leading-[1.4] m-0 p-0 select-none whitespace-pre overflow-x-auto"
        aria-hidden="true"
      >{{ table }}</pre>

      <div class="mt-5 pt-4 border-t border-line flex flex-col gap-4 justify-between sm:flex-row sm:items-end">
        <div>
          <span class="label-xs block">TOTAL</span>
          <div class="text-[40px] text-ink leading-none tracking-[-0.03em] mt-2 flex items-baseline font-serif">
            <span class="text-[20px] mr-0.5 self-start">$</span>{{ price }}
            <span class="label-xs ml-2 normal-case">{{ period }}</span>
          </div>
        </div>
        <InkButton @click="emit('action')">
          {{ cta }}
        </InkButton>
      </div>

      <div
        class="label-xs mt-4 pt-3 border-t border-line flex select-none justify-between"
        aria-hidden="true"
      >
        <span>THANK YOU</span>
        <span class="text-signal">PAID</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.receipt-edge {
  --tear: 7px;
  mask:
    linear-gradient(#000 0 0) top / 100% calc(100% - var(--tear)) no-repeat,
    conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom / calc(var(--tear) * 2)
      var(--tear) repeat-x;
}

.ascii-receipt pre {
  font-family: var(--font-mono);
  font-variant-ligatures: none;
  --print-steps: 10;
}
</style>
