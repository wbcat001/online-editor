'use client';

import dynamic from 'next/dynamic';

// タイムラインを動的にインポートしてSSRを無効にする
// const TimelineSection = dynamic(
//   () => import('./components/react-calender-timeline/my-timeline'),
//   { ssr: false }
// )

import { FC } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DroppableArea } from "./components/mvp-dnd/droppable-area";
import DndTimeline from "./components/mvp-external-dnd-timeline/App";
import AudioTimeline from "./components/mvp-play-media/Timeline";
export default function Home(){
  // <DndProvider backend={HTML5Backend}>
  //   <div>draggable area</div>
  //   <DroppableArea />
  // </DndProvider>
  return (
    // <DndProvider backend={HTML5Backend}>
    //     <DroppableArea />
    // </DndProvider>
    <DndTimeline />
    // <AudioTimeline />
  );
};