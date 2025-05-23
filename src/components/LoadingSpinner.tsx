import { Loader2Icon } from 'lucide-react';

export function LoadingSpinner({ className }: { className?: string }) {
  return <Loader2Icon className={`animate-spin ${className || ''}`} />;
} 