import { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface ExpandableSectionProps<T> {
  title: string;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  initialCarouselCount?: number;
}

export function ExpandableSection<T>({
  title,
  items,
  renderItem,
  initialCarouselCount = 10,
}: ExpandableSectionProps<T>) {
  const [isGridMode, setIsGridMode] = useState(false);
  const [visibleCount, setVisibleCount] = useState(initialCarouselCount);

  const displayedItems = isGridMode ? items.slice(0, visibleCount) : items;
  const hasMore = isGridMode && visibleCount < items.length;

  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + 8, items.length));
  };

  const toggleMode = () => {
    setIsGridMode(!isGridMode);
    if (!isGridMode) {
      setVisibleCount(initialCarouselCount);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
        <button
          onClick={toggleMode}
          className="px-4 py-2 text-sm font-medium text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
        >
          {isGridMode ? 'Collapse' : 'View All'}
        </button>
      </div>

      {/* Carousel Mode */}
      {!isGridMode && (
        <Carousel
          opts={{
            align: 'start',
            slidesToScroll: 3,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-3">
            {displayedItems.map((item, index) => (
              <CarouselItem key={index} className="pl-3 basis-1/3">
                <div className="scale-80 origin-top">
                  {renderItem(item)}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-lg" />
          <CarouselNext className="right-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-lg" />
        </Carousel>
      )}

      {/* Grid Mode */}
      {isGridMode && (
        <div className="transition-all duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedItems.map((item, index) => (
              <div key={index}>
                {renderItem(item)}
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleShowMore}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Show More
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
