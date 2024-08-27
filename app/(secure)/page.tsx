'use client';

import Link from 'next/link';
import { SetStateAction, useEffect, useState } from 'react';

import { useUserService } from '_services';
import { Spinner } from '_components';
import Image from 'next/image';

import './page.css'

export default Home;

function Home() {
    const userService = useUserService();
    const user = userService.currentUser;

    // State to manage the view mode: 'list' or 'grid'
    const [viewMode, setViewMode] = useState('list');

    useEffect(() => {
        userService.getCurrent();
    }, []);

    // Function to handle view mode change
    const handleViewChange = (mode: SetStateAction<string>) => {
        setViewMode(mode);
    };

    const Games = [
        {
            id: 1,
            title: "Paddle Game",
            description: "Move the paddle using motion control, with your whole body",
            price: "",
            imageSrc: "https://cdn2.scratch.mit.edu/get_image/project/1050518419_480x360.png",
            link: "https://scratch.mit.edu/projects/237053914/"
        },
        {
            id: 2,
            title: "Star Wars",
            description: "Avoid Space Projectiles",
            price: "",
            imageSrc: "../(public)/assets/StarWars Game.png",
            link: "https://scratch.mit.edu/projects/237053914/"
        },
    ]

    if (user) {
        return (
            <>
                <h1>Hi {user.firstName}!</h1>
                {/* <p>You&apos;re logged in with Next.js & JWT!!</p> */}
                {/* <p><Link href="/users">Manage Users</Link></p> */}
                
                <div className="container">
                    <div className="well well-sm">
                        {/* <strong>Display</strong> */}
                        <div className="btn-group">
                            {/* <button 
                                onClick={() => handleViewChange('list')} 
                                className={`btn btn-default btn-sm ${viewMode === 'list' ? 'active' : ''}`}>
                                <span className="glyphicon glyphicon-th-list"></span> List
                            </button>
                            <button 
                                onClick={() => handleViewChange('grid')} 
                                className={`btn btn-default btn-sm ${viewMode === 'grid' ? 'active' : ''}`}>
                                <span className="glyphicon glyphicon-th"></span> Grid
                            </button> */}
                        </div>
                    </div>
                    <div id="products" className={`row list-group`}>
    {Games.map((game, index) => (
        <div 
            key={index} 
            className={`item col-xs-4 col-lg-4 ${viewMode === 'list' ? 'list-group-item' : 'grid-group-item'}`}
        >
            <div className="thumbnail">
                {/* <Image 
                    className="group list-group-image" 
                    src={game.imageSrc} 
                    alt="" 
                    width={100}
                    height={100}
                /> */}
                <div className="caption">
                    <h4 className="group inner list-group-item-heading">{game.title}</h4>
                    <p className="group inner list-group-item-text">
                        {game.description}
                    </p>
                    <div className="row">
                        <div className="col-xs-12 col-md-6">
                            {/* <p className="lead">$21.000</p> */}
                        </div>
                        <div className="col-xs-12 col-md-6">
                            <a className="btn btn-success" href={game.link}>Play Game</a>
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
    } else {
        return <Spinner />;
    }
}
