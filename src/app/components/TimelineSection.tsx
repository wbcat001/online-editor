'use client'

import React from 'react'
import dynamic from 'next/dynamic'

// タイムラインコンポーネントを動的にインポート
const TimelineGrid = dynamic(
  () => import('./mvp-timeline-react-calender-timeline/timeline-grid'),
  { ssr: false }
)

export default function TimelineSection() {
  return <TimelineGrid />
}
