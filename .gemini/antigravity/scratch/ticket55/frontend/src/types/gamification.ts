export interface Achievement {
    id: string;
    userId: string;
    type: string;
    title: string;
    description: string;
    points: number;
    badge: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    earnedAt: string;
    expiresAt?: string;
    metadata?: any;
}

export interface LeaderboardEntry {
    userId: string;
    userName: string;
    userAvatar?: string;
    totalPoints: number;
    weeklyPoints: number;
    monthlyPoints: number;
    level: number;
    streak: number;
    lastActive: string;
    achievements: string[];
    rank: number;
}

export interface UserLevel {
    userId: string;
    currentLevel: number;
    totalXP: number;
    xpToNextLevel: number;
    levelProgress: number;
    unlockedBadges: string[];
    title: string;
}

export interface GamificationStats {
    achievementsCount: number;
    leaderboardEntry: LeaderboardEntry | null;
    userLevel: UserLevel | null;
}

export interface GlobalStats {
    totalAchievements: number;
    totalUsersWithAchievements: number;
    rarestAchievement: string;
    mostActiveUser: string;
}

export interface AchievementNotification {
    achievement: Achievement;
    isNew: boolean;
    showConfetti: boolean;
}
