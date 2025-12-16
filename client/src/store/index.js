const state = {
  user: null,
}

const listeners = new Set()

export const store = {
  getState: () => ({ ...state }),
  setUser(user){
    state.user = user
    listeners.forEach(fn => fn(store.getState()))
  },
  subscribe(fn){
    listeners.add(fn)
    return () => listeners.delete(fn)
  }
}

export default store
