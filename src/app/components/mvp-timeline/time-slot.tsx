// TimeSlot.tsx
import { useDrop } from 'react-dnd'
import { useTimelineStore } from './useTimelineStore'

// ドラッグされるアイテムの型定義
interface DraggedItem {
  id: string
  fromTimeline?: boolean
}

export const TimeSlot = ({ track, time }: { track: number; time: string }) => {
  const addItem = useTimelineStore((s) => s.addItem)
  const moveItem = useTimelineStore((s) => s.moveItem)

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ITEM',
    drop: (dragged: DraggedItem) => {
      if (dragged.fromTimeline) {
        moveItem(dragged.id, track, time)
      } else {
        addItem({ id: dragged.id, track, time })
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }))

  return drop(
    <div
      style={{
        border: '1px solid #ccc',
        height: '40px',
        backgroundColor: isOver ? '#eef' : 'white',
      }}
    >
      {/* アイテムがあれば表示 */}
    </div>
  )
}
