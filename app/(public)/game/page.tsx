'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Nav } from '_components';
import { Spinner } from '_components';
import './page.css';  // Import the CSS file

interface GameData {
  title: string;
  description: string;
  link: string;
}

interface LeaderboardItem {
  name: string;
  percent: string;
}

const leaderboardItems: LeaderboardItem[] = [
  { name: 'React', percent: '74%' },
  { name: 'Vue', percent: '49%' },
  { name: 'Angular 2', percent: '45%' },
  { name: 'Angular', percent: '27%' },
  { name: 'Ember', percent: '26%' },
  { name: 'Backbone', percent: '20%' },
];

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

  if (!game) return <Spinner />;

  return (
    <>
      {/* Include the Nav component */}
      <Nav />

      <div className="game-layout">
        {/* Game details */}
        <div className="game-container">
          <h1 className="game-title">{game.title}</h1>
          <iframe
            ref={iframeRef}  // Attach the iframe reference
            src={game.link}
            className="game-iframe"
            allowFullScreen
            title={game.title}
          />
          <div className="fullscreen-button-container">
            <button onClick={handleFullscreen} className="btn btn-primary">
              Fullscreen
            </button>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="leaderboard">
          <h2>Leaderboard <small>(Interest)</small></h2>
          <ol>
            {leaderboardItems.map((item, index) => (
              <li key={index}>
                <span className="name">{item.name}</span>
                <span className="percent">{item.percent}</span>
              </li>
            ))}
          </ol>
          <p><small>Front-End Frameworks 2016</small></p>
        </div>
      </div>
    </>
  );
}
