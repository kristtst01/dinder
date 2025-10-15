import { Spinner } from '@/components/ui/shadcn-io/spinner';

const LoadingSpinner = ({ isFullScreen = false }: { isFullScreen?: boolean }) => (
  <div
    className={
      isFullScreen
        ? 'flex items-center justify-center min-h-screen w-full'
        : 'flex items-center justify-center'
    }
  >
    <Spinner />
  </div>
);

export default LoadingSpinner;
