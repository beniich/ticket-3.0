'use client';

import React, { useState, useRef } from 'react';
import { Paperclip, Send, Smile, X } from 'lucide-react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

interface MessageInputProps {
    onSendMessage: (content: string, attachments?: File[]) => void;
    onTyping?: () => void;
    placeholder?: string;
}

export const MessageInput = ({
    onSendMessage,
    onTyping,
    placeholder = "Écrivez un message..."
}: MessageInputProps) => {
    const [message, setMessage] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSend = () => {
        if (message.trim() || attachments.length > 0) {
            onSendMessage(message, attachments);
            setMessage('');
            setAttachments([]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }

        if (onTyping) {
            onTyping();
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setAttachments(prev => [...prev, ...Array.from(files)]);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const addEmoji = (emoji: any) => {
        setMessage(prev => prev + emoji.native);
        setShowEmojiPicker(false);
    };

    return (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            {/* Attachments preview */}
            {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {attachments.map((file, index) => (
                        <div key={index} className="relative group">
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 flex items-center">
                                <Paperclip className="w-4 h-4 mr-2 text-gray-500" />
                                <span className="text-sm truncate max-w-24">{file.name}</span>
                                <button
                                    onClick={() => removeAttachment(index)}
                                    className="ml-2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Emoji picker */}
            {showEmojiPicker && (
                <div className="absolute bottom-20 right-4 z-50">
                    <Picker
                        data={data}
                        onEmojiSelect={addEmoji}
                        theme="light"
                    />
                </div>
            )}

            <div className="flex items-end space-x-2">
                {/* Actions */}
                <div className="flex space-x-1">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Joindre un fichier"
                    >
                        <Paperclip className="w-5 h-5 text-gray-500" />
                    </button>

                    <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Émoticônes"
                    >
                        <Smile className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Input */}
                <div className="flex-1 relative">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                        rows={1}
                        style={{ minHeight: '44px', maxHeight: '120px' }}
                    />
                </div>

                {/* Send button */}
                <button
                    onClick={handleSend}
                    disabled={!message.trim() && attachments.length === 0}
                    className={`p-2 rounded-full ${message.trim() || attachments.length > 0
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'text-gray-400'
                        }`}
                    title="Envoyer"
                >
                    <Send className="w-5 h-5" />
                </button>

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                />
            </div>
        </div>
    );
};
