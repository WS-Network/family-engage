import React, { useState, useEffect } from "react";
import { ProfileData, ProfileEditData } from "./types";
import "./EditProfileModal.css";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: Partial<ProfileData>) => void;
  currentProfile: ProfileData;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  onSave,
  currentProfile,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState<ProfileEditData>({
    username: currentProfile.username,
    avatar: null,
    bio: currentProfile.bio,
    favoriteGame: currentProfile.favoriteGame || "",
  });
  const [previewUrl, setPreviewUrl] = useState<string>(
    currentProfile.avatar || ""
  );

  useEffect(() => {
    setFormData({
      username: currentProfile.username,
      avatar: null,
      bio: currentProfile.bio,
      favoriteGame: currentProfile.favoriteGame || "",
    });
    setPreviewUrl(currentProfile.avatar || "");
  }, [currentProfile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      username: formData.username,
      bio: formData.bio,
      favoriteGame: formData.favoriteGame,
      avatar: formData.avatar ? URL.createObjectURL(formData.avatar) : currentProfile.avatar,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="edit-profile-modal-backdrop">
      <div className="edit-profile-modal">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Profile Picture</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {previewUrl && <img src={previewUrl} alt="Avatar Preview" />}
          </div>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Favorite Game</label>
            <select
              value={formData.favoriteGame}
              onChange={(e) => setFormData({ ...formData, favoriteGame: e.target.value })}
            >
              <option value="">Select a game</option>
              <option value="Flappy Bird">Flappy Bird</option>
              <option value="Paddle Game">Paddle Game</option>
            </select>
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
