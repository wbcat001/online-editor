// useTimelineStore.ts
import { create } from 'zustand'

type Item = {
  id: string
  track: number
  time: string // 10:00, 10:05など
}

type State = {
  items: Item[]
  moveItem: (id: string, newTrack: number, newTime: string) => void
  addItem: (item: Item) => void
}

export const useTimelineStore = create<State>((set) => ({
  items: [],
  moveItem: (id, newTrack, newTime) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, track: newTrack, time: newTime } : item
      ),
    })),
  addItem: (item) =>
    set((state) => ({ items: [...state.items, item] })),
}))
