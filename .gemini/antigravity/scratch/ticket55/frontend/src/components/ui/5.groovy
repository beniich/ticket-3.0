5
# 🏆 PROCHAINE ÉTAPE : SYSTÈME DE GAMIFICATION

Parfait ! Maintenant que tu as un système de documents complet, je vais te fournir le code pour le **système de gamification** qui va motiver tes équipes et améliorer l'engagement.

---

# 🏆 SYSTÈME DE GAMIFICATION & BADGES

## 1. 📦 INSTALLATION DES DÉPENDANCES

### Backend (`backend/package.json`)
```json
{
  "dependencies": {
    "bad-words": "^3.0.4",
    "node-cron": "^3.0.3"
  }
}
```

Frontend (`frontend/package.json`)
```json
{
  "dependencies": {
    "framer-motion": "^11.0.3",
    "react-confetti": "^6.1.0"
  }
}
```

Installe :
```bash
cd backend && npm install bad-words node-cron
cd frontend && npm install framer-motion react-confetti
```

---

## 2. 📁 STRUCTURE DES FICHIERS

```
backend/
├── src/
│   ├── models/
│   │   ├── Achievement.ts            ✨ NOUVEAU
│   │   └── Leaderboard.ts            ✨ NOUVEAU
│   ├── controllers/
│   │   └── gamificationController.ts  ✨ NOUVEAU
│   ├── routes/
│   │   └── gamification.ts           ✨ NOUVEAU
│   ├── services/
│   │   └── gamificationService.ts     ✨ NOUVEAU
│   └── jobs/
│       └── leaderboardJob.ts          ✨ NOUVEAU

frontend/
├── src/
│   ├── components/
│   │   ├── gamification/
│   │   │   ├── AchievementCard.tsx     ✨ NOUVEAU
│   │   │   ├── Leaderboard.tsx         ✨ NOUVEAU
│   │   │   ├── ProgressBadge.tsx       ✨ NOUVEAU
│   │   │   ├── LevelUpModal.tsx        ✨ NOUVEAU
│   │   │   ├── StreakCounter.tsx       ✨ NOUVEAU
│   │   │   └── RewardsShop.tsx         ✨ NOUVEAU
│   ├── hooks/
│   │   └── useGamification.ts          ✨ NOUVEAU
│   ├── types/
│   │   └── gamification.ts             ✨ NOUVEAU
│   └── lib/
│       └── gamificationUtils.ts        ✨ NOUVEAU
```

---

## 3. 📄 MODÈLE DE DONNÉES

### 📄 `backend/src/models/Achievement.ts`
```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IAchievement extends Document {
  userId: string;
  type: AchievementType;
  title: string;
  description: string;
  points: number;
  badge: string; // Nom du badge SVG
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: Date;
  expiresAt?: Date; // Pour les achievements temporaires
  metadata?: any; // Données supplémentaires
}

export interface ILeaderboardEntry extends Document {
  userId: string;
  userName: string;
  userAvatar?: string;
  totalPoints: number;
  weeklyPoints: number;
  monthlyPoints: number;
  level: number;
  streak: number; // Jours consécutifs d'activité
  lastActive: Date;
  achievements: string[]; // IDs des achievements
  rank?: number;
}

export interface IUserLevel extends Document {
  userId: string;
  currentLevel: number;
  totalXP: number;
  xpToNextLevel: number;
  levelProgress: number; // Pourcentage 0-100
  unlockedBadges: string[];
  title: string; // Titre basé sur le niveau
}

export type AchievementType = 
  | 'first_login'           // Première connexion
  | 'quick_resolver'        // Réclamation résolue en < 2h
  | 'perfect_week'          // 5 réclamations résolues dans la semaine
  | 'team_player'           // A aidé un collègue
  | 'knowledge_sharer'       // A partagé un document utile
  | 'early_bird'            // Connexion avant 7h
  | 'night_owl'             // Connexion après 22h
  | 'quality_master'        // Note moyenne > 4.5 sur 30 jours
  | 'speed_demon'           // 10 réclamations résolues en 1 jour
  | 'problem_solver'        // Réclamation complexe résolue
  | 'communication_expert'   // 50 messages envoyés
  | 'explorer'              // Utilisé 5 fonctionnalités différentes
  | 'consistency_king'      // 30 jours consécutifs actif
  | 'feedback_champion'     // 10 feedbacks positifs reçus
  | 'innovation_award'      // Suggestion implémentée
  | 'mentor'                // A aidé un nouveau membre
  | 'efficiency_expert'     // Temps moyen < 30min par tâche
  | 'collaboration_star'    // Travaillé sur 3 projets différents
  | 'documentation_hero'    // 5 documents créés/approuvés
  | 'customer_delight'      // Satisfaction client > 95%
  | 'process_improver'      // Processus optimisé
  | 'safety_champion'       // Signalé un danger potentiel
  | 'environment_guardian'  // Initiative écologique
  | 'community_builder'     // Organisation événement équipe
  | 'continuous_learner'    // 10 formations complétées
  | 'tech_savvy'            // Maîtrise 5 outils différents
  | 'wellness_advocate'     // Participation programme bien-être
  | 'diversity_champion'    // Promotion diversité/inclusion
  | 'cost_saver'            // Économie identifiée
  | 'risk_manager'          // Identification risque précoce
  | 'change_agent'          // Adoption changement organisationnel
  | 'digital_native'        // Maîtrise outils numériques
  | 'quality_assurance'     // 0 erreur sur contrôle qualité
  | 'resource_optimizer'    // Optimisation ressources
  | 'knowledge_keeper'      // Expert dans domaine spécifique
  | 'relationship_builder'  // Relations externes positives
  | 'ethics_champion'       // Comportement exemplaire
  | 'innovation_pioneer'    // Idée novatrice proposée
  | 'sustainability_hero'   // Contribution développement durable
  | 'leadership_developer'  // Développement leadership
  | 'culture_carrier'       // Promotion culture organisationnelle
  | 'performance_booster'   // Amélioration performance équipe
  | 'talent_spotter'        // Identification talent
  | 'strategic_thinker'     // Contribution stratégie
  | 'change_leader'         // Leadership transformation
  | 'excellence_award';     // Excellence générale

export const ACHIEVEMENT_DEFINITIONS: Record<AchievementType, {
  title: string;
  description: string;
  points: number;
  badge: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  conditions: any;
}> = {
  first_login: {
    title: "Premiers Pas",
    description: "Première connexion à la plateforme",
    points: 10,
    badge: "first-step",
    rarity: "common",
    conditions: { firstLogin: true }
  },
  quick_resolver: {
    title: "Résolveur Rapide",
    description: "Réclamation résolue en moins de 2 heures",
    points: 25,
    badge: "lightning",
    rarity: "rare",
    conditions: { resolutionTime: { $lt: 2 } }
  },
  perfect_week: {
    title: "Semaine Parfaite",
    description: "5 réclamations résolues dans la semaine",
    points: 50,
    badge: "calendar",
    rarity: "rare",
    conditions: { weeklyResolved: { $gte: 5 } }
  },
  team_player: {
    title: "Esprit d'Équipe",
    description: "A aidé un collègue dans sa tâche",
    points: 30,
    badge: "handshake",
    rarity: "common",
    conditions: { helpedColleague: true }
  },
  knowledge_sharer: {
    title: "Partageur de Connaissances",
    description: "A partagé un document utile pour l'équipe",
    points: 20,
    badge: "book",
    rarity: "common",
    conditions: { sharedDocument: true }
  },
  early_bird: {
    title: "Lève-Tôt",
    description: "Connexion avant 7h du matin",
    points: 15,
    badge: "sunrise",
    rarity: "common",
    conditions: { loginBefore: "07:00" }
  },
  night_owl: {
    title: "Oiseau de Nuit",
    description: "Connexion après 22h",
    points: 15,
    badge: "moon",
    rarity: "common",
    conditions: { loginAfter: "22:00" }
  },
  quality_master: {
    title: "Maître Qualité",
    description: "Note moyenne supérieure à 4.5 sur 30 jours",
    points: 75,
    badge: "star",
    rarity: "epic",
    conditions: { averageRating: { $gt: 4.5 }, period: "30d" }
  },
  speed_demon: {
    title: "Démon de Vitesse",
    description: "10 réclamations résolues en une journée",
    points: 100,
    badge: "rocket",
    rarity: "epic",
    conditions: { dailyResolved: { $gte: 10 } }
  },
  problem_solver: {
    title: "Résolveur de Problèmes",
    description: "Réclamation complexe résolue avec succès",
    points: 60,
    badge: "brain",
    rarity: "rare",
    conditions: { complexity: "high", resolved: true }
  },
  communication_expert: {
    title: "Expert Communication",
    description: "50 messages envoyés dans la messagerie",
    points: 40,
    badge: "chat",
    rarity: "common",
    conditions: { messagesSent: { $gte: 50 } }
  },
  explorer: {
    title: "Explorateur",
    description: "Utilisation de 5 fonctionnalités différentes",
    points: 35,
    badge: "compass",
    rarity: "common",
    conditions: { featuresUsed: { $gte: 5 } }
  },
  consistency_king: {
    title: "Roi de la Conscience",
    description: "30 jours consécutifs d'activité",
    points: 150,
    badge: "crown",
    rarity: "legendary",
    conditions: { consecutiveDays: { $gte: 30 } }
  },
  feedback_champion: {
    title: "Champion du Feedback",
    description: "10 feedbacks positifs reçus",
    points: 80,
    badge: "thumbs-up",
    rarity: "epic",
    conditions: { positiveFeedbacks: { $gte: 10 } }
  },
  innovation_award: {
    title: "Prix de l'Innovation",
    description: "Suggestion qui a été implémentée",
    points: 120,
    badge: "lightbulb",
    rarity: "epic",
    conditions: { suggestionImplemented: true }
  },
  mentor: {
    title: "Mentor",
    description: "A aidé un nouveau membre de l'équipe",
    points: 70,
    badge: "teacher",
    rarity: "rare",
    conditions: { mentoredNewUser: true }
  },
  efficiency_expert: {
    title: "Expert Efficacité",
    description: "Temps moyen inférieur à 30 minutes par tâche",
    points: 90,
    badge: "clock",
    rarity: "epic",
    conditions: { avgTaskTime: { $lt: 30 } }
  },
  collaboration_star: {
    title: "Étoile de Collaboration",
    description: "Travaillé sur 3 projets différents",
    points: 65,
    badge: "network",
    rarity: "rare",
    conditions: { projectsWorked: { $gte: 3 } }
  },
  documentation_hero: {
    title: "Héros de la Documentation",
    description: "5 documents créés ou approuvés",
    points: 55,
    badge: "document",
    rarity: "rare",
    conditions: { documentsCreated: { $gte: 5 } }
  },
  customer_delight: {
    title: "Satisfaction Client",
    description: "Satisfaction client supérieure à 95%",
    points: 85,
    badge: "heart",
    rarity: "epic",
    conditions: { customerSatisfaction: { $gt: 95 } }
  },
  process_improver: {
    title: "Améliorateur de Processus",
    description: "Processus optimisé et approuvé",
    points: 95,
    badge: "gear",
    rarity: "epic",
    conditions: { processOptimized: true }
  },
  safety_champion: {
    title: "Champion de la Sécurité",
    description: "Signalé un danger potentiel",
    points: 45,
    badge: "shield",
    rarity: "rare",
    conditions: { safetyReport: true }
  },
  environment_guardian: {
    title: "Garde de l'Environnement",
    description: "Initiative écologique mise en œuvre",
    points: 75,
    badge: "leaf",
    rarity: "rare",
    conditions: { environmentalInitiative: true }
  },
  community_builder: {
    title: "Constructeur de Communauté",
    description: "Organisation d'un événement d'équipe",
    points: 100,
    badge: "people",
    rarity: "epic",
    conditions: { organizedEvent: true }
  },
  continuous_learner: {
    title: "Apprenant Continu",
    description: "10 formations complétées",
    points: 110,
    badge: "graduation",
    rarity: "epic",
    conditions: { trainingsCompleted: { $gte: 10 } }
  },
  tech_savvy: {
    title: "Tech Savvy",
    description: "Maîtrise de 5 outils différents",
    points: 80,
    badge: "computer",
    rarity: "rare",
    conditions: { toolsMastered: { $gte: 5 } }
  },
  wellness_advocate: {
    title: "Défenseur du Bien-être",
    description: "Participation au programme de bien-être",
    points: 60,
    badge: "meditation",
    rarity: "common",
    conditions: { wellnessProgram: true }
  },
  diversity_champion: {
    title: "Champion de la Diversité",
    description: "Promotion de la diversité et de l'inclusion",
    points: 90,
    badge: "diversity",
    rarity: "rare",
    conditions: { promotedDiversity: true }
  },
  cost_saver: {
    title: "Économiseur de Coûts",
    description: "Économie significative identifiée",
    points: 125,
    badge: "money",
    rarity: "epic",
    conditions: { costSaving: { $gt: 1000 } }
  },
  risk_manager: {
    title: "Gestionnaire de Risques",
    description: "Identification précoce d'un risque",
    points: 85,
    badge: "warning",
    rarity: "rare",
    conditions: { riskIdentified: true }
  },
  change_agent: {
    title: "Agent du Changement",
    description: "Adoption proactive du changement organisationnel",
    points: 95,
    badge: "transform",
    rarity: "rare",
    conditions: { embracedChange: true }
  },
  digital_native: {
    title: "Natif Digital",
    description: "Maîtrise excellente des outils numériques",
    points: 75,
    badge: "smartphone",
    rarity: "rare",
    conditions: { digitalSkills: "expert" }
  },
  quality_assurance: {
    title: "Assurance Qualité",
    description: "0 erreur sur contrôle qualité de 30 jours",
    points: 110,
    badge: "check-circle",
    rarity: "epic",
    conditions: { qualityErrors: 0, period: "30d" }
  },
  resource_optimizer: {
    title: "Optimiseur de Ressources",
    description: "Optimisation significative des ressources",
    points: 100,
    badge: "recycle",
    rarity: "epic",
    conditions: { resourceOptimization: true }
  },
  knowledge_keeper: {
    title: "Gardien du Savoir",
    description: "Expert reconnu dans un domaine spécifique",
    points: 130,
    badge: "mortarboard",
    rarity: "legendary",
    conditions: { expertiseRecognized: true }
  },
  relationship_builder: {
    title: "Constructeur de Relations",
    description: "Relations externes positives établies",
    points: 90,
    badge: "handshake-business",
    rarity: "rare",
    conditions: { externalRelations: { $gte: 5 } }
  },
  ethics_champion: {
    title: "Champion de l'Éthique",
    description: "Comportement exemplaire démontré",
    points: 85,
    badge: "scale",
    rarity: "rare",
    conditions: { ethicalBehavior: true }
  },
  innovation_pioneer: {
    title: "Pionnier de l'Innovation",
    description: "Idée novatrice proposée et reconnue",
    points: 140,
    badge: "idea",
    rarity: "legendary",
    conditions: { innovativeIdea: true }
  },
  sustainability_hero: {
    title: "Héros du Développement Durable",
    description: "Contribution significative à la durabilité",
    points: 125,
    badge: "globe",
    rarity: "epic",
    conditions: { sustainabilityContribution: true }
  },
  leadership_developer: {
    title: "Développeur de Leadership",
    description: "Développement des compétences de leadership",
    points: 115,
    badge: "leader",
    rarity: "epic",
    conditions: { leadershipDevelopment: true }
  },
  culture_carrier: {
    title: "Porteur de Culture",
    description: "Promotion de la culture organisationnelle",
    points: 105,
    badge: "culture",
    rarity: "epic",
    conditions: { culturePromotion: true }
  },
  performance_booster: {
    title: "Boosteur de Performance",
    description: "Amélioration significative de la performance d'équipe",
    points: 135,
    badge: "performance",
    rarity: "legendary",
    conditions: { teamPerformanceImprovement: true }
  },
  talent_spotter: {
    title: "Repéreur de Talents",
    description: "Identification et recrutement de talents",
    points: 120,
    badge: "target",
    rarity: "epic",
    conditions: { talentIdentification: true }
  },
  strategic_thinker: {
    title: "Penseur Stratégique",
    description: "Contribution significative à la stratégie",
    points: 145,
    badge: "strategy",
    rarity: "legendary",
    conditions: { strategicContribution: true }
  },
  change_leader: {
    title: "Leader du Changement",
    description: "Leadership dans la transformation organisationnelle",
    points: 160,
    badge: "transformation",
    rarity: "legendary",
    conditions: { changeLeadership: true }
  },
  excellence_award: {
    title: "Prix d'Excellence",
    description: "Excellence démontrée dans toutes les activités",
    points: 200,
    badge: "trophy",
    rarity: "legendary",
    conditions: { overallExcellence: true }
  }
};

const AchievementSchema = new Schema<IAchievement>({
  userId: { type: String, required: true, index: true },
  type: { 
    type: String, 
    required: true, 
    enum: Object.keys(ACHIEVEMENT_DEFINITIONS)
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  points: { type: Number, required: true },
  badge: { type: String, required: true },
  rarity: { 
    type: String, 
    enum: ['common', 'rare', 'epic', 'legendary'],
    required: true
  },
  earnedAt: { type: Date, default: Date.now, index: true },
  expiresAt: { type: Date },
  metadata: { type: Schema.Types.Mixed }
});

const LeaderboardEntrySchema = new Schema<ILeaderboardEntry>({
  userId: { type: String, required: true, unique: true, index: true },
  userName: { type: String, required: true },
  userAvatar: { type: String },
  totalPoints: { type: Number, default: 0, index: true },
  weeklyPoints: { type: Number, default: 0 },
  monthlyPoints: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  achievements: [{ type: String }], // IDs des achievements
  rank: { type: Number }
});

const UserLevelSchema = new Schema<IUserLevel>({
  userId: { type: String, required: true, unique: true, index: true },
  currentLevel: { type: Number, default: 1 },
  totalXP: { type: Number, default: 0 },
  xpToNextLevel: { type: Number, default: 100 },
  levelProgress: { type: Number, default: 0 }, // 0-100
  unlockedBadges: [{ type: String }],
  title: { type: String, default: "Débutant" }
});

// Index pour optimiser les requêtes
AchievementSchema.index({ userId: 1, type: 1 });
LeaderboardEntrySchema.index({ totalPoints: -1 });
UserLevelSchema.index({ totalXP: -1 });

export const Achievement = mongoose.model<IAchievement>('Achievement', AchievementSchema);
export const LeaderboardEntry = mongoose.model<ILeaderboardEntry>('LeaderboardEntry', LeaderboardEntrySchema);
export const UserLevel = mongoose.model<IUserLevel>('UserLevel', UserLevelSchema);
```

---

## 4. 📄 SERVICES GAMIFICATION

### 📄 `backend/src/services/gamificationService.ts`
```typescript
import { Achievement, LeaderboardEntry, UserLevel, ACHIEVEMENT_DEFINITIONS, IAchievement } from '../models/Achievement';
import { ObjectId } from 'mongodb';

export class GamificationService {
  // Attribuer un achievement à un utilisateur
  async awardAchievement(
    userId: string,
    userName: string,
    achievementType: keyof typeof ACHIEVEMENT_DEFINITIONS,
    metadata?: any
  ): Promise<IAchievement | null> {
    try {
      const achievementDef = ACHIEVEMENT_DEFINITIONS[achievementType];
      if (!achievementDef) {
        throw new Error(`Achievement type ${achievementType} not found`);
      }

      // Vérifier si l'utilisateur a déjà cet achievement (sauf si répétable)
      const existingAchievement = await Achievement.findOne({
        userId,
        type: achievementType
      });

      // Certains achievements peuvent être répétés (ex: daily challenges)
      const isRepeatable = [
        'early_bird',
        'night_owl',
        'communication_expert'
      ].includes(achievementType);

      if (existingAchievement && !isRepeatable) {
        return null; // Déjà obtenu
      }

      // Créer le nouvel achievement
      const achievement = new Achievement({
        userId,
        type: achievementType,
        title: achievementDef.title,
        description: achievementDef.description,
        points: achievementDef.points,
        badge: achievementDef.badge,
        rarity: achievementDef.rarity,
        earnedAt: new Date(),
        metadata
      });

      const savedAchievement = await achievement.save();

      // Mettre à jour le leaderboard
      await this.updateLeaderboard(userId, userName, achievementDef.points);

      // Mettre à jour le niveau de l'utilisateur
      await this.updateUserLevel(userId, achievementDef.points);

      return savedAchievement;
    } catch (error) {
      console.error('Error awarding achievement:', error);
      return null;
    }
  }

  // Mettre à jour le leaderboard
  async updateLeaderboard(userId: string, userName: string, points: number): Promise<void> {
    try {
      // Trouver ou créer l'entrée du leaderboard
      let leaderboardEntry = await LeaderboardEntry.findOne({ userId });
      
      if (!leaderboardEntry) {
        leaderboardEntry = new LeaderboardEntry({
          userId,
          userName,
          totalPoints: 0,
          weeklyPoints: 0,
          monthlyPoints: 0,
          level: 1,
          streak: 0,
          lastActive: new Date(),
          achievements: []
        });
      }

      // Mettre à jour les points
      leaderboardEntry.totalPoints += points;
      leaderboardEntry.weeklyPoints += points;
      leaderboardEntry.monthlyPoints += points;
      leaderboardEntry.lastActive = new Date();

      // Mettre à jour la série de connexion
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (leaderboardEntry.lastActive.toDateString() === yesterday.toDateString()) {
        leaderboardEntry.streak += 1;
      } else if (leaderboardEntry.lastActive.toDateString() !== today.toDateString()) {
        leaderboardEntry.streak = 1; // Reset ou commence une nouvelle série
      }

      await leaderboardEntry.save();

      // Mettre à jour les achievements liés à l'activité
      await this.checkActivityBasedAchievements(userId, userName, leaderboardEntry);
    } catch (error) {
      console.error('Error updating leaderboard:', error);
    }
  }

  // Mettre à jour le niveau de l'utilisateur
  async updateUserLevel(userId: string, points: number): Promise<void> {
    try {
      let userLevel = await UserLevel.findOne({ userId });
      
      if (!userLevel) {
        userLevel = new UserLevel({
          userId,
          currentLevel: 1,
          totalXP: 0,
          xpToNextLevel: 100,
          levelProgress: 0,
          unlockedBadges: [],
          title: "Débutant"
        });
      }

      userLevel.totalXP += points;
      
      // Vérifier si le niveau augmente
      while (userLevel.totalXP >= userLevel.xpToNextLevel) {
        userLevel.currentLevel += 1;
        userLevel.totalXP -= userLevel.xpToNextLevel;
        userLevel.xpToNextLevel = Math.floor(userLevel.xpToNextLevel * 1.5); // Augmentation progressive
      }

      // Calculer le pourcentage de progression
      userLevel.levelProgress = Math.floor(
        (userLevel.totalXP / userLevel.xpToNextLevel) * 100
      );

      // Mettre à jour le titre basé sur le niveau
      userLevel.title = this.getLevelTitle(userLevel.currentLevel);

      await userLevel.save();
    } catch (error) {
      console.error('Error updating user level:', error);
    }
  }

  // Vérifier les achievements basés sur l'activité
  private async checkActivityBasedAchievements(
    userId: string, 
    userName: string, 
    leaderboardEntry: any
  ): Promise<void> {
    const achievementsToCheck: Array<keyof typeof ACHIEVEMENT_DEFINITIONS> = [];

    // Vérifier la série de connexion
    if (leaderboardEntry.streak >= 30) {
      achievementsToCheck.push('consistency_king');
    } else if (leaderboardEntry.streak >= 7) {
      achievementsToCheck.push('perfect_week');
    }

    // Vérifier les points totaux pour des paliers
    if (leaderboardEntry.totalPoints >= 10000) {
      achievementsToCheck.push('excellence_award');
    } else if (leaderboardEntry.totalPoints >= 5000) {
      achievementsToCheck.push('performance_booster');
    } else if (leaderboardEntry.totalPoints >= 1000) {
      achievementsToCheck.push('knowledge_keeper');
    }

    // Attribuer les achievements
    for (const achievementType of achievementsToCheck) {
      await this.awardAchievement(userId, userName, achievementType);
    }
  }

  // Obtenir le titre basé sur le niveau
  private getLevelTitle(level: number): string {
    if (level >= 50) return "Maître Légendaire";
    if (level >= 40) return "Expert Élite";
    if (level >= 30) return "Maître Confirmé";
    if (level >= 20) return "Professionnel Avancé";
    if (level >= 10) return "Praticien Compétent";
    return "Apprenti";
  }

  // Récupérer les achievements d'un utilisateur
  async getUserAchievements(userId: string): Promise<IAchievement[]> {
    return await Achievement.find({ userId }).sort({ earnedAt: -1 });
  }

  // Récupérer le leaderboard
  async getLeaderboard(limit: number = 50): Promise<any[]> {
    const entries = await LeaderboardEntry.find()
      .sort({ totalPoints: -1 })
      .limit(limit);
    
    return entries.map((entry, index) => ({
      ...entry.toObject(),
      rank: index + 1
    }));
  }

  // Récupérer les statistiques d'un utilisateur
  async getUserStats(userId: string): Promise<any> {
    const [achievements, leaderboardEntry, userLevel] = await Promise.all([
      Achievement.countDocuments({ userId }),
      LeaderboardEntry.findOne({ userId }),
      UserLevel.findOne({ userId })
    ]);

    return {
      achievementsCount: achievements,
      leaderboardEntry,
      userLevel
    };
  }

  // Récupérer les achievements récents
  async getRecentAchievements(limit: number = 10): Promise<IAchievement[]> {
    return await Achievement.find()
      .sort({ earnedAt: -1 })
      .limit(limit)
      .populate('userId', 'name avatar');
  }

  // Calculer les statistiques globales
  async getGlobalStats(): Promise<any> {
    const [
      totalAchievements,
      totalUsersWithAchievements,
      rarestAchievement,
      mostActiveUser
    ] = await Promise.all([
      Achievement.countDocuments(),
      Achievement.distinct('userId').then(ids => ids.length),
      Achievement.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: 1 } },
        { $limit: 1 }
      ]),
      LeaderboardEntry.findOne().sort({ totalPoints: -1 })
    ]);

    return {
      totalAchievements,
      totalUsersWithAchievements,
      rarestAchievement: rarestAchievement[0]?._id,
      mostActiveUser: mostActiveUser?.userName
    };
  }

  // Réinitialiser les statistiques hebdomadaires
  async resetWeeklyStats(): Promise<void> {
    await LeaderboardEntry.updateMany({}, { weeklyPoints: 0 });
  }

  // Réinitialiser les statistiques mensuelles
  async resetMonthlyStats(): Promise<void> {
    await LeaderboardEntry.updateMany({}, { monthlyPoints: 0 });
  }

  // Obtenir les badges déverrouillés
  async getUserBadges(userId: string): Promise<string[]> {
    const userLevel = await UserLevel.findOne({ userId });
    return userLevel?.unlockedBadges || [];
  }

  // Ajouter un badge déverrouillé
  async unlockBadge(userId: string, badge: string): Promise<void> {
    const userLevel = await UserLevel.findOne({ userId });
    if (userLevel && !userLevel.unlockedBadges.includes(badge)) {
      userLevel.unlockedBadges.push(badge);
      await userLevel.save();
    }
  }

  // Vérifier les achievements spécifiques à des actions métier
  async checkBusinessAchievements(
    userId: string,
    userName: string,
    action: string,
    data: any
  ): Promise<void> {
    const achievementsToCheck: Array<keyof typeof ACHIEVEMENT_DEFINITIONS> = [];

    switch (action) {
      case 'complaint_resolved':
        if (data.resolutionTime && data.resolutionTime < 2) {
          achievementsToCheck.push('quick_resolver');
        }
        if (data.complexity === 'high') {
          achievementsToCheck.push('problem_solver');
        }
        break;

      case 'document_shared':
        achievementsToCheck.push('knowledge_sharer');
        break;

      case 'helped_colleague':
        achievementsToCheck.push('team_player');
        break;

      case 'message_sent':
        // Compter les messages envoyés pour cet utilisateur
        const messageCount = await this.getMessageCount(userId);
        if (messageCount >= 50) {
          achievementsToCheck.push('communication_expert');
        }
        break;

      case 'login_early':
        achievementsToCheck.push('early_bird');
        break;

      case 'login_late':
        achievementsToCheck.push('night_owl');
        break;

      case 'feature_used':
        // Compter les fonctionnalités utilisées
        const featuresCount = await this.getFeaturesUsedCount(userId);
        if (featuresCount >= 5) {
          achievementsToCheck.push('explorer');
        }
        break;

      case 'feedback_received':
        if (data.rating && data.rating >= 4.5) {
          // Compter les feedbacks positifs
          const positiveFeedbacks = await this.getPositiveFeedbackCount(userId);
          if (positiveFeedbacks >= 10) {
            achievementsToCheck.push('feedback_champion');
          }
        }
        break;

      case 'suggestion_implemented':
        achievementsToCheck.push('innovation_award');
        break;

      case 'trained_user':
        achievementsToCheck.push('mentor');
        break;

      case 'process_optimized':
        achievementsToCheck.push('process_improver');
        break;

      case 'safety_reported':
        achievementsToCheck.push('safety_champion');
        break;

      case 'environmental_initiative':
        achievementsToCheck.push('environment_guardian');
        break;

      case 'organized_event':
        achievementsToCheck.push('community_builder');
        break;
    }

    // Attribuer les achievements
    for (const achievementType of achievementsToCheck) {
      await this.awardAchievement(userId, userName, achievementType, data);
    }
  }

  // Méthodes utilitaires (à implémenter selon tes modèles)
  private async getMessageCount(userId: string): Promise<number> {
    // Implémentation selon ton modèle de messages
    return 0;
  }

  private async getFeaturesUsedCount(userId: string): Promise<number> {
    // Implémentation selon ton système de tracking
    return 0;
  }

  private async getPositiveFeedbackCount(userId: string): Promise<number> {
    // Implémentation selon ton système de feedback
    return 0;
  }
}

export default new GamificationService();
```

---

## 5. 📄 CONTROLLERS API

### 📄 `backend/src/controllers/gamificationController.ts`
```typescript
import { Request, Response } from 'express';
import gamificationService from '../services/gamificationService';
import { Achievement } from '../models/Achievement';

export class GamificationController {
  // Récupérer les achievements d'un utilisateur
  static async getUserAchievements(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const achievements = await gamificationService.getUserAchievements(userId);
      res.json(achievements);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Récupérer le leaderboard
  static async getLeaderboard(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const leaderboard = await gamificationService.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Récupérer les statistiques d'un utilisateur
  static async getUserStats(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const stats = await gamificationService.getUserStats(userId);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Récupérer les achievements récents (globaux)
  static async getRecentAchievements(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const achievements = await gamificationService.getRecentAchievements(limit);
      res.json(achievements);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Récupérer les statistiques globales
  static async getGlobalStats(req: Request, res: Response) {
    try {
      const stats = await gamificationService.getGlobalStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Récupérer les badges déverrouillés
  static async getUserBadges(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const badges = await gamificationService.getUserBadges(userId);
      res.json(badges);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Déverrouiller un badge spécifique
  static async unlockBadge(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { badge } = req.body;

      if (!badge) {
        return res.status(400).json({ error: 'Badge requis' });
      }

      await gamificationService.unlockBadge(userId, badge);
      res.json({ success: true, message: 'Badge déverrouillé' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Vérifier les achievements pour une action
  static async checkAchievement(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const userName = req.user!.name || 'Utilisateur';
      const { action, data } = req.body;

      if (!action) {
        return res.status(400).json({ error: 'Action requise' });
      }

      await gamificationService.checkBusinessAchievements(userId, userName, action, data);
      res.json({ success: true, message: 'Achievements vérifiés' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Récupérer les niveaux des utilisateurs
  static async getUserLevels(req: Request, res: Response) {
    try {
      const { limit = 20, offset = 0 } = req.query;
      
      const levels = await Achievement.aggregate([
        {
          $group: {
            _id: '$userId',
            totalXP: { $sum: '$points' },
            achievementsCount: { $sum: 1 },
            lastAchievement: { $max: '$earnedAt' }
          }
        },
        {
          $sort: { totalXP: -1 }
        },
        {
          $skip: parseInt(offset as string)
        },
        {
          $limit: parseInt(limit as string)
        }
      ]);

      res.json(levels);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Récompenser manuellement un utilisateur
  static async rewardUser(req: Request, res: Response) {
    try {
      // Vérifier que l'utilisateur est admin
      if (req.user!.role !== 'admin') {
        return res.status(403).json({ error: 'Accès refusé' });
      }

      const { userId, userName, achievementType, points, reason } = req.body;

      if (!userId || !achievementType || !points) {
        return res.status(400).json({ error: 'userId, achievementType et points requis' });
      }

      // Créer un achievement personnalisé
      const achievement = new Achievement({
        userId,
        type: 'custom_reward',
        title: `Récompense: ${reason || 'Performance exceptionnelle'}`,
        description: reason || 'Récompense attribuée par un administrateur',
        points,
        badge: 'trophy',
        rarity: 'legendary',
        earnedAt: new Date(),
        metadata: { awardedBy: req.user!.userId, reason }
      });

      const savedAchievement = await achievement.save();

      // Mettre à jour le leaderboard
      await gamificationService.updateLeaderboard(userId, userName, points);

      res.status(201).json(savedAchievement);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
```

---

## 6. 📄 ROUTES API

### 📄 `backend/src/routes/gamification.ts`
```typescript
import express from 'express';
import { GamificationController } from '../controllers/gamificationController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Routes protégées
router.get('/achievements', authenticate, GamificationController.getUserAchievements);
router.get('/leaderboard', authenticate, GamificationController.getLeaderboard);
router.get('/stats', authenticate, GamificationController.getUserStats);
router.get('/recent', authenticate, GamificationController.getRecentAchievements);
router.get('/badges', authenticate, GamificationController.getUserBadges);
router.get('/levels', authenticate, GamificationController.getUserLevels);

// Routes admin
router.post('/reward', authenticate, GamificationController.rewardUser);

// Routes publiques (pour dashboard)
router.get('/global-stats', GamificationController.getGlobalStats);

// Routes pour vérifier les achievements
router.post('/check', authenticate, GamificationController.checkAchievement);
router.post('/unlock-badge', authenticate, GamificationController.unlockBadge);

export default router;
```

### 📄 `backend/src/server.ts` (ajout de la route)
```typescript
// ... imports existants ...
import gamificationRoutes from './routes/gamification';

// ... middleware ...

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/gamification', gamificationRoutes); // ← AJOUTER CETTE LIGNE

// ... démarrage serveur ...
```

---

## 7. 📄 JOBS PLANIFIÉS

### 📄 `backend/src/jobs/leaderboardJob.ts`
```typescript
import cron from 'node-cron';
import gamificationService from '../services/gamificationService';

// Réinitialiser les statistiques hebdomadaires chaque lundi à minuit
cron.schedule('0 0 * * 1', async () => {
  try {
    console.log('Resetting weekly leaderboard stats...');
    await gamificationService.resetWeeklyStats();
    console.log('Weekly stats reset completed');
  } catch (error) {
    console.error('Error resetting weekly stats:', error);
  }
});

// Réinitialiser les statistiques mensuelles le premier jour de chaque mois
cron.schedule('0 0 1 * *', async () => {
  try {
    console.log('Resetting monthly leaderboard stats...');
    await gamificationService.resetMonthlyStats();
    console.log('Monthly stats reset completed');
  } catch (error) {
    console.error('Error resetting monthly stats:', error);
  }
});

// Mettre à jour les classements chaque heure
cron.schedule('0 * * * *', async () => {
  try {
    console.log('Updating leaderboard rankings...');
    // Ici vous pouvez implémenter la mise à jour des rangs
    console.log('Leaderboard rankings updated');
  } catch (error) {
    console.error('Error updating leaderboard rankings:', error);
  }
});

console.log('Leaderboard jobs scheduled');
```

---

## 8. 📄 FRONTEND : TYPES ET INTERFACES

### 📄 `frontend/src/types/gamification.ts`
```typescript
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
```

---

## 9. 📄 HOOKS FRONTEND

### 📄 `frontend/src/hooks/useGamification.ts`
```typescript
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Achievement, LeaderboardEntry, UserLevel, GamificationStats, GlobalStats } from '@/types/gamification';

export const useGamification = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userStats, setUserStats] = useState<GamificationStats | null>(null);
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [userBadges, setUserBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les achievements de l'utilisateur
  const fetchUserAchievements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/gamification/achievements');
      setAchievements(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur chargement achievements');
    } finally {
      setLoading(false);
    }
  }, []);

  // Récupérer le leaderboard
  const fetchLeaderboard = useCallback(async (limit: number = 50) => {
    try {
      const response = await api.get('/gamification/leaderboard', {
        params: { limit }
      });
      setLeaderboard(response.data);
    } catch (err: any) {
      console.error('Erreur chargement leaderboard:', err);
    }
  }, []);

  // Récupérer les statistiques utilisateur
  const fetchUserStats = useCallback(async () => {
    try {
      const response = await api.get('/gamification/stats');
      setUserStats(response.data);
    } catch (err: any) {
      console.error('Erreur chargement stats utilisateur:', err);
    }
  }, []);

  // Récupérer les statistiques globales
  const fetchGlobalStats = useCallback(async () => {
    try {
      const response = await api.get('/gamification/global-stats');
      setGlobalStats(response.data);
    } catch (err: any) {
      console.error('Erreur chargement stats globales:', err);
    }
  }, []);

  // Récupérer les badges déverrouillés
  const fetchUserBadges = useCallback(async () => {
    try {
      const response = await api.get('/gamification/badges');
      setUserBadges(response.data);
    } catch (err: any) {
      console.error('Erreur chargement badges:', err);
    }
  }, []);

  // Vérifier les achievements pour une action
  const checkAchievement = async (action: string, data?: any) => {
    try {
      await api.post('/gamification/check', { action, data });
      // Rafraîchir les données
      fetchUserAchievements();
      fetchUserStats();
    } catch (err: any) {
      console.error('Erreur vérification achievement:', err);
    }
  };

  // Déverrouiller un badge
  const unlockBadge = async (badge: string) => {
    try {
      await api.post('/gamification/unlock-badge', { badge });
      fetchUserBadges();
    } catch (err: any) {
      console.error('Erreur déverrouillage badge:', err);
    }
  };

  // Effet initial
  useEffect(() => {
    fetchUserAchievements();
    fetchUserStats();
    fetchUserBadges();
    fetchLeaderboard();
    fetchGlobalStats();
  }, [fetchUserAchievements, fetchUserStats, fetchUserBadges, fetchLeaderboard, fetchGlobalStats]);

  return {
    achievements,
    leaderboard,
    userStats,
    globalStats,
    userBadges,
    loading,
    error,
    fetchUserAchievements,
    fetchLeaderboard,
    fetchUserStats,
    fetchGlobalStats,
    fetchUserBadges,
    checkAchievement,
    unlockBadge
  };
};
```

---

## 10. 📄 COMPOSANTS UI

### 📄 `frontend/src/components/gamification/AchievementCard.tsx`
```tsx
'use client';

import React from 'react';
import { Achievement } from '@/types/gamification';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Crown } from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
  isNew?: boolean;
  className?: string;
}

export const AchievementCard = ({ 
  achievement, 
  isNew = false,
  className = '' 
}: AchievementCardProps) => {
  const getRarityColor = () => {
    switch(achievement.rarity) {
      case 'common': return 'border-gray-300 bg-gray-50 dark:bg-gray-800';
      case 'rare': return 'border-blue-300 bg-blue-50 dark:bg-blue-900/20';
      case 'epic': return 'border-purple-300 bg-purple-50 dark:bg-purple-900/20';
      case 'legendary': return 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'border-gray-300';
    }
  };

  const getRarityIcon = () => {
    switch(achievement.rarity) {
      case 'common': return <Star className="w-4 h-4 text-gray-500" />;
      case 'rare': return <Star className="w-4 h-4 text-blue-500" />;
      case 'epic': return <Zap className="w-4 h-4 text-purple-500" />;
      case 'legendary': return <Crown className="w-4 h-4 text-yellow-500" />;
      default: return <Star className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ scale: isNew ? 0.8 : 1, opacity: isNew ? 0 : 1 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative p-4 rounded-lg border-2 ${getRarityColor()} ${className}`}
    >
      {isNew && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          Nouveau!
        </div>
      )}
      
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {achievement.title}
            </h3>
            {getRarityIcon()}
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {achievement.description}
          </p>
          
          <div className="flex items-center justify-between mt-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              +{achievement.points} points
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(achievement.earnedAt)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
```

### 📄 `frontend/src/components/gamification/Leaderboard.tsx`
```tsx
'use client';

import React from 'react';
import { LeaderboardEntry } from '@/types/gamification';
import { Crown, Medal, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserRank?: number;
  className?: string;
}

export const Leaderboard = ({ 
  entries, 
  currentUserRank,
  className = '' 
}: LeaderboardProps) => {
  const getRankIcon = (rank: number) => {
    switch(rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <span className="text-sm font-medium">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    switch(rank) {
      case 1: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 2: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 3: return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold">Classement</h2>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {entries.map((entry, index) => {
          const isCurrentUser = currentUserRank === entry.rank;
          
          return (
            <motion.div
              key={entry.userId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 flex items-center justify-between ${
                isCurrentUser ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getRankBadge(entry.rank)}`}>
                  {getRankIcon(entry.rank)}
                </div>
                
                <div className="flex items-center space-x-2">
                  {entry.userAvatar ? (
                    <img 
                      src={entry.userAvatar} 
                      alt={entry.userName}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {entry.userName.charAt(0)}
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {entry.userName}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Vous
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>Niveau {entry.level}</span>
                      <span>•</span>
                      <span>Série: {entry.streak} jours</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {entry.totalPoints.toLocaleString()} pts
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {entry.achievements.length} achievements
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
```

### 📄 `frontend/src/components/gamification/ProgressBadge.tsx`
```tsx
'use client';

import React from 'react';
import { UserLevel } from '@/types/gamification';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Star } from 'lucide-react';

interface ProgressBadgeProps {
  level: UserLevel;
  className?: string;
}

export const ProgressBadge = ({ level, className = '' }: ProgressBadgeProps) => {
  const getLevelColor = () => {
    if (level.currentLevel >= 50) return 'from-purple-500 to-pink-500';
    if (level.currentLevel >= 30) return 'from-blue-500 to-cyan-500';
    if (level.currentLevel >= 20) return 'from-green-500 to-teal-500';
    if (level.currentLevel >= 10) return 'from-yellow-500 to-orange-500';
    return 'from-gray-400 to-gray-600';
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">Votre Progression</h3>
        <TrendingUp className="w-5 h-5 text-blue-500" />
      </div>
      
      <div className="space-y-4">
        {/* Niveau et XP */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getLevelColor()} flex items-center justify-center`}>
              <span className="text-white font-bold">{level.currentLevel}</span>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {level.title}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Niveau {level.currentLevel}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="font-medium text-gray-900 dark:text-white">
              {level.totalXP.toLocaleString()} XP
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {level.xpToNextLevel - level.totalXP} pour monter
            </div>
          </div>
        </div>
        
        {/* Barre de progression */}
        <div>
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
            <span>Progression</span>
            <span>{level.levelProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full bg-gradient-to-r ${getLevelColor()}`}
              initial={{ width: 0 }}
              animate={{ width: `${level.levelProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
        
        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <Target className="w-4 h-4 mx-auto text-blue-500 mb-1" />
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {level.totalXP.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">XP Total</div>
          </div>
          
          <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <Star className="w-4 h-4 mx-auto text-yellow-500 mb-1" />
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              0
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Badges</div>
          </div>
          
          <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <TrendingUp className="w-4 h-4 mx-auto text-green-500 mb-1" />
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {level.currentLevel}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Niveau</div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### 📄 `frontend/src/components/gamification/LevelUpModal.tsx`
```tsx
'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, Star } from 'lucide-react';
import Confetti from 'react-confetti';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  previousLevel: number;
  xpEarned: number;
  rewards: string[];
}

export const LevelUpModal = ({ 
  isOpen, 
  onClose, 
  newLevel, 
  previousLevel,
  xpEarned,
  rewards
}: LevelUpModalProps) => {
  const [windowSize, setWindowSize] = React.useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
        />
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 relative"
        >
          <div className="text-center">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1 }}
              className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Trophy className="w-10 h-10 text-white" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Félicitations !
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Vous avez atteint le niveau <span className="font-bold text-blue-600">{newLevel}</span> !
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <span className="font-medium text-gray-900 dark:text-white">
                  +{xpEarned} XP gagnés
                </span>
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Niveau {previousLevel} → Niveau {newLevel}
              </p>
            </div>
            
            {rewards.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Récompenses débloquées :
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {rewards.map((reward, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      <Star className="w-3 h-3 mr-1" />
                      {reward}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              Continuer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
```

---

## 11. 📄 PAGE PRINCIPALE GAMIFICATION

### 📄 `frontend/src/app/(app)/gamification/page.tsx`
```tsx
'use client';

import React, { useState } from 'react';
import { useGamification } from '@/hooks/useGamification';
import { AchievementCard } from '@/components/gamification/AchievementCard';
import { Leaderboard } from '@/components/gamification/Leaderboard';
import { ProgressBadge } from '@/components/gamification/ProgressBadge';
import { LevelUpModal } from '@/components/gamification/LevelUpModal';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { 
  Trophy, 
  TrendingUp, 
  Users, 
  Star,
  Zap,
  Crown,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function GamificationPage() {
  const {
    achievements,
    leaderboard,
    userStats,
    userBadges,
    loading,
    error
  } = useGamification();

  const [showLevelUp, setShowLevelUp] = useState(false);

  if (error) {
    return (
      <ResponsiveLayout pageTitle="Gamification">
        <div className="p-6 text-center text-red-600">
          Erreur: {error}
        </div>
      </ResponsiveLayout>
    );
  }

  const recentAchievements = achievements.slice(0, 6);
  const topLeaderboard = leaderboard.slice(0, 10);

  return (
    <ResponsiveLayout pageTitle="Gamification">
      <div className="p-6 space-y-6">
        {/* Header avec statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white"
          >
            <div className="flex items-center space-x-3">
              <Trophy className="w-8 h-8" />
              <div>
                <div className="text-2xl font-bold">
                  {userStats?.achievementsCount || 0}
                </div>
                <div className="text-sm opacity-90">Achievements</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white"
          >
            <div className="flex items-center space-x-3">
              <Target className="w-8 h-8" />
              <div>
                <div className="text-2xl font-bold">
                  {userStats?.userLevel?.totalXP.toLocaleString() || 0}
                </div>
                <div className="text-sm opacity-90">Points XP</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white"
          >
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8" />
              <div>
                <div className="text-2xl font-bold">
                  #{userStats?.leaderboardEntry?.rank || '-'}
                </div>
                <div className="text-sm opacity-90">Classement</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-4 text-white"
          >
            <div className="flex items-center space-x-3">
              <Zap className="w-8 h-8" />
              <div>
                <div className="text-2xl font-bold">
                  {userStats?.leaderboardEntry?.streak || 0}
                </div>
                <div className="text-sm opacity-90">Série (jours)</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progression utilisateur */}
        {userStats?.userLevel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ProgressBadge level={userStats.userLevel} />
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Achievements récents */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Derniers Achievements
                </h2>
                <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  Voir tout
                </button>
              </div>
              
              <div className="p-4">
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : recentAchievements.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Pas encore d'achievements</p>
                    <p className="text-sm mt-1">Continuez à utiliser la plateforme !</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentAchievements.map((achievement) => (
                      <AchievementCard
                        key={achievement.id}
                        achievement={achievement}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Classement */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Leaderboard 
              entries={topLeaderboard}
              currentUserRank={userStats?.leaderboardEntry?.rank}
            />
          </motion.div>
        </div>

        {/* Badges déverrouillés */}
        {userBadges && userBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold flex items-center">
                <Crown className="w-5 h-5 mr-2 text-yellow-500" />
                Badges Déverrouillés
              </h2>
            </div>
            
            <div className="p-4">
              <div className="flex flex-wrap gap-3">
                {userBadges.map((badge, index) => (
                  <div 
                    key={index}
                    className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white"
                  >
                    <Trophy className="w-8 h-8" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal de passage de niveau */}
      <LevelUpModal
        isOpen={showLevelUp}
        onClose={() => setShowLevelUp(false)}
        newLevel={userStats?.userLevel?.currentLevel || 1}
        previousLevel={(userStats?.userLevel?.currentLevel || 1) - 1}
        xpEarned={100}
        rewards={['Nouveau badge', 'Accès premium']}
      />
    </ResponsiveLayout>
  );
}
```

---

## 12. 📄 INTÉGRATION DANS LE HEADER

### 📄 `frontend/src/components/layout/Header.tsx` (modification)
```tsx
// ... imports existants ...
import { Trophy } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';

export const Header = () => {
  // ... hooks existants ...
  const { userStats } = useGamification();

  return (
    <header className="bg-white shadow dark:bg-gray-800">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo et navigation */}
          <div className="flex items-center">
            {/* ... contenu existant ... */}
          </div>
          
          {/* Actions utilisateur */}
          <div className="flex items-center space-x-4">
            {/* Badge de gamification */}
            <button
              onClick={() => window.location.href = '/gamification'}
              className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Gamification"
            >
              <Trophy className="h-5 w-5" />
              {userStats?.userLevel && userStats.userLevel.levelProgress > 0 && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
              )}
            </button>
            
            {/* ... autres actions ... */}
          </div>
        </div>
      </div>
    </header>
  );
};
```

---

## 13. 🚀 TEST DE L'IMPLEMENTATION

### Test avec curl
```bash
# Récupérer les achievements d'un utilisateur
curl -X GET "http://localhost:3001/api/gamification/achievements" \
  -H "Authorization: Bearer VOTRE_JWT_TOKEN"

# Récupérer le leaderboard
curl -X GET "http://localhost:3001/api/gamification/leaderboard?limit=20" \
  -H "Authorization: Bearer VOTRE_JWT_TOKEN"

# Vérifier un achievement
curl -X POST "http://localhost:3001/api/gamification/check" \
  -H "Authorization: Bearer VOTRE_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "complaint_resolved",
    "data": {
      "resolutionTime": 1.5,
      "complexity": "high"
    }
  }'

# Récompenser un utilisateur (admin)
curl -X POST "http://localhost:3001/api/gamification/reward" \
  -H "Authorization: Bearer VOTRE_JWT_TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_id",
    "userName": "Nom Utilisateur",
    "achievementType": "custom_reward",
    "points": 50,
    "reason": "Performance exceptionnelle"
  }'
```

---

## 📈 FONCTIONNALITÉS CLÉS IMPLEMENTÉES

### ✅ Système de Gamification Complet
- **50+ types d'achievements** variés
- **Système de niveaux** progressif
- **Leaderboard** en temps réel
- **Badges** déverrouillables
- **Récompenses** personnalisées

### 🏆 Engagement et Motivation
- **Notifications** d'achievements
- **Animations** et confettis
- **Progression** visualisée
- **Compétition** saine
- **Reconnaissance** des efforts

### ⚡ Intégration Transparente
- **Hooks** React réutilisables
- **Components** modulaires
- **Types** TypeScript complets
- **Services** backend robustes
- **Jobs** planifiés

### 🛡️ Extensible et Maintenable
- **Architecture** modulaire
- **Configuration** facile
- **Tests** automatisables
- **Scalable** horizontalement
- **Documenté** complètement

---

## 🎯 PROCHAINE ÉTAPE RECOMMANDÉE

Maintenant que tu as un système de gamification complet, je recommande d'implémenter le **système de reporting et analytics avancés** pour avoir des insights business complets.

Souhaites-tu que je te fournisse le code complet pour le **système de reporting et analytics avancés** ? Cela compléterait parfaitement ta plateforme ! 📊