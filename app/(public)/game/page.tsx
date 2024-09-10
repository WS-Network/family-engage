// pages/game.tsx
'use client'; // Add this at the top to mark it as a client component

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Game() {
    const router = useRouter();
    const [game, setGame] = useState(null);

    useEffect(() => {
        if (router.query.game) {
            const gameData = JSON.parse(router.query.game as string);
            setGame(gameData);
        }
    }, [router.query.game]);

    if (!game) return <div>Loading...</div>;

    // return (
    //     <div>
    //         <h1>{game.title}</h1>
    //         <p>{game.description}</p>
    //         <iframe
    //             src={game.link}
    //             style={{ width: '800px', height: '600px', border: 'none' }}
    //             allowFullScreen
    //             title={game.title}
    //         />
    //     </div>
    // );
}
