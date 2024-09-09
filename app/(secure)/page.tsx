'use client'; // Ensures this is a Client Component

import { useRouter } from 'next/navigation'; // Import from next/navigation for App Router
import Image from 'next/image';
import { useEffect } from 'react';
import startwarsimg from '../(public)/assets/StarWars Game.png';
import flappyBirdicon from '../(public)/assets/Flappy_Bird_icon.png';

// Define the Game interface for TypeScript
interface Game {
    id: number;
    title: string;
    description: string;
    link: string;
    imageSrc: string;
}

export default function Home() {
    const router = useRouter(); // Use the correct router from next/navigation

    const Games: Game[] = [
        {
            id: 1,
            title: "Paddle Game",
            description: "Move the paddle using motion control, with your whole body",
            link: "https://scratch.mit.edu/projects/237053914/",
            imageSrc: "https://cdn2.scratch.mit.edu/get_image/project/1050518419_480x360.png",
        },
        {
            id: 2,
            title: "Star Wars",
            description: "Avoid Space Projectiles",
            link: "https://scratch.mit.edu/projects/237053914/",
            imageSrc: startwarsimg,
        },
        {
            id: 3,
            title: "Flappy Bird",
            description: "Move the bird using motion sensor, avoid obstacles",
            link: "",
            imageSrc: flappyBirdicon,
        },
    ];

    const handlePlayGame = (game: Game) => {
        // Make sure to navigate when the router is ready
        router.push(`/game?data=${encodeURIComponent(JSON.stringify(game))}`);
    };

    return (
        <>
            <h1>Games</h1>
            <div className="container">
                <div id="products" className="row list-group">
                    {Games.map((game, index) => (
                        <div
                            key={index}
                            className={`item col-xs-4 col-lg-4 list-group-item`}
                        >
                            <div className="thumbnail">
                                <Image
                                    className="group list-group-image"
                                    src={game.imageSrc}
                                    alt={game.title}
                                    width={100}
                                    height={100}
                                />
                                <div className="caption">
                                    <h4 className="group inner list-group-item-heading">
                                        {game.title}
                                    </h4>
                                    <p className="group inner list-group-item-text">
                                        {game.description}
                                    </p>
                                    <div className="row">
                                        <div
                                            style={{
                                                marginLeft: '90%',
                                                marginBottom: '2%',
                                            }}
                                        >
                                            <button
                                                className="btn btn-success"
                                                onClick={() =>
                                                    handlePlayGame(game)
                                                }
                                            >
                                                Play Game
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
