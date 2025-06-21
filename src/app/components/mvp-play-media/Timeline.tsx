import React, { useRef} from 'react';

type AudioItem = {
    id: string;
    src: string;
    startTime: number;
    endTime: number;
}

const audioItems : AudioItem[] = [
    { id: '1', src: '/sound/sample1.mp3', startTime: 0, endTime: 10 },
    { id: '2', src: '/sound/sample2.mp3', startTime: 2, endTime: 15 },
    {
    id: '3', src: '/sound/sample3.mp3', startTime: 3, endTime: 20 },
    { id: '4', src: '/sound/sample4.mp3', startTime: 2.5, endTime: 25 },
    { id: '5', src: '/sound/sample5.mp3', startTime: 5, endTime: 30 },
    { id: '6', src: '/sound/sample6.mp3', startTime: 4, endTime: 35 },
    { id: '7', src: "/sound/sample1.mp3", startTime: 6, endTime: 40 },
    { id: '8', src: "/sound/sample2.mp3", startTime: 8, endTime: 45 },
    { id: '9', src: "/sound/sample3.mp3", startTime: 10, endTime: 50 },
    { id: '10', src: "/sound/sample4.mp3", startTime: 3, endTime: 55 },
    { id: '11', src: "/sound/sample5.mp3", startTime: 6, endTime: 60 },
    { id: '12', src: "/sound/sample6.mp3", startTime: 2, endTime: 65 },
    { id: '13', src: "/sound/sample1.mp3", startTime: 10, endTime: 70 },
    { id: '14', src: "/sound/sample2.mp3", startTime: 5, endTime: 75 },
    { id: '15', src: "/sound/sample3.mp3", startTime: 7, endTime: 80 },
]

export const AudioTimeline: React.FC = () => {
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

  const handlePlayAll = () => {
    const now = Date.now();
    audioItems.forEach(item => {
      const delay = item.startTime * 1000;
      setTimeout(() => {
        const audio = audioRefs.current.get(item.id);
        if (audio) {
          audio.currentTime = 0;
          audio.play();
        }
      }, delay);
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🎵 タイムライン再生モック</h2>
      <button onClick={handlePlayAll}>▶ 再生</button>

      <div
        style={{
          marginTop: 20,
          display: 'flex',
          position: 'relative',
          height: 60,
          border: '1px solid gray',
          overflowX: 'auto',
        }}
      >
        {audioItems.map(item => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              left: `${item.startTime * 100}px`, // 1秒 = 100px
              width: 100,
              height: 60,
              background: 'skyblue',
              textAlign: 'center',
              lineHeight: '60px',
              border: '1px solid #000',
            }}
          >
            {item.id}
            <audio
              ref={el => {
                if (el) {
                  audioRefs.current.set(item.id, el);
                } else {
                  audioRefs.current.delete(item.id);
                }
              }}
              src={item.src}
            />
          </div>
        ))}
      </div>

      <div style={{ marginTop: 10 }}>
        <small>※ 横の線が時間軸。1秒 = 100px として表示しています。</small>
      </div>
    </div>
  );
};


export default AudioTimeline;