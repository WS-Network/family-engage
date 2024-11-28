"use client";

import { useEffect, useState } from "react";
import { Nav } from "_components";
import "./page.css";

export default function Game() {
    const [invited, setInvited] = useState(false);

    useEffect(() => {
        // Check the invited state from localStorage
        const isInvited = localStorage.getItem("invited") === "true";
        setInvited(isInvited);
    }, []);

    return (
        <>
            <Nav />
            <div className="game-layout">
                {invited ? (
                    <>
                        <div className="game-side-by-side">
                            <iframe
                                src="https://example.com/game"
                                className="game-iframe"
                                title="Game Instance 1"
                                allow="camera; microphone; fullscreen"
                                allowFullScreen
                            />
                            <iframe
                                src="https://example.com/game"
                                className="game-iframe"
                                title="Game Instance 2"
                                allow="camera; microphone; fullscreen"
                                allowFullScreen
                            />
                        </div>
                        <div className="leaderboard-container">
                            <div className="leaderboard">
                                <h2>Leaderboard 1</h2>
                                <ol>
                                    <li>User 1</li>
                                    <li>User 2</li>
                                </ol>
                            </div>
                            <div className="leaderboard">
                                <h2>Leaderboard 2</h2>
                                <ol>
                                    <li>User 3</li>
                                    <li>User 4</li>
                                </ol>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="game-container">
                            <iframe
                                src="https://example.com/game"
                                className="game-iframe"
                                title="Single Game"
                                allow="camera; microphone; fullscreen"
                                allowFullScreen
                            />
                        </div>
                        <div className="leaderboard">
                            <h2>Leaderboard</h2>
                            <ol>
                                <li>User 1</li>
                                <li>User 2</li>
                            </ol>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
