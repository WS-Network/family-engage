"use client";
import React, { useEffect, useState } from "react";
import { useUserService } from "_services";
import "./FriendsModal.css";

interface FriendsModalProps {
  friendsModal: boolean;
  setFriendsModal: (value: boolean) => void;
  friends: User[];  // Add friends prop
  onAddFriend: (friendId: string) => void; // Add onAddFriend prop
}

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}

function FriendsModal({ friendsModal, setFriendsModal }: FriendsModalProps) {
  const [allUsers, setAllUsers] = useState<User[]>([]); // Initialize with an empty array
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const userService = useUserService();
  

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const users = await userService.getAll(); // Now getAll returns an array
        if (users) setAllUsers(users); // Ensure an array is assigned to allUsers
      } catch (error) {
        console.error("Error fetching users:", error);
        setAllUsers([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    if (friendsModal) {
      fetchAllUsers();
    }
  }, [friendsModal, userService]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      setFriendsModal(false);
    }
  };

  const filteredUsers = allUsers.filter((user) =>
    `${user.firstName} ${user.lastName} ${user.username}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const addFriend = async (userId: string) => {
    try {
      await userService.addFriend(userId); // Assuming addFriend is implemented
      alert("Friend added!");
    } catch (error) {
      console.error("Error adding friend:", error);
      alert("Failed to add friend");
    }
  };

  return (
    <div
      className={`friends-backdrop ${friendsModal ? "active" : ""}`}
      onClick={handleBackdropClick}
    >
      <div className={`friends-modal ${friendsModal ? "active" : ""}`}>
        <p onClick={() => setFriendsModal(false)} className="close-button">
          ✕
        </p>
        <div className="friends-content">
          <h1>Find Friends</h1>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="friends-list">
              {filteredUsers.map((user) => (
                <div key={user.id} className="friend-item">
                  <span>{`${user.firstName} ${user.lastName} (${user.username})`}</span>
                  <button onClick={() => addFriend(user.id)} className="add-friend-button">
                    Add Friend
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FriendsModal;
