import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onClose,
  className = ''
}) => {
  return (
    <div className={`flex items-center space-x-2 bg-red-50 border border-red-200 rounded-md p-4 text-red-800 ${className}`}>
      <AlertCircle size={20} className="flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-red-400 hover:text-red-600"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;