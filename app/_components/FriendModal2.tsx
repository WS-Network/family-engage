"use client";
import React, { useEffect, useState } from "react";
import { useUserService } from "_services";
import "boxicons/css/boxicons.min.css";
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

interface Message {
    sender: "user" | "friend";
    text: string;
}

function FriendsModal2({ friendsModal, setFriendsModal, friends }: FriendsModalProps) {
    const [currentFriends, setCurrentFriends] = useState<User[]>([]);
    const [messagesList, setMessagesList] = useState<User[]>([]);
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"friends" | "messages" | "chat">("friends");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [invitedFriends, setInvitedFriends] = useState<string[]>([]); // Tracks invited users
    const userService = useUserService();

    useEffect(() => {
        if (friendsModal) {
            fetchFriends();
        }
    }, [friendsModal]);

    const fetchFriends = async () => {
        try {
            setLoading(true);
            setError(null);
            const currentUser = await userService.getCurrent();
            if (!currentUser) {
                throw new Error("No current user found");
            }
            const response = await fetch("/api/users/friends", {
                headers: {
                    userId: currentUser.id,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch friends: ${response.statusText}`);
            }

            const data = await response.json();
            setCurrentFriends(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load families");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFriend = async (friendId: string) => {
        try {
            await userService.removeFriend(friendId);
            fetchFriends();
        } catch (err) {
            setError("Failed to remove family");
        }
    };

    const handleMessageIconClick = (friend: User) => {
        if (!messagesList.some((msg) => msg.id === friend.id)) {
            setMessagesList((prev) => [...prev, friend]);
        }
        setActiveTab("messages");
    };

    const handleOpenChat = (user: User) => {
        setSelectedUser(user);
        setChatMessages([]); // Reset chat for the new user
        setActiveTab("chat");
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        // Add the user's message to the chat
        setChatMessages((prev) => [...prev, { sender: "user", text: newMessage }]);
        setNewMessage("");

        // Simulate a response from the friend
        setTimeout(() => {
            setChatMessages((prev) => [
                ...prev,
                { sender: "friend", text: `Hello! This is a demo reply from ${selectedUser?.firstName}.` },
            ]);
        }, 1000);
    };

    const handleInvite = (friendId: string) => {
        if (!invitedFriends.includes(friendId)) {
            setInvitedFriends((prev) => [...prev, friendId]); // Save the invited user's ID
            localStorage.setItem("invited", "true");
            console.log(`User ID ${friendId} has been invited.`);
        }
    };

    const filteredFriends = currentFriends.filter(
        (friend) =>
            friend.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            friend.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            friend.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`modal ${friendsModal ? "show" : ""}`}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{activeTab === "chat" ? `Chat with ${selectedUser?.firstName}` : "My Families"}</h2>
                    <span className="close" onClick={() => setFriendsModal(false)}>
                        &times;
                    </span>
                </div>
                {activeTab !== "chat" && (
                    <div className="modal-navbar">
                        <button
                            className={`tab-button ${activeTab === "friends" ? "active" : ""}`}
                            onClick={() => setActiveTab("friends")}
                        >
                            Friends
                        </button>
                        <button
                            className={`tab-button ${activeTab === "messages" ? "active" : ""}`}
                            onClick={() => setActiveTab("messages")}
                        >
                            Messages
                        </button>
                    </div>
                )}
                <div className="modal-body">
                    {activeTab === "friends" ? (
                        <>
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
                                    <button className="retry-button" onClick={fetchFriends}>
                                        Retry
                                    </button>
                                </div>
                            )}
                            {loading ? (
                                <div className="loading">Loading families...</div>
                            ) : filteredFriends.length === 0 ? (
                                <div className="no-friends">
                                    {searchQuery
                                        ? "No families found matching your search"
                                        : "No families added yet"}
                                </div>
                            ) : (
                                <div className="friends-list">
                                    {filteredFriends.map((friend) => (
                                        <div key={friend.id} className="friend-item">
                                            <div className="friend-info">
                                                <span className="friend-name">
                                                    {friend.firstName} {friend.lastName}
                                                </span>
                                                <span className="friend-username">
                                                    @{friend.username}
                                                </span>
                                            </div>
                                            <div className="friend-actions">
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleRemoveFriend(friend.id)}
                                                >
                                                    Remove Family
                                                </button>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => handleMessageIconClick(friend)}
                                                >
                                                    <i className="bx bx-chat" />
                                                </button>
                                                <button
                                                    className={`btn btn-sm ${
                                                        invitedFriends.includes(friend.id)
                                                            ? "btn-secondary"
                                                            : "btn-success"
                                                    }`}
                                                    onClick={() => handleInvite(friend.id)}
                                                    disabled={invitedFriends.includes(friend.id)}
                                                >
                                                    {invitedFriends.includes(friend.id)
                                                        ? "Invited"
                                                        : "Invite"}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : activeTab === "messages" ? (
                        <div className="messages-tab">
                            <h3>Messages</h3>
                            {messagesList.length === 0 ? (
                                <p>No messages started yet.</p>
                            ) : (
                                <ul className="messages-list">
                                    {messagesList.map((msg) => (
                                        <li
                                            key={msg.id}
                                            className="message-item"
                                            onClick={() => handleOpenChat(msg)}
                                        >
                                            <span className="message-user">
                                                {msg.firstName} {msg.lastName} (@{msg.username})
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ) : (
                        <div className="chat-ui">
                            <div className="chat-messages">
                                {chatMessages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`chat-message ${
                                            message.sender === "user" ? "user-message" : "friend-message"
                                        }`}
                                    >
                                        {message.text}
                                    </div>
                                ))}
                            </div>
                            <div className="chat-input">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleSendMessage();
                                        }
                                    }}
                                />
                                <button className="btn btn-primary" onClick={handleSendMessage}>
                                    Send
                                </button>
                            </div>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setActiveTab("messages")}
                            >
                                Back to Messages
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FriendsModal2;
