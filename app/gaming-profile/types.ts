export interface Achievement {
    id: string;
    gameName: string;
    name: string;
    description: string;
    rarity: "Common" | "Rare" | "Epic" | "Legendary";
    dateUnlocked: string;
    icon: string;
    unlockedPercentage: number;
  }
  
  export interface Game {
    id: string;
    name: string;
    hoursPlayed: number;
    lastPlayed: string;
    achievementsUnlocked: number;
    totalAchievements: number;
  }
  
  export interface ProfileData {
    username: string;
    level: number;
    avatar?: string;
    bio: string;
    favoriteGame?: string;
    totalPlayTime: number;
    achievements: Achievement[];
    playedGames: Game[];
  }
  
  export interface ProfileEditData {
    username: string;
    avatar?: File | null;
    bio: string;
    favoriteGame: string;
  }
  