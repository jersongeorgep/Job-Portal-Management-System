import { AlertCircle } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <AlertCircle className="h-12 w-12 text-red-400 mb-3" />
      <p className="text-red-600 text-center mb-4">{message || 'Something went wrong'}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
          Try Again
        </button>
      )}
    </div>
  );
}