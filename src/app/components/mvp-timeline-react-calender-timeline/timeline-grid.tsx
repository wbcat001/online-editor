'use client'

import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { useTimelineStore } from './useTimelineStore'
import dynamic from 'next/dynamic'

// クライアントコンポーネントを動的にインポート
const TimelineClient = dynamic(() => import('./TimelineClient'), {
  ssr: false,
})

const groups = [
  { id: 1, title: 'トラック 1' },
  { id: 2, title: 'トラック 2' }
]

export default function TimelineGrid() {
  const { items, updateItem } = useTimelineStore()
  
  // クライアント側でのみレンダリングするためのフラグ
  const [isClient, setIsClient] = useState(false)
  
  // マウント後にクライアントサイドレンダリングを有効化
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // サーバーサイドまたは初期レンダリング時はプレースホルダーを表示
  if (!isClient) {
    return <div className="h-64 bg-gray-100 flex items-center justify-center">タイムラインを読み込み中...</div>
  }

  return (
    <TimelineClient 
      groups={groups}
      items={items}
      startTime={moment().add(-12, 'hour').valueOf()}
      endTime={moment().add(12, 'hour').valueOf()}
      onItemMove={(itemId, dragTime, newGroupOrder) => {
        // dragTimeはunixタイムスタンプ（ミリ秒）として渡されてくる
        // itemIdがstringの場合に備えて数値に変換
        updateItem(Number(itemId), dragTime, newGroupOrder + 1) // グループIDは1から始まるため調整
      }}
    />
  )
}