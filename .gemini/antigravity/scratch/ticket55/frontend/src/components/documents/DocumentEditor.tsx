'use client';

import React, { useState, useEffect } from 'react';
import { Document } from '@/types/document';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Save,
    Undo,
    Redo,
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Heading3,
    FileText,
    Tag
} from 'lucide-react';
import '@/styles/documents.css';

interface DocumentEditorProps {
    document: Document;
    onSave: (updates: Partial<Document>) => void;
    onCancel: () => void;
}

export const DocumentEditor = ({
    document,
    onSave,
    onCancel
}: DocumentEditorProps) => {
    const [title, setTitle] = useState(document.title);
    const [description, setDescription] = useState(document.description || '');
    const [tags, setTags] = useState<string[]>(document.tags || []);
    const [newTag, setNewTag] = useState('');

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Commencez à écrire votre document...'
            })
        ],
        content: document.content,
    });

    // Effect to update content if document changes externally (though we only edit local state)
    // Actually we should avoid re-setting unless doc ID changes
    useEffect(() => {
        if (editor && document.content && editor.getHTML() !== document.content) {
            // Only set if really different and initial load? 
            // Better to rely on initial content unless document ID changes.
        }
    }, [document.id, editor]);


    const handleSave = () => {
        const updates: Partial<Document> = {
            title,
            description,
            content: editor?.getHTML() || '',
            tags
        };

        onSave(updates);
    };

    const addTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags([...tags, newTag.trim()]);
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    if (!editor) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold flex items-center text-slate-800 dark:text-white">
                        <FileText className="w-5 h-5 mr-2 text-primary" />
                        Éditeur de Document
                    </h2>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={onCancel}
                            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-3 py-1 bg-primary text-white text-sm rounded-lg hover:bg-blue-600 flex items-center transition-colors"
                        >
                            <Save className="w-4 h-4 mr-1" />
                            Sauvegarder
                        </button>
                    </div>
                </div>

                {/* Title and description */}
                <div className="space-y-3">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Titre du document"
                        className="w-full px-3 py-2 text-xl font-bold border-none focus:outline-none focus:ring-0 dark:bg-gray-800 dark:text-white placeholder-gray-400"
                    />

                    <input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description (optionnelle)"
                        className="w-full px-3 py-2 text-sm border-none focus:outline-none focus:ring-0 dark:bg-gray-800 dark:text-white text-gray-500 placeholder-gray-400"
                    />
                </div>

                {/* Tags */}
                <div className="mt-3">
                    <div className="flex flex-wrap gap-2 items-center">
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            >
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                                <button
                                    onClick={() => removeTag(tag)}
                                    className="ml-1 hover:text-red-500 font-bold"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addTag()}
                                placeholder="Ajouter un tag..."
                                className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                            />
                            <button
                                onClick={addTag}
                                className="ml-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-1 bg-gray-50 dark:bg-gray-900/50">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    title="Gras"
                >
                    <Bold className="w-4 h-4" />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    title="Italique"
                >
                    <Italic className="w-4 h-4" />
                </button>

                <div className="border-l border-gray-300 dark:border-gray-600 mx-1 h-6 self-center"></div>

                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-2 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    title="Titre 1"
                >
                    <Heading1 className="w-4 h-4" />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    title="Titre 2"
                >
                    <Heading2 className="w-4 h-4" />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`p-2 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    title="Titre 3"
                >
                    <Heading3 className="w-4 h-4" />
                </button>

                <div className="border-l border-gray-300 dark:border-gray-600 mx-1 h-6 self-center"></div>

                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    title="Liste à puces"
                >
                    <List className="w-4 h-4" />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    title="Liste numérotée"
                >
                    <ListOrdered className="w-4 h-4" />
                </button>
            </div>

            {/* Editor content */}
            <div className="flex-1 overflow-auto">
                <EditorContent
                    editor={editor}
                    className="prose prose-sm max-w-none p-6 dark:prose-invert focus:outline-none min-h-[300px]"
                />
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center justify-between">
                    <div>
                        Version {document.version} • Dernière modification: {new Date(document.metadata.updatedAt).toLocaleString('fr-FR')}
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => editor.commands.undo()}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            title="Annuler"
                        >
                            <Undo className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => editor.commands.redo()}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            title="Rétablir"
                        >
                            <Redo className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
