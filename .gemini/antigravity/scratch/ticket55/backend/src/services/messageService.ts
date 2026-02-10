import { Message, Thread, IMessage, IThread } from '../models/Message.js';
import { User } from '../models/User.js';

export class MessageService {
    // Créer un nouveau fil de discussion
    async createThread(participants: string[], title?: string, createdBy?: string): Promise<IThread> {
        // Fetch user details to get names
        const users = await User.find({ _id: { $in: participants } });
        const participantsData = participants.map(id => {
            const user = users.find(u => u._id.toString() === id);
            return {
                id,
                name: user ? user.email.split('@')[0] : 'Utilisateur'
            };
        });

        const thread = new Thread({
            participants: participantsData,
            title,
            isGroup: participants.length > 2,
            createdBy: createdBy || participants[0],
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return await thread.save();
    }

    // Ajouter un participant à un groupe
    async addParticipant(threadId: string, userId: string, userName?: string): Promise<IThread | null> {
        const thread = await Thread.findById(threadId);
        if (!thread) return null;

        if (!thread.participants.some(p => p.id === userId)) {
            let nameToUse = userName;
            if (!nameToUse) {
                const user = await User.findById(userId);
                nameToUse = user ? user.email.split('@')[0] : 'Utilisateur';
            }

            thread.participants.push({ id: userId, name: nameToUse || 'Utilisateur' });
            thread.updatedAt = new Date();
            await thread.save();
        }

        return thread;
    }

    // Envoyer un message
    async sendMessage(
        threadId: string,
        senderId: string,
        senderName: string,
        content: string,
        attachments?: any[],
        replyTo?: string,
        mentions?: string[]
    ): Promise<IMessage> {
        const message = new Message({
            threadId,
            sender: {
                id: senderId,
                name: senderName
            },
            content,
            attachments: attachments || [],
            replyTo,
            mentions: mentions || [],
            status: 'sent',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const savedMessage = await message.save();

        // Mettre à jour le dernier message du thread
        await Thread.findByIdAndUpdate(threadId, {
            lastMessage: {
                content: content.substring(0, 100),
                sender: senderName,
                timestamp: new Date()
            },
            updatedAt: new Date()
        });

        return savedMessage;
    }

    // Récupérer les fils de discussion d'un utilisateur
    async getUserThreads(userId: string, limit: number = 20): Promise<IThread[]> {
        return await Thread.find({
            'participants.id': userId
        })
            .sort({ updatedAt: -1 })
            .limit(limit);
    }

    // Récupérer les messages d'un fil
    async getThreadMessages(
        threadId: string,
        userId: string,
        limit: number = 50,
        before?: Date
    ): Promise<IMessage[]> {
        // Vérifier que l'utilisateur appartient au thread
        const thread = await Thread.findOne({
            _id: threadId,
            'participants.id': userId
        });

        if (!thread) {
            throw new Error('Thread non trouvé ou accès non autorisé');
        }

        const query: any = { threadId };
        if (before) {
            query.createdAt = { $lt: before };
        }

        const messages = await Message.find(query)
            .sort({ createdAt: -1 })
            .limit(limit);

        // Marquer comme lu
        await this.markMessagesAsRead(threadId, userId);

        return messages.reverse(); // Ordre chronologique
    }

    // Marquer les messages comme lus
    async markMessagesAsRead(threadId: string, userId: string): Promise<void> {
        await Thread.updateOne(
            { _id: threadId, 'participants.id': userId },
            {
                $set: {
                    'participants.$.lastRead': new Date()
                }
            }
        );

        // Marquer les messages individuels comme lus
        await Message.updateMany(
            { threadId, 'sender.id': { $ne: userId } },
            { $set: { status: 'read' } }
        );
    }

    // Ajouter une réaction à un message
    async addReaction(messageId: string, userId: string, emoji: string): Promise<IMessage | null> {
        const message = await Message.findById(messageId);
        if (!message) return null;

        // Vérifier si la réaction existe déjà
        const existingReaction = message.reactions?.find(
            r => r.userId === userId && r.emoji === emoji
        );

        if (!existingReaction) {
            message.reactions = message.reactions || [];
            message.reactions.push({
                userId,
                emoji,
                createdAt: new Date()
            });
            await message.save();
        }

        return message;
    }

    // Supprimer une réaction
    async removeReaction(messageId: string, userId: string, emoji: string): Promise<IMessage | null> {
        const message = await Message.findById(messageId);
        if (!message) return null;

        message.reactions = message.reactions?.filter(
            r => !(r.userId === userId && r.emoji === emoji)
        ) || [];

        await message.save();
        return message;
    }

    // Rechercher des messages
    async searchMessages(userId: string, query: string, limit: number = 20): Promise<IMessage[]> {
        return await Message.find({
            $text: { $search: query },
            threadId: { $in: await this.getUserThreadIds(userId) }
        })
            .sort({ createdAt: -1 })
            .limit(limit);
    }

    // Récupérer les IDs des threads d'un utilisateur (pour recherche)
    private async getUserThreadIds(userId: string): Promise<string[]> {
        const threads = await Thread.find({
            'participants.id': userId
        }).select('_id');

        return threads.map(thread => thread._id.toString());
    }

    // Compter les messages non lus
    async getUnreadCount(userId: string): Promise<number> {
        const threads = await Thread.find({
            'participants.id': userId
        }).select('_id participants');

        let totalCount = 0;
        for (const thread of threads) {
            const participant = thread.participants.find(p => p.id === userId);
            if (participant && participant.lastRead) {
                const unreadCount = await Message.countDocuments({
                    threadId: thread._id,
                    createdAt: { $gt: participant.lastRead },
                    'sender.id': { $ne: userId }
                });
                totalCount += unreadCount;
            } else {
                // Si jamais lu, compter tous les messages des autres
                const unreadCount = await Message.countDocuments({
                    threadId: thread._id,
                    'sender.id': { $ne: userId }
                });
                totalCount += unreadCount;
            }
        }

        return totalCount;
    }

    // Créer un thread automatique entre deux utilisateurs
    async getOrCreateDirectThread(userId1: string, userId2: string): Promise<IThread> {
        // Chercher un thread existant entre ces deux utilisateurs
        const existingThread = await Thread.findOne({
            isGroup: false,
            participants: {
                $size: 2,
                $all: [
                    { $elemMatch: { id: userId1 } },
                    { $elemMatch: { id: userId2 } }
                ]
            }
        });

        if (existingThread) {
            return existingThread;
        }

        // Fetch user names
        const users = await User.find({ _id: { $in: [userId1, userId2] } });
        const user1 = users.find(u => u._id.toString() === userId1);
        const user2 = users.find(u => u._id.toString() === userId2);

        // Créer un nouveau thread
        const thread = new Thread({
            participants: [
                { id: userId1, name: user1 ? user1.email.split('@')[0] : 'Utilisateur' },
                { id: userId2, name: user2 ? user2.email.split('@')[0] : 'Utilisateur' }
            ],
            isGroup: false,
            createdBy: userId1,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return await thread.save();
    }
}

export default new MessageService();
