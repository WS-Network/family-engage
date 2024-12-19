import React, { useState, useEffect } from "react";
import { ProfileData, ProfileEditData } from "./types";
import "./EditProfileModal.css";
import { toast } from "sonner";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      let avatarUrl = currentProfile.avatar;
  
      // Handle avatar upload if a new file is selected
      if (formData.avatar) {
        const uploadData = new FormData();
        uploadData.append("file", formData.avatar);
        uploadData.append("username", formData.username);
  
        const response = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });
  
        if (!response.ok) {
          throw new Error("Failed to upload the profile picture.");
        }
  
        const result = await response.json();
        avatarUrl = result.avatarUrl; // Use uploaded file URL
      }
  
      const updatedData: Partial<ProfileData> = {
        username: formData.username,
        bio: formData.bio,
        avatar: avatarUrl,
        favoriteGame: formData.favoriteGame,
      };
  
      onSave(updatedData); // Call parent function to save changes
      onClose(); // Close the modal
    } catch (error: any) {
      console.error("Error during profile update:", error.message);
      toast.error(error.message || "An error occurred while updating the profile.");
    }
  };
  
  

  if (!isOpen) return null;

  return (
    <div
      className="edit-profile-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
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
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              disabled={isSubmitting} // Disable input while submitting
            />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label>Favorite Game</label>
            <select
              value={formData.favoriteGame}
              onChange={(e) =>
                setFormData({ ...formData, favoriteGame: e.target.value })
              }
              disabled={isSubmitting}
            >
              <option value="">Select a game</option>
              <option value="Flappy Bird">Flappy Bird</option>
              <option value="Paddle Game">Paddle Game</option>
            </select>
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting} // Prevent closing during submission
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
