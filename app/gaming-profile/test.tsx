"use client";
import { useState, useEffect } from "react";
import { useUserService } from "_services";
import { Nav } from "_components";
import EditProfileModal from "./EditProfileModal";
import "./GamingProfile.css";

interface Achievement {
  id: string;
  gameName: string;
  name: string;
  description: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  dateUnlocked: string;
  icon: string;
  unlockedPercentage: number;
}

interface Game {
  id: string;
  name: string;
  hoursPlayed: number;
  lastPlayed: string;
  achievementsUnlocked: number;
  totalAchievements: number;
}

interface ProfileData {
  username: string;
  level: number;
  avatar?: string;
  bio: string;
  totalPlayTime: number;
  achievements: Achievement[];
  playedGames: Game[];
}

export default function GamingProfile() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const userService = useUserService();

  useEffect(() => {
    console.log("useEffect triggered");

    const fetchProfileData = async () => {
      try {
        const user = await userService.getCurrent();
        console.log("Fetched user:", user);

        // Mock data - replace with actual API call
        const mockData: ProfileData = {
          username: user?.username || "Player",
          level: 42,
          bio: "Passionate gamer who loves casual games!",
          totalPlayTime: 1250,
          playedGames: [
            {
              id: "flappy",
              name: "Flappy Bird",
              hoursPlayed: 150,
              lastPlayed: "2024-03-10",
              achievementsUnlocked: 4,
              totalAchievements: 4,
            },
            {
              id: "paddle",
              name: "Paddle Game",
              hoursPlayed: 80,
              lastPlayed: "2024-03-09",
              achievementsUnlocked: 4,
              totalAchievements: 4,
            },
          ],
          achievements: [
            {
              id: "fb1",
              gameName: "Flappy Bird",
              name: "First Flight",
              description: "Score your first point",
              rarity: "Common",
              dateUnlocked: "2024-03-01",
              icon: "🐤",
              unlockedPercentage: 95,
            },
            {
              id: "fb2",
              gameName: "Flappy Bird",
              name: "High Flyer",
              description: "Achieve a score of 50 points",
              rarity: "Rare",
              dateUnlocked: "2024-03-05",
              icon: "🦅",
              unlockedPercentage: 45,
            },
            {
              id: "pg1",
              gameName: "Paddle Game",
              name: "First Victory",
              description: "Win your first game",
              rarity: "Common",
              dateUnlocked: "2024-03-02",
              icon: "🏓",
              unlockedPercentage: 90,
            },
            {
              id: "pg2",
              gameName: "Paddle Game",
              name: "Champion",
              description: "Win 10 games in a row",
              rarity: "Epic",
              dateUnlocked: "2024-03-07",
              icon: "🏆",
              unlockedPercentage: 15,
            },
          ],
        };

        setProfileData(mockData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to ensure it runs only once on mount

  const handleProfileUpdate = async (editedProfile: any) => {
    try {
      setProfileData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          username: editedProfile.username,
          bio: editedProfile.bio,
          avatar: editedProfile.avatar
            ? URL.createObjectURL(editedProfile.avatar)
            : prev.avatar,
          playedGames: editedProfile.playedGames || prev.playedGames,
          achievements: editedProfile.achievements || prev.achievements,
        };
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "#7E8C8D";
      case "Rare":
        return "#2980B9";
      case "Epic":
        return "#8E44AD";
      case "Legendary":
        return "#F1C40F";
      default:
        return "#95A5A6";
    }
  };

  if (loading || !profileData) {
    return (
      <div>
        <Nav />
        <div className="container">
          <div className="loading-spinner">Loading profile...</div>
        </div>
      </div>
    );
  }

  const playedGames = profileData.playedGames || [];
  const achievements = profileData.achievements || [];

  return (
    <div style={{ marginTop: "5rem" }}>
      <Nav />
      <div className="gaming-profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <img
              // src={profileData.avatar || "/api/placeholder/150/150"}
              alt="Profile Avatar"
            />
            <div className="level-badge">Level {profileData.level}</div>
          </div>
          <div className="profile-info">
            <div className="profile-header-top">
              <h1>{profileData.username}'s Gaming Profile</h1>
              <button
                className="edit-profile-button"
                onClick={() => setIsEditModalOpen(true)}
              >
                Edit Profile
              </button>
            </div>
            <p className="profile-bio">{profileData.bio}</p>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-label">Total Play Time</span>
                <span className="stat-value">
                  {profileData.totalPlayTime} hours
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Games Played</span>
                <span className="stat-value">{playedGames.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Achievements</span>
                <span className="stat-value">{achievements.length} Unlocked</span>
              </div>
            </div>
          </div>
        </div>

        <div className="played-games-section">
          <h2>Played Games</h2>
          <div className="played-games-grid">
            {playedGames.map((game) => (
              <div key={game.id} className="played-game-card">
                <div className="game-icon">
                  {game.name === "Flappy Bird" ? "🐤" : "🏓"}
                </div>
                <div className="game-details">
                  <h3>{game.name}</h3>
                  <div className="game-stats">
                    <div className="stat">
                      <span className="stat-label">Hours Played</span>
                      <span className="stat-value">{game.hoursPlayed}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Last Played</span>
                      <span className="stat-value">
                        {new Date(game.lastPlayed).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Achievements</span>
                      <span className="stat-value">
                        {game.achievementsUnlocked}/{game.totalAchievements}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="achievements-section">
          <h2>Achievements</h2>
          <div className="achievements-grid">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="achievement-card"
                style={{ borderColor: getRarityColor(achievement.rarity) }}
              >
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-info">
                  <h3>{achievement.name}</h3>
                  <p className="achievement-description">
                    {achievement.description}
                  </p>
                  <div className="achievement-meta">
                    <span className="achievement-game">
                      {achievement.gameName}
                    </span>
                    <span
                      className="achievement-rarity"
                      style={{ color: getRarityColor(achievement.rarity) }}
                    >
                      {achievement.rarity}
                    </span>
                  </div>
                  <div className="achievement-stats">
                    <span className="achievement-date">
                      Unlocked:{" "}
                      {new Date(achievement.dateUnlocked).toLocaleDateString()}
                    </span>
                    <span className="achievement-percentage">
                      {achievement.unlockedPercentage}% of players
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentProfile={profileData}
          onSave={handleProfileUpdate}
        />
      </div>
    </div>
  );
}