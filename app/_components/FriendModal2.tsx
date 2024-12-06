"use client";

import React, { useEffect, useState } from "react";
import { useUserService } from "_services";
import "./FriendModal2.css";
import { db } from "../config/firebaseConfig";
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

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
    sender: string; // The sender's ID
    text: string;
    timestamp: string;
}

const FriendsModal2: React.FC<FriendsModalProps> = ({ friendsModal, setFriendsModal }) => {
    const [userId, setUserId] = useState<string | null>(null);
    const [currentFriends, setCurrentFriends] = useState<User[]>([]);
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [activeTab, setActiveTab] = useState<"friends" | "chat">("friends");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const userService = useUserService();

    // Fetch the user ID on mount
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const currentUser = await userService.getCurrent();
                if (currentUser) {
                    setUserId(currentUser.id);
                } else {
                    console.error("No current user found");
                }
            } catch (err) {
                console.error("Error fetching user ID:", err);
            }
        };

        fetchUserId();
    }, []);

    // Fetch friends when the modal is opened
    useEffect(() => {
        if (friendsModal && userId) {
            fetchFriends();
        }
    }, [friendsModal, userId]);

    const fetchFriends = async () => {
        if (!userId) {
            console.error("User ID is not available");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await fetch("/api/users/friends", {
                headers: { userId },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch friends: ${response.statusText}`);
            }

            const data = await response.json();
            setCurrentFriends(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch friends");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenChat = (user: User) => {
        setSelectedUser(user);
        setChatMessages([]);
        setActiveTab("chat");

        if (!userId) {
            console.error("User ID is not available");
            return;
        }

        const chatId = generateChatId(user.id);

        const messagesQuery = query(
            collection(db, "messages"),
            where("chatId", "==", chatId),
            orderBy("timestamp", "asc")
        );

        onSnapshot(messagesQuery, (snapshot) => {
            const messages = snapshot.docs.map((doc) => ({
                sender: doc.data().sender,
                text: doc.data().text,
                timestamp: doc.data().timestamp,
            }));
            setChatMessages(messages);
        });
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedUser) {
            console.error("Message is empty or no user selected");
            return;
        }

        if (!userId) {
            console.error("User ID is not available");
            return;
        }

        const chatId = generateChatId(selectedUser.id);

        const newMessageObject = {
            chatId,
            sender: userId, // Use the current user's ID to identify sent messages
            text: newMessage,
            timestamp: serverTimestamp(),
        };

        try {
            await addDoc(collection(db, "messages"), newMessageObject);
            setNewMessage("");
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    const generateChatId = (friendId: string): string => {
        return [userId, friendId].sort().join("_");
    };

    const filteredFriends = currentFriends.filter((friend) =>
        [friend.username, friend.firstName, friend.lastName]
            .some((field) => field?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <>
            <div className={`friends-backdrop ${friendsModal ? "active" : ""}`} onClick={() => setFriendsModal(false)}>
                <div className="friends-modal" onClick={(e) => e.stopPropagation()}>
                    <span className="close-button" onClick={() => setFriendsModal(false)}>
                        &times;
                    </span>
                    <div className="friends-content">
                        <h1>{activeTab === "chat" ? `Chat with ${selectedUser?.firstName}` : "Friends"}</h1>
                        {activeTab === "friends" && (
                            <>
                                <input
                                    type="text"
                                    className="search-bar"
                                    placeholder="Search friends..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {error && <div className="error">{error}</div>}
                                {loading ? (
                                    <div className="loading">Loading friends...</div>
                                ) : filteredFriends.length === 0 ? (
                                    <div className="no-friends">No friends found</div>
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
                                                    className="add-friend-button"
                                                    onClick={() => handleOpenChat(friend)}
                                                >
                                                    Chat
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                        {activeTab === "chat" && selectedUser && (
                            <div className="chat">
                                <div className="chat-messages">
                                    {chatMessages.map((msg, i) => (
                                        <div
                                            key={i}
                                            className={`chat-message ${
                                                msg.sender === userId ? "sent" : "received"
                                            }`}
                                        >
                                            <span>{msg.text}</span>
                                        </div>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    className="search-bar"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                />
                                <button className="add-friend-button" onClick={handleSendMessage}>
                                    Send
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default FriendsModal2;
