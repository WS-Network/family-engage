"use client";
import React from "react";
import "./FriendsModal.css";

interface FriendsModalProps {
  friendsModal: boolean;
  setFriendsModal: (value: boolean) => void;
}

function FriendsModal({ friendsModal, setFriendsModal }: FriendsModalProps) {
  const handleBackdropClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target === e.currentTarget) {
      setFriendsModal(false);
    }
  };

  return (
    <>
      <div
        className={`friends-backdrop ${friendsModal ? "active" : ""}`}
        onClick={handleBackdropClick}
      >
        <div className={`friends-modal ${friendsModal ? "active" : ""}`}>
          <p onClick={() => setFriendsModal(false)} className="close-button">
            ✕
          </p>
          <div className="friends-content">
            <h1>Friends List</h1>
          </div>
        </div>
      </div>
    </>
  );
}

export default FriendsModal;
