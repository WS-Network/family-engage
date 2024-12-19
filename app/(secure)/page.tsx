"use client"; // Ensures this is a Client Component

import { useRouter } from "next/navigation"; // Import from next/navigation for App Router
import Image, { StaticImageData } from "next/image";
import { useEffect } from "react";
import startwarsimg from "../(public)/assets/StarWars Game.png";
import flappyBirdicon from "../(public)/assets/Flappy_Bird_icon.png";
import Link from "next/link";
// import './page.css'
import { Footer } from "_components/Footer";

// Define the Game interface for TypeScript
interface Game {
  id: number;
  title: string;
  description: string;
  link: string;
  imageSrc: string | StaticImageData; // Allow both string and StaticImageData
}

export default function Home() {
  const router = useRouter(); // Use the correct router from next/navigation

  const Games: Game[] = [
    {
      id: 1,
      title: "Paddle Game",
      description: "Move the paddle using motion control, with your whole body",
      link: "https://scratch.mit.edu/projects/237053914/embed",
      imageSrc:
        "https://cdn2.scratch.mit.edu/get_image/project/1050518419_480x360.png", // URL as string
    },
    {
      id: 2,
      title: "Star Wars",
      description: "Avoid Space Projectiles",
      link: "https://scratch.mit.edu/projects/341217162/embed",
      imageSrc: startwarsimg, // StaticImageData
    },
    {
      id: 3,
      title: "Flappy Bird",
      description: "Move the bird using motion sensor, avoid obstacles",
      link: "https://scratch.mit.edu/projects/526019080/embed",
      imageSrc: flappyBirdicon, // StaticImageData
    },
  ];

  const handlePlayGame = (game: Game) => {
    // Make sure to navigate when the router is ready
    console.log(">>>", game);
    router.push(`/game?game=${encodeURIComponent(JSON.stringify(game))}`);
  };

  return (
    <>
      
      <div style={{marginTop: "80px"}} className="container">
        <div id="products" className="row list-group">
          {Games.map((game, index) => (
            <div key={index} className="list-group-item">
              <div>
                <Image
                  src={game.imageSrc}
                  alt={game.title}
                  width={100}
                  height={100}
                />
                <div>
                  <h4 className="group inner list-group-item-heading mb-0 pt-2">
                    {game.title}
                  </h4>
                  <p className="group inner list-group-item-text">
                    {game.description}
                  </p>
                  <div>
                    <div
                      style={{
                        position: "relative",
                        marginBottom: "2%",
                      }}
                    >
                      <button
                        style={{
                          right: "1rem",
                          bottom: "1rem",
                          backgroundColor: "#0CA4BD",
                        }}
                        className="btn btn-success position-absolute"
                        onClick={() => handlePlayGame(game)}
                      >
                        {/* <Link href="/game"> */}
                        Play Game!
                        {/* </Link> */}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </>
  );
}
