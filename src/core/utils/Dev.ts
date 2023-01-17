const lastTime = new Date().getTime()

export const PerformanceLog = (DEV_perf: number, name: string, fromStart?: boolean) => {
  const DEV_perf_end = performance.now()

  const fromStartTag = fromStart
    ? `:: fromstart ${(new Date().getTime() - lastTime).toFixed(2)} ms`
    : ''

  // eslint-disable-next-line no-console
  console.log(`PERF :: ${name} :: ${(DEV_perf_end - DEV_perf).toFixed(2)} ms ${fromStartTag}`)
}
