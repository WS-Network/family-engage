'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Nav } from '_components';
import { Spinner } from '_components';

interface GameData {
  title: string;
  description: string;
  link: string;
}

export default function Game() {
  const searchParams = useSearchParams();
  const [game, setGame] = useState<GameData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null); // Create a ref for the iframe

  useEffect(() => {
    const gameParam = searchParams.get('game');
    if (gameParam) {
      try {
        const gameData = JSON.parse(gameParam) as GameData;
        setGame(gameData);
      } catch (error) {
        setError('Failed to load game data');
      }
    }
  }, [searchParams]);

  const handleFullscreen = () => {
    if (iframeRef.current) {
      // Request fullscreen mode for the iframe
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      } else if ((iframeRef.current as any).mozRequestFullScreen) {
        (iframeRef.current as any).mozRequestFullScreen(); // For Firefox
      } else if ((iframeRef.current as any).webkitRequestFullscreen) {
        (iframeRef.current as any).webkitRequestFullscreen(); // For Safari and Chrome
      } else if ((iframeRef.current as any).msRequestFullscreen) {
        (iframeRef.current as any).msRequestFullscreen(); // For Internet Explorer/Edge
      }
    }
  };

  if (error) return <div>Error: {error}</div>;

  if (!game) return <Spinner/>;

  return (
    <>
      {/* Include the Nav component */}
      <Nav />

      {/* Game details */}
      <div>
        <h1 style={{marginLeft: 50, marginTop: 50}}>{game.title}</h1>
        {/* <p>{game.description}</p> */}
        <iframe
          ref={iframeRef}  // Attach the iframe reference
          src={game.link}
          style={{ marginLeft: 50, marginTop: 20,width: '800px', height: '600px', border: 'none' }}
          allowFullScreen
          title={game.title}
        />
        <div style={{ marginLeft: '50%',marginTop: '20px' }}>
          <button onClick={handleFullscreen} className="btn btn-primary">
            Fullscreen
          </button>
        </div>
      </div>
    </>
  );
}
