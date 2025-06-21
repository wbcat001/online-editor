// DraggableItem.tsx
import { useDrag } from 'react-dnd'

export const DraggableItem = ({ id, fromTimeline = false }: { id: string; fromTimeline?: boolean }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ITEM',
    item: { id, fromTimeline },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  return drag(
    <div
      style={{
        opacity: isDragging ? 0.5 : 1,
        background: '#6cf',
        padding: '4px',
        borderRadius: '4px',
      }}
    >
      {id}
    </div>
  )
}
