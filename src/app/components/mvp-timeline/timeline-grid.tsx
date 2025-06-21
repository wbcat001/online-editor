// TimelineGrid.tsx
import { TimeSlot } from './time-slot'
import { DraggableItem } from './draggable-item'
import { useTimelineStore } from './useTimelineStore'

const times = ['10:00', '10:05', '10:10']
const tracks = [0, 1, 2]

export const TimelineGrid = () => {
  const items = useTimelineStore((s) => s.items)

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <DraggableItem id="file-1" />
        <DraggableItem id="file-2" />
      </div>

      <div>
        {tracks.map((track) => (
          <div key={track} style={{ display: 'flex' }}>
            {times.map((time) => {
              const item = items.find((i) => i.track === track && i.time === time)
              return (
                <div key={time} style={{ width: '100px' }}>
                  <TimeSlot track={track} time={time} />
                  {item && <DraggableItem id={item.id} fromTimeline />}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
