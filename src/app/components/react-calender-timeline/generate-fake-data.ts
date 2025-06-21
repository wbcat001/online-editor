import dayjs from 'dayjs'
import {HTMLProps} from "react";
import {TimelineGroupBase, TimelineItemBase} from "react-calendar-timeline";

export type FakeGroup = TimelineGroupBase &  {
  id:string;
  label: string
  bgColor: string
}

export type FakeDataItem = TimelineItemBase<number> & {
  id: number
  group: string
  title: string
  start_time: number
  end_time: number
  canMove?: boolean
  canResize?: false | 'left' | 'right' | 'both'
  className?: string
  bgColor?:string,
  selectedBgColor?:string
  color?:string
  itemProps?: HTMLProps<HTMLDivElement>
}

// 固定の色を定義
const colors = [
  '#FFD700', // ゴールド
  '#87CEFA', // ライトスカイブルー
  '#98FB98', // ペールグリーン
  '#FFA07A', // ライトサーモン
  '#DDA0DD', // プラム
  '#B0E0E6', // パウダーブルー
  '#F0E68C', // カーキ
  '#E6E6FA', // ラベンダー
  '#D8BFD8', // シスル
  '#FFDAB9', // ピーチパフ
];

// 固定のグループ名
const groupNames = [
  'トラック 1', 'トラック 2', 'トラック 3', 'トラック 4', 'トラック 5', 
  'トラック 6', 'トラック 7', 'トラック 8', 'トラック 9', 'トラック 10'
];

// 固定のアイテムタイトル
const itemTitles = [
  'ファイル1.wav', 'ファイル2.mp3', 'ファイル3.aac', 'ファイル4.flac', 'ファイル5.ogg',
  'ファイル6.wav', 'ファイル7.mp3', 'ファイル8.aac', 'ファイル9.flac', 'ファイル10.ogg',
];

// 名前付き関数に変更
export default function generateFakeData(groupCount = 10, itemCount = 20, daysInPast = 30) {
  // 使用するグループ数を制限
  const actualGroupCount = Math.min(groupCount, groupNames.length);
  
  // グループデータを生成
  const groups: FakeGroup[] = []; // letからconstに変更
  for (let i = 0; i < actualGroupCount; i++) {
    groups.push({
      id: `${i + 1}`,
      title: groupNames[i],
      rightTitle: `Info ${i + 1}`,
      label: `Label ${groupNames[i]}`,
      bgColor: colors[i % colors.length],
    });
  }

  // 現在の時刻を基準に
  const now = dayjs().valueOf();
  
  // アイテムデータを生成
  let items: FakeDataItem[] = [];
  for (let i = 0; i < itemCount; i++) {
    // 固定の時間間隔でアイテムを配置
    const hoursOffset = Math.floor(i / 2) * 2; // 2時間ごとに配置
    const minutesOffset = (i % 2) * 30; // 30分間隔
    
    const startTime = dayjs()
      .subtract(daysInPast / 2, 'day') // 過去の日付から開始
      .add(hoursOffset, 'hour')
      .add(minutesOffset, 'minute')
      .valueOf();
    
    // アイテムの長さは15分～2時間でバリエーション
    const durationMinutes = [15, 30, 60, 90, 120][i % 5];
    const endTime = dayjs(startTime).add(durationMinutes, 'minute').valueOf();

    // グループ割り当て: 均等に分散
    const groupId = (i % actualGroupCount) + 1;
    
    // データチップ用のテキスト
    const tooltipText = `${itemTitles[i % itemTitles.length]} (${durationMinutes}分)`;
    
    const itemProps: HTMLProps<HTMLDivElement> = { style: {} };
    // @ts-expect-error Reactの型定義にdata-tipがないため
    itemProps['data-tip'] = tooltipText;
    
    // 週末判定
    const isWeekend = dayjs(startTime).day() === 0 || dayjs(startTime).day() === 6;
    
    items.push({
      id: i,
      group: `${groupId}`,
      title: itemTitles[i % itemTitles.length],
      start_time: startTime,
      end_time: endTime,
      canMove: startTime > now,
      canResize: startTime > now 
        ? endTime > now 
          ? 'both' 
          : 'left' 
        : endTime > now 
          ? 'right' 
          : false,
      className: isWeekend ? 'item-weekend' : '',
      bgColor: colors[(i + groupId) % colors.length] + 'CC', // CCは透明度80%
      selectedBgColor: colors[(i + groupId) % colors.length],
      color: '#333333', // 暗めのテキスト色
      // itemProps: itemProps
    });
  }

  // 開始時間で降順ソート
  items = items.sort((a, b) => b.start_time - a.start_time);

  return {groups, items};
}