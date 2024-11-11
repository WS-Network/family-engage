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

      <nav className="global-navbar navbar fixed-top navbar-expand bg-light navbar-light shadow-sm px-2">
        <a href="/" className="navbar-brand px-2">
          <Image src={logo} alt="Logo" width={70} height={50} />
        </a>
        <div className="navbar-nav">
          <NavLink
            href="/"
            exact
            className="nav-link text-center text-nowrap fw-semibold"
          >
            Game Library
          </NavLink>
          <NavLink
            href="/users"
            className="nav-link text-center text-nowrap fw-semibold"
          >
            Family Members
          </NavLink>
          <NavLink
            href="/gaming-profile"
            className="nav-link text-center text-nowrap fw-semibold"
          >
            Profile
          </NavLink>
          <button
            onClick={logout}
            className="btn btn-link nav-link text-center text-nowrap fw-semibold"
            style={{ width: "67px" }}
            disabled={loggingOut}
          >
            {loggingOut ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : (
              <span>Logout</span>
            )}
          </button>
          <div className="nav-item-container">
            <button
              onClick={() => setFriendsModal(!friendsModal)}
              className="nav-item"
            >
              Add Families
            </button>
            <button
              onClick={() => setFriendModal2(!friendModal2)}
              className="nav-item"
            >
              Families
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

export { Nav };
