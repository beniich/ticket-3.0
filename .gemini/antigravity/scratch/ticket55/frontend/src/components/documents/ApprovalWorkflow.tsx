'use client';

import React, { useState } from 'react';
import { Document } from '@/types/document';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
    CheckCircle,
    XCircle,
    Clock,
    UserCheck,
    MessageSquare
} from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments';

interface ApprovalWorkflowProps {
    document: Document;
}

export const ApprovalWorkflow = ({ document }: ApprovalWorkflowProps) => {
    const { requestApproval, respondApproval } = useDocuments();
    const [comment, setComment] = useState('');
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

    // Determine current user status (mocked or retrieved from context/auth)
    // For demo, assume current user is one of the approvers if status is pending
    // implementation would need current user ID passed as prop or context

    const handleAction = async (approved: boolean) => {
        if (!showCommentInput) {
            setActionType(approved ? 'approve' : 'reject');
            setShowCommentInput(true);
            return;
        }

        try {
            await respondApproval(document.id, approved, comment);
            setComment('');
            setShowCommentInput(false);
            setActionType(null);
        } catch (error) {
            console.error('Error responding to approval', error);
        }
    };

    if (!document.approval) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center text-gray-500">
                <p>Ce document n'est pas soumis à approbation.</p>
                <button
                    className="mt-2 text-blue-600 hover:underline text-sm"
                    onClick={() => { /* Open modal to request approval */ }}
                >
                    Demander une approbation
                </button>
            </div>
        );
    }

    const { status, approvers, requestedAt, deadline } = document.approval;

    const getStatusBadge = () => {
        switch (status) {
            case 'approved': return <span className="flex items-center text-green-600"><CheckCircle className="w-4 h-4 mr-1" /> Approuvé</span>;
            case 'rejected': return <span className="flex items-center text-red-600"><XCircle className="w-4 h-4 mr-1" /> Rejeté</span>;
            default: return <span className="flex items-center text-yellow-600"><Clock className="w-4 h-4 mr-1" /> En attente</span>;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                    <UserCheck className="w-5 h-5 mr-2" /> Workflow d'approbation
                </h3>
                <div className="text-sm font-medium">
                    {getStatusBadge()}
                </div>
            </div>

            <div className="p-4 space-y-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Demandé le {format(new Date(requestedAt), 'dd MMM yyyy', { locale: fr })}
                    {deadline && ` • Date limite: ${format(new Date(deadline), 'dd MMM yyyy', { locale: fr })}`}
                </div>

                <div className="space-y-3">
                    {approvers.map((approver, index) => (
                        <div key={index} className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div>
                                <div className="font-medium text-sm text-gray-900 dark:text-white">{approver.name}</div>
                                {approver.comments && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-start">
                                        <MessageSquare className="w-3 h-3 mr-1 mt-0.5" />
                                        {approver.comments}
                                    </div>
                                )}
                            </div>
                            <div>
                                {approver.approvedAt ? (
                                    <span className="text-xs text-green-600 font-medium px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">Validé</span>
                                ) : approver.rejectedAt ? (
                                    <span className="text-xs text-red-600 font-medium px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded-full">Rejeté</span>
                                ) : (
                                    <span className="text-xs text-yellow-600 font-medium px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">En attente</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {status === 'pending' && (
                    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                        {!showCommentInput ? (
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => handleAction(true)}
                                    className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                                >
                                    Approuver
                                </button>
                                <button
                                    onClick={() => handleAction(false)}
                                    className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                                >
                                    Rejeter
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <label className="text-sm font-medium block text-gray-700 dark:text-gray-300">
                                    Commentaire ({actionType === 'approve' ? 'Approbation' : 'Rejet'})
                                </label>
                                <textarea
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm dark:bg-gray-700 dark:text-white"
                                    rows={3}
                                    placeholder="Ajouter un commentaire..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => { setShowCommentInput(false); setActionType(null); }}
                                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded text-sm"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={() => handleAction(actionType === 'approve')}
                                        className={`px-3 py-1 text-white rounded text-sm ${actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                                    >
                                        Confirmer
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
