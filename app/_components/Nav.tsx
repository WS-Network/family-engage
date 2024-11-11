"use client";
import { useState, useEffect } from "react";
import { NavLink } from "_components";
import { useUserService } from "_services";
import Image from "next/image";
import logo from "../(public)/assets/Logo.png";
import "./Nav.css";
import FriendsModal from "./FriendsModal";
import FriendsModal2 from "./FriendModal2";

interface User {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
}

function Nav() {
    const [loggingOut, setLoggingOut] = useState<boolean>(false);
    const [friendsModal, setFriendsModal] = useState<boolean>(false);
    const [friendModal2, setFriendModal2] = useState<boolean>(false);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const userService = useUserService();

    async function logout() {
        setLoggingOut(true);
        await userService.logout();
    }

    useEffect(() => {
        const fetchAllUsers = async () => {
            const users = await userService.getAll();
            setAllUsers(users);
        };
        fetchAllUsers();
    }, [userService]);

    const handleAddFriend = (friendId: string) => {
        userService.addFriend(friendId);
    };

    return (
        <>
            {/* First Modal */}
            {friendsModal && (
                <FriendsModal
                    friendsModal={true}
                    setFriendsModal={setFriendsModal}
                    friends={allUsers}
                    onAddFriend={(friendId) => handleAddFriend(friendId)}
                />
            )}

            {/* Second Modal */}
            {friendModal2 && (
                <FriendsModal2
                    friendsModal={true}
                    setFriendsModal={setFriendModal2}
                    friends={allUsers}
                    onAddFriend={(friendId) => handleAddFriend(friendId)}
                />
            )}

            <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
                <a href="/" className="navbar-brand">
                    <Image src={logo} alt="Logo" width={50} height={40} />
                </a>
                <div className="navbar-nav">
                    <NavLink href="/" exact className="nav-item nav-link">
                        Game Library
                    </NavLink>
                    <NavLink href="/users" className="nav-item nav-link">
                        Family Members
                    </NavLink>
                    <NavLink href="/gaming-profile" className="nav-item nav-link">
                        Profile
                    </NavLink>
                    <button
                        onClick={logout}
                        className="btn btn-link nav-item nav-link"
                        style={{ width: "67px" }}
                        disabled={loggingOut}
                    >
                        {loggingOut ? (
                            <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                            <span>Logout</span>
                        )}
                    </button>
                    <p
                        
                        onClick={() => setFriendsModal(!friendsModal)}
                        className="nav-item nav-link friends-link-add"
                    >
                        Add Families
                    </p>
                    <p
                        onClick={() => setFriendModal2(!friendModal2)}
                        className="nav-item nav-link friends-link" // Added the same styling class
                    >
                        Families
                    </p>
                </div>
            </nav>
        </>
    );
}

export { Nav };