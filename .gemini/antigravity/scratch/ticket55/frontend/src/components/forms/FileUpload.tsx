'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, Image, CheckCircle } from 'lucide-react';

interface FileUploadProps {
    onFilesChange?: (files: File[]) => void;
    accept?: string;
    multiple?: boolean;
    maxSize?: number; // in MB
    maxFiles?: number;
    className?: string;
}

export function FileUpload({
    onFilesChange,
    accept = '*/*',
    multiple = false,
    maxSize = 10,
    maxFiles = 5,
    className = ''
}: FileUploadProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): boolean => {
        const errors: string[] = [];

        // Size validation
        if (file.size > maxSize * 1024 * 1024) {
            errors.push(`${file.name}: File size exceeds ${maxSize}MB limit`);
        }

        // Type validation
        if (accept !== '*/*') {
            const acceptedTypes = accept.split(',').map(type => type.trim());
            const fileType = file.type || file.name.split('.').pop()?.toLowerCase();

            if (!acceptedTypes.some(type =>
                type === fileType ||
                (type.endsWith('/*') && fileType?.startsWith(type.replace('/*', '')))
            )) {
                errors.push(`${file.name}: Invalid file type`);
            }
        }

        if (errors.length > 0) {
            setErrors(prev => [...prev, ...errors]);
            return false;
        }

        return true;
    };

    const handleFiles = useCallback((fileList: FileList) => {
        const newFiles: File[] = [];
        const newErrors: string[] = [];

        Array.from(fileList).forEach(file => {
            if (validateFile(file)) {
                newFiles.push(file);
            }
        });

        if (newFiles.length > 0) {
            setFiles(prev => {
                const combined = [...prev, ...newFiles];
                // Limit to maxFiles
                const limited = combined.slice(0, maxFiles);
                onFilesChange?.(limited);
                return limited;
            });
        }
    }, [maxFiles, onFilesChange]);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    }, [handleFiles]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => {
            const newFiles = [...prev];
            newFiles.splice(index, 1);
            onFilesChange?.(newFiles);
            return newFiles;
        });
    };

    const getFileIcon = (file: File) => {
        if (file.type.startsWith('image/')) {
            return <Image className="w-5 h-5 text-blue-500" />;
        } else if (file.type.includes('pdf')) {
            return <FileText className="w-5 h-5 text-red-500" />;
        } else {
            return <FileText className="w-5 h-5 text-slate-500" />;
        }
    };

    return (
        <div className={className}>
            <div
                className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-colors
          ${dragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
                    }
        `}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <Upload className="w-10 h-10 mx-auto text-slate-400 mb-3" />
                <p className="text-slate-600 dark:text-slate-400 mb-1">
                    <span className="font-medium text-primary">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-500">
                    Max file size: {maxSize}MB{multiple ? `, Max files: ${maxFiles}` : ''}
                </p>

                {accept !== '*/*' && (
                    <p className="text-xs text-slate-500 mt-1">
                        Accepted formats: {accept}
                    </p>
                )}
            </div>

            {/* Error messages */}
            {errors.length > 0 && (
                <div className="mt-3 space-y-2">
                    {errors.map((error, index) => (
                        <p key={index} className="text-sm text-red-500">
                            {error}
                        </p>
                    ))}
                </div>
            )}

            {/* Uploaded files preview */}
            {files.length > 0 && (
                <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                        <div
                            key={`${file.name}-${index}`}
                            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                {getFileIcon(file)}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <button
                                    onClick={() => removeFile(index)}
                                    className="text-slate-400 hover:text-red-500"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
