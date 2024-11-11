// app/gaming-profile/EditProfileModal.tsx
import React, { useState, useEffect } from 'react';
import './EditProfileModal.css';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (profileData: ProfileEditData) => void;
    currentProfile: {
        username: string;
        avatar?: string;
        bio?: string;
        favoriteGame?: string;
    } | null;
}

interface ProfileEditData {
    username: string;
    avatar?: File | null;
    bio: string;
    favoriteGame: string;
}

export default function EditProfileModal({ isOpen, onClose, onSave, currentProfile }: EditProfileModalProps) {
    const [formData, setFormData] = useState<ProfileEditData>({
        username: currentProfile?.username || '',
        avatar: null,
        bio: currentProfile?.bio || '',
        favoriteGame: currentProfile?.favoriteGame || ''
    });
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (currentProfile) {
            setFormData({
                username: currentProfile.username,
                avatar: null,
                bio: currentProfile.bio || '',
                favoriteGame: currentProfile.favoriteGame || ''
            });
        }
    }, [currentProfile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('Image size should be less than 5MB');
                return;
            }
            setFormData({ ...formData, avatar: file });
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.username.trim()) {
            setError('Username is required');
            return;
        }
        onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="edit-profile-modal-backdrop">
            <div className="edit-profile-modal">
                <div className="edit-profile-header">
                    <h2>Edit Profile</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="edit-profile-form">
                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="form-group">
                        <label>Profile Picture</label>
                        <div className="avatar-upload">
                            <div className="avatar-preview">
                                {(previewUrl || currentProfile?.avatar) && (
                                    <img 
                                        src={previewUrl || currentProfile?.avatar || '/api/placeholder/150/150'} 
                                        alt="Profile Preview" 
                                    />
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="file-input"
                                id="avatar-upload"
                            />
                            <label htmlFor="avatar-upload" className="upload-button">
                                Choose Image
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            placeholder="Enter username"
                            maxLength={30}
                        />
                    </div>

                    <div className="form-group">
                        <label>Bio</label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Tell us about yourself..."
                            maxLength={200}
                            rows={4}
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

                    <div className="button-group">
                        <button type="button" onClick={onClose} className="cancel-button">
                            Cancel
                        </button>
                        <button type="submit" className="save-button">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}