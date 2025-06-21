'use client'

import React from 'react'
import ReactCalendarTimeline from 'react-calendar-timeline'
import 'react-calendar-timeline/lib/Timeline.css'

// アイテムの型を定義
interface TimelineItem {
  id: number
  group: number | string
  title: string
  start_time: number
  end_time: number
  [key: string]: any // その他のプロパティ
}

// 必須のpropertyを型定義する
interface TimelineClientProps {
  groups: { id: number; title: string }[]
  items: TimelineItem[]
  startTime: number
  endTime: number
  onItemMove: (itemId: number | string, dragTime: number, newGroupOrder: number) => void
}

export default function TimelineClient({
  groups,
  items,
  startTime,
  endTime,
  onItemMove
}: TimelineClientProps) {
  return (
    <ReactCalendarTimeline
      groups={groups}
      items={items}
      defaultTimeStart={startTime}
      defaultTimeEnd={endTime}
      sidebarWidth={150}
      rightSidebarWidth={0}
      lineHeight={40}
      itemHeightRatio={0.6}
      minZoom={24 * 60 * 60 * 1000} // 1日
      maxZoom={365.24 * 86400 * 1000} // 1年
      canResize={false}
      stackItems={true}
      timeSteps={{
        second: 1,
        minute: 1,
        hour: 1, 
        day: 1, 
        month: 1, 
        year: 1
      }}
      keys={{
        groupIdKey: 'id',
        groupTitleKey: 'title',
        groupLabelKey: 'title', // 追加
        groupRightTitleKey: 'title', // 追加
        itemIdKey: 'id',
        itemTitleKey: 'title',
        itemDivTitleKey: 'title',
        itemGroupKey: 'group',
        itemTimeStartKey: 'start_time',
        itemTimeEndKey: 'end_time',
      }}
      onItemMove={onItemMove}
    />
  )
}
