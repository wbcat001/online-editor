import { create } from 'zustand'
import moment from 'moment'

// タイムラインアイテムの型定義
interface TimelineItem {
  id: number
  group: number
  title: string
  start_time: number  // Unixタイムスタンプ（ミリ秒）
  end_time: number    // Unixタイムスタンプ（ミリ秒）
}

interface TimelineState {
  items: TimelineItem[]
  updateItem: (id: number, start_time: number, group: number) => void
}

export const useTimelineStore = create<TimelineState>((set) => ({
  items: [
    {
      id: 1,
      group: 1,
      title: 'ファイルA.wav',
      start_time: moment().add(-2, 'hour').valueOf(),
      end_time: moment().add(1, 'hour').valueOf()
    },
    {
      id: 2,
      group: 2,
      title: 'ファイルB.wav',
      start_time: moment().add(-1, 'hour').valueOf(),
      end_time: moment().add(2, 'hour').valueOf()
    }
  ],
  updateItem: (id: number, start_time: number, group: number) => set((state) => ({
    items: state.items.map((item) =>
      item.id === id ? {
        ...item,
        start_time,
        // 元のアイテムの長さ（duration）を保持
        end_time: start_time + (item.end_time - item.start_time),
        group
      } : item
    )
  }))
}))
