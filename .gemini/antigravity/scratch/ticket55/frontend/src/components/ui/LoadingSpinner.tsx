interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'secondary' | 'white';
    fullScreen?: boolean;
    message?: string;
}

export function LoadingSpinner({
    size = 'md',
    color = 'primary',
    fullScreen = false,
    message
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    const colorClasses = {
        primary: 'text-primary',
        secondary: 'text-slate-500',
        white: 'text-white'
    };

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-8 flex flex-col items-center gap-4 shadow-xl">
                    <div className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                        </svg>
                    </div>
                    {message && (
                        <p className="text-slate-600 dark:text-slate-400 text-center">
                            {message}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
            </div>
            {message && (
                <p className="text-slate-600 dark:text-slate-400 text-center">
                    {message}
                </p>
            )}
        </div>
    );
}
