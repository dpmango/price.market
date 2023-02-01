<script lang="ts">
  import 'virtual:svg-icons-register'
  import cns from 'classnames'
  export let prefix = 'icon'
  export let name: string
  export let classname: string | null = null

  const symbolId = `#${prefix}-${name}`
</script>

<svg class={cns('svg-icon', classname)} aria-hidden="true" {...$$restProps}>
  <use href={symbolId} />
</svg>

<style lang="scss">
  .svg-icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    line-height: 1;
  }
</style>
