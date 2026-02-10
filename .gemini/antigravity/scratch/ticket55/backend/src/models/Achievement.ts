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
    | 'excellence_award'     // Excellence générale
    | 'custom_reward';       // Récompense personnalisée

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
    },
    custom_reward: {
        title: "Récompense Spéciale",
        description: "Récompense attribuée manuellement",
        points: 0,
        badge: "trophy",
        rarity: "legendary",
        conditions: {}
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
