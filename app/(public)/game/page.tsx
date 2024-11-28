"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Nav } from "_components";
import { Spinner } from "_components";
import "./page.css"; // Import the CSS file
import { useUserService } from "_services";

interface GameData {
  title: string;
  description: string;
  link: string;
}

interface LeaderboardItem {
  name: string;
  percent: string;
}

type SubUser = {
  username: string;
  firstName: string;
  lastName: string;
};

type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  subUsers: SubUser[];
};

// Define the invited global variable
let invited = false; // Set this to true when a user is invited

export default function Game() {
  const searchParams = useSearchParams();
  const [game, setGame] = useState<GameData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null); // Create a ref for the iframe
  const userService = useUserService();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const gameParam = searchParams.get("game");
    if (gameParam) {
      try {
        const gameData = JSON.parse(gameParam) as GameData;
        setGame(gameData);
      } catch (error) {
        setError("Failed to load game data");
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data: User | null = await userService.getCurrent();
        console.log("data", data);
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userService]);

  // New useEffect to check and update invited state from localStorage
  useEffect(() => {
    const isInvited = localStorage.getItem("invited") === "true"; // Check invited value
    invited = isInvited; // Update the global variable
  }, []);

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

  const closeSecondGame = () => {
    invited = false; // Set the invited variable to false
    localStorage.setItem("invited", "false"); // Update localStorage
    window.location.reload(); // Refresh the page to reset the layout
  };

  if (error) return <div>Error: {error}</div>;
  if (loading) return <Spinner />;
  if (!game || !user) return <Spinner />;

  return (
    <>
      {/* Include the Nav component */}
      <Nav />

      <div className="game-layout">
  {invited ? (
    <>
      {/* Games displayed side by side */}
      <div className="game-side-by-side">
        <div className="game-instance">
          <iframe
            ref={iframeRef}
            src={game.link}
            className="game-iframe"
            allow="camera; microphone; fullscreen"
            allowFullScreen
            title={`${game.title} - Instance 1`}
          />
        </div>
        <div className="game-instance">
          <iframe
            src={game.link}
            className="game-iframe"
            allow="camera; microphone; fullscreen"
            allowFullScreen
            title={`${game.title} - Instance 2`}
          />
          <button className="close-button" onClick={closeSecondGame}>
            X
          </button>
        </div>
      </div>

      {/* Leaderboards placed under the games */}
      <div className="leaderboard-container">
        {/* <div className="leaderboard">
          <h2>Leaderboard 1</h2>
          <ol>
            {user.subUsers.map((subUser, index) => (
              <li key={index}>
                <span className="username">{subUser.username}</span>
              </li>
            ))}
          </ol>
        </div> */}
        {/* <div className="leaderboard">
          <h2>Leaderboard 2</h2>
          <ol>
            {user.subUsers.map((subUser, index) => (
              <li key={index}>
                <span className="username">{subUser.username}</span>
              </li>
            ))}
          </ol>
        </div> */}
      </div>
    </>
  ) : (
    <>
      {/* Single game layout */}
      <div className="game-container">
        <h1 className="game-title">{game.title}</h1>
        <iframe
          ref={iframeRef}
          src={game.link}
          className="game-iframe"
          allow="camera; microphone; fullscreen"
          allowFullScreen
          title={game.title}
        />
        <div className="fullscreen-button-container">
          <button onClick={handleFullscreen} className="btn btn-primary">
            Fullscreen
          </button>
        </div>
      </div>

      {/* Single leaderboard */}
      <div className="leaderboard">
        <h2>Leaderboard</h2>
        <ol>
          {user.subUsers.map((subUser, index) => (
            <li key={index}>
              <span className="username">{subUser.username}</span>
            </li>
          ))}
        </ol>
      </div>
    </>
  )}
</div>

    </>
  );
}
