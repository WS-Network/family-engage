"use client";
import React, { useEffect, useState } from "react";
import { useUserService } from "_services";
import "./FriendModal2.css";

interface FriendsModalProps {
    friendsModal: boolean;
    setFriendsModal: (value: boolean) => void;
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
    const [error, setError] = useState<string | null>(null);
    const userService = useUserService();

    useEffect(() => {
        if (friendsModal) {
            console.log("Modal opened, fetching friends..."); // Debug log
            fetchFriends();
        }
    }, [friendsModal]);

    const fetchFriends = async () => {
        console.log("Starting to fetch friends..."); // Debug log
        try {
            setLoading(true);
            setError(null);

            // Get current user first
            console.log("Getting current user..."); // Debug log
            const currentUser = await userService.getCurrent();
            console.log("Current user:", currentUser); // Debug log

            if (!currentUser) {
                throw new Error("No current user found");
            }

            // Use the direct fetch approach first for debugging
            console.log("Fetching friends for user:", currentUser.id); // Debug log
            const response = await fetch('/api/users/friends', {
                headers: {
                    'userId': currentUser.id
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch friends: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Friends data received:", data); // Debug log
            setCurrentFriends(data);
        } catch (err) {
            console.error('Error in fetchFriends:', err);
            setError(err instanceof Error ? err.message : 'Failed to load families');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFriend = async (friendId: string) => {
        try {
            await userService.removeFriend(friendId);
            await fetchFriends(); // Refresh the list after removal
        } catch (err) {
            console.error('Error removing family:', err);
            setError('Failed to remove family');
        }
    };

    // Filter friends based on search query
    const filteredFriends = currentFriends.filter(friend => 
        friend.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
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
                    
                    {error && (
                        <div className="error-message">
                            {error}
                            <button 
                                className="retry-button"
                                onClick={fetchFriends}
                            >
                                Retry
                            </button>
                        </div>
                    )}
                    
                    {loading ? (
                        <div className="loading">
                            Loading families...
                            <div className="loading-status">
                                Please wait while we fetch your family list...
                            </div>
                        </div>
                    ) : filteredFriends.length === 0 ? (
                        <div className="no-friends">
                            {searchQuery ? 'No families found matching your search' : 'No families added yet'}
                        </div>
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