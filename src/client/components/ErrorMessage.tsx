import React from 'react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  type?: 'error' | 'warning' | 'info';
  retryText?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  onRetry,
  onDismiss,
  type = 'error',
  retryText = 'Try Again'
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return {
          bg: 'bg-yellow-500/20',
          border: 'border-yellow-400/30',
          text: 'text-yellow-300',
          icon: '⚠️'
        };
      case 'info':
        return {
          bg: 'bg-blue-500/20',
          border: 'border-blue-400/30',
          text: 'text-blue-300',
          icon: 'ℹ️'
        };
      default:
        return {
          bg: 'bg-red-500/20',
          border: 'border-red-400/30',
          text: 'text-red-300',
          icon: '❌'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className={`p-4 rounded-lg border ${styles.bg} ${styles.border} animate-fade-in`}>
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0">{styles.icon}</span>
        
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={`font-semibold ${styles.text} mb-1`}>
              {title}
            </h3>
          )}
          <p className={`${styles.text} text-sm leading-relaxed`}>
            {message}
          </p>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            title="Dismiss"
          >
            ✕
          </button>
        )}
      </div>

      {onRetry && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={onRetry}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              type === 'error' 
                ? 'bg-red-500/30 hover:bg-red-500/40 text-red-200'
                : type === 'warning'
                ? 'bg-yellow-500/30 hover:bg-yellow-500/40 text-yellow-200'
                : 'bg-blue-500/30 hover:bg-blue-500/40 text-blue-200'
            }`}
          >
            {retryText}
          </button>
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;