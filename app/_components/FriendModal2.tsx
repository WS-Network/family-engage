"use client";
import React, { useEffect, useState } from "react";
import { useUserService } from "_services";
import "./FriendModal2.css";

interface FriendsModalProps {
    friendsModal: boolean;  // Changed from friendModal2 to match the other modal
    setFriendsModal: (value: boolean) => void;  // Changed from setFriendModal2 to match
    friends: User[];
    onAddFriend: (friendId: string) => void;
}

interface User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
}

function FriendsModal2({ friendsModal, setFriendsModal, friends }: FriendsModalProps) {
    const [currentFriends, setCurrentFriends] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const userService = useUserService();

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const user = await userService.getCurrent();
                if (user) {
                    setCurrentUserId(user.id);
                    fetchCurrentFriends(user.id);
                }
            } catch (error) {
                console.error('Error getting current user:', error);
            }
        };

        if (friendsModal) {
            getCurrentUser();
        }
    }, [friendsModal, userService]);

    const fetchCurrentFriends = async (userId: string) => {
        try {
            setLoading(true);
            const response = await fetch('/api/users/friends', {
                headers: {
                    'userId': userId
                }
            });
            if (response.ok) {
                const data = await response.json();
                setCurrentFriends(data);
            }
        } catch (error) {
            console.error('Error fetching friends:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFriend = async (friendId: string) => {
        if (!currentUserId) return;
        try {
            const response = await fetch('/api/users/friends', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: currentUserId,
                    friendId: friendId
                })
            });

            if (response.ok) {
                setCurrentFriends(prev => prev.filter(friend => friend.id !== friendId));
            }
        } catch (error) {
            console.error('Error removing friend:', error);
        }
    };

    // Filter friends based on search query
    const filteredFriends = currentFriends.filter(friend => 
        friend.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`modal ${friendsModal ? 'show' : ''}`}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>My Families</h2>
                    <span className="close" onClick={() => setFriendsModal(false)}>&times;</span>
                </div>
                <div className="modal-body">
                    <input
                        type="text"
                        placeholder="Search families..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    
                    {loading ? (
                        <div className="loading">Loading...</div>
                    ) : filteredFriends.length === 0 ? (
                        <div className="no-friends">No families found</div>
                    ) : (
                        <div className="friends-list">
                            {filteredFriends.map((friend) => (
                                <div key={friend.id} className="friend-item">
                                    <div className="friend-info">
                                        <span className="friend-name">
                                            {friend.firstName} {friend.lastName}
                                        </span>
                                        <span className="friend-username">@{friend.username}</span>
                                    </div>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleRemoveFriend(friend.id)}
                                    >
                                        Remove Family
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

export default FriendsModal2;