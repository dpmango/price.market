export function useState(initialState: any) {
  const state = ref<any>(initialState)
  const setState = (newState: any) => {
    state.value = newState
  }

  return [readonly(state), setState]
}
