import { cn } from '../../lib/utils';

type SpinnerSize = 'small' | 'medium' | 'large';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  small: 'h-4 w-4 border-2',
  medium: 'h-8 w-8 border-3',
  large: 'h-12 w-12 border-4',
};

const LoadingSpinner = ({ size = 'medium', className }: LoadingSpinnerProps) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={cn(
          'animate-spin rounded-full border-solid border-primary-500 border-t-transparent',
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
};

export default LoadingSpinner;