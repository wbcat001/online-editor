import React, { useEffect, useRef, useState } from "react";
import { useItem } from "dnd-timeline";
import WaveSurfer from "wavesurfer.js";
import { FileInfo } from "./utils";

interface WaveformItemProps {
  id: string;
  span: { start: number; end: number };
  fileInfo: FileInfo;
}

function WaveformItem({ id, span, fileInfo }: WaveformItemProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const { setNodeRef, attributes, listeners, itemStyle, itemContentStyle } =
    useItem({
      id,
      span,
      data: {
        fileInfo,
      },
    });

  // 波形表示の初期化
  useEffect(() => {
    if (!waveformRef.current || !fileInfo) return;
    
    // ファイルURLを取得（画像やビデオのサムネイル生成と同じ方法でBlobURLを作成）
    const audioUrl = URL.createObjectURL(fileInfo.file as File);

    // WaveSurferインスタンスを初期化
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#4a83ff',
      progressColor: '#1a56e8',
      cursorColor: '#ff0000',
      height: 40,
      normalize: true,
      responsive: true,
      fillParent: true,
    });
    
    wavesurferRef.current = wavesurfer;

    // オーディオファイルをロード
    wavesurfer.load(audioUrl);
      
    wavesurfer.on('ready', () => {
      setIsLoaded(true);
    });

    // 再生終了時の処理
    wavesurfer.on('finish', () => {
      setIsPlaying(false);
    });

    return () => {
      // クリーンアップ
      wavesurfer.destroy();
      URL.revokeObjectURL(audioUrl);
    };
  }, [fileInfo]);

  // 再生/停止を制御
  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // イベントの伝播を防止
    
    if (!isLoaded || !wavesurferRef.current) return;

    wavesurferRef.current.playPause();
    setIsPlaying(!isPlaying);
  };

  return (
    <div ref={setNodeRef} style={itemStyle} {...listeners} {...attributes}>
      <div 
        style={{
          ...itemContentStyle,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: '2px',
          background: '#f8f9fa',
          borderRadius: '3px',
        }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 5px',
          height: '20px',
        }}>
          <span style={{ 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap',
            fontSize: '12px',
          }}>
            {fileInfo.name}
          </span>
          <button 
            onClick={togglePlay}
            style={{
              background: isPlaying ? '#f44336' : '#4CAF50',
              border: 'none',
              borderRadius: '50%',
              width: '16px',
              height: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '10px',
              padding: 0,
            }}
          >
            {isPlaying ? '■' : '▶'}
          </button>
        </div>
        
        {/* 波形表示エリア */}
        <div 
          ref={waveformRef} 
          style={{ 
            flex: 1,
            minHeight: '40px',
          }}
        />
      </div>
    </div>
  );
}

export default WaveformItem;