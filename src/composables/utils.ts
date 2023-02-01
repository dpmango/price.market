export function useState(initialState: any) {
  let state = initialState as any

  const setState = (newState: any) => {
    state = newState
  }

  return [state, setState]
}
